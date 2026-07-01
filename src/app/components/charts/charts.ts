import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  ViewChild,
} from '@angular/core';

import { ChartsService } from '../../services/charts.service';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './charts.html',
})
export class ChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartRef', { static: true })
  chartRef!: ElementRef;

  @Input() type: 'bar' | 'line' | 'pie' | 'donut' | 'funnel' = 'bar';
  @Input() stacked = false;
  @Input() horizontal = false;
  @Input() title = '';
  @Input() categories: string[] = [];
  @Input() series: any[] = [];
  @Input() colors: string[] = [];

  @Output() pointClick = new EventEmitter<any>();

  chart: any;
  private resizeObserver: ResizeObserver | null = null;
  private resizeTimer: any = null;

  constructor(private chartsService: ChartsService) {}

  ngOnInit(): void {
    // keep empty — render after view init so layout measurements resolve
  }

  ngAfterViewInit(): void {
    // ensure host has an explicit height before rendering
    this.ensureHostHeightFromParent();
    this.renderChart();
    this.initResizeObserver();
  }

  private ensureHostHeightFromParent(): void {
    try {
      const hostEl: HTMLElement = this.chartRef.nativeElement.parentElement || this.chartRef.nativeElement;
      // find nearest ancestor with .chart-box
      let anc: HTMLElement | null = hostEl;
      while (anc && !anc.classList.contains('chart-box')) {
        anc = anc.parentElement;
      }

      if (anc) {
        const rect = anc.getBoundingClientRect();
        // prefer actual height if available, otherwise fallback to computed min-height
        let height = rect && rect.height && rect.height > 0 ? `${Math.round(rect.height)}px` : '';
        if (!height) {
          const cs = window.getComputedStyle(anc);
          const minH = cs.getPropertyValue('min-height');
          if (minH && minH !== '0px' && minH !== 'none') {
            height = minH;
          }
        }

        if (height) {
          (this.chartRef.nativeElement as HTMLElement).style.height = height;
          if (this.chartRef.nativeElement.parentElement) {
            (this.chartRef.nativeElement.parentElement as HTMLElement).style.height = height;
          }
        }
      }
    } catch (err) {
      // ignore
    }
  }

  private initResizeObserver(): void {
    try {
      const hostEl = this.chartRef.nativeElement.parentElement || this.chartRef.nativeElement;
      // observe the nearest .chart-box if present, else observe host
      let target: Element | null = hostEl;
      let anc: HTMLElement | null = hostEl as HTMLElement;
      while (anc && !anc.classList.contains('chart-box')) {
        anc = anc.parentElement;
      }
      if (anc) target = anc;

      if (window.ResizeObserver && target) {
        this.resizeObserver = new ResizeObserver(() => {
          // debounce
          if (this.resizeTimer) clearTimeout(this.resizeTimer);
          this.resizeTimer = setTimeout(() => {
            this.ensureHostHeightFromParent();
            try {
              if (this.chart && typeof this.chart.resize === 'function') {
                this.chart.resize();
              }
            } catch (e) {
              // ignore
            }
          }, 80);
        });
        this.resizeObserver.observe(target as Element);
      }
    } catch (err) {
      // ignore
    }
  }

  private renderChart(): void {
    const commonArgs = {
      categories: this.categories,
      colors: this.colors,
      series: this.series,
      stacked: this.stacked,
      horizontal: this.horizontal,
      height: '100%',
    };

    switch (this.type) {
      case 'bar':
        this.chart = this.chartsService.bar(this.chartRef.nativeElement, {
          ...commonArgs,
          onBarClick: (category: string, seriesIndex: number) => {
            this.pointClick.emit({
              category,
              seriesIndex,
            });
          },
        });
        break;

      case 'line':
        this.chart = this.chartsService.line(this.chartRef.nativeElement, {
          ...commonArgs,
          height: '100%',
        });
        break;

      case 'pie':
      case 'donut':
        this.chart = this.chartsService.donut(this.chartRef.nativeElement, {
          labels: this.categories,
          values: this.series,
          colors: this.colors,
          height: '100%',
          isPie: this.type === 'pie',
          onSliceClick: (label: string) => {
            this.pointClick.emit(label);
          },
        });
        break;

      case 'funnel':
        this.chart = this.chartsService.funnel(this.chartRef.nativeElement, {
          categories: this.categories,
          values: this.series,
          colors: this.colors,
          height: '100%',
        });
        break;
    }

    if (this.chart && this.title) {
      try {
        this.chart.updateOptions(
          {
            title: {
              text: this.title,
              align: 'center',
            },
          },
          false,
          true,
        );
      } catch (err) {
        console.error(err);
      }
    }

    // ensure host/container have explicit height so chart library can size correctly
    this.ensureHostHeightFromParent();

    // if the chart lib exposes a resize method, call it
    try {
      if (this.chart && typeof this.chart.resize === 'function') {
        this.chart.resize();
      }
    } catch (err) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    try {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
      if (this.resizeTimer) {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = null;
      }
    } catch (err) {
      // ignore
    }
  }
}
