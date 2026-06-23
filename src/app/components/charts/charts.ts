import { ChartsService } from './../../services/charts.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-chart',
  standalone: true,
  templateUrl: './charts.html'
})
export class ChartComponent implements OnInit, OnDestroy {

  @ViewChild('chartRef', { static: true })
  chartRef!: ElementRef;

  @Input() type:
    | 'bar'
    | 'line'
    | 'area'
    | 'donut'
    | 'pie' = 'bar';

  @Input() title = '';
  @Input() categories: string[] = [];
  @Input() series: any[] = [];
  @Input() colors: string[] = [];
  @Input() height = 350;

  @Output() pointClick = new EventEmitter<any>();

  chart: any;

  constructor(private chartsService: ChartsService) {}

  ngOnInit() {
    this.renderChart();
  }

  renderChart() {
    const commonArgs: any = {
      categories: this.categories,
      colors: this.colors,
      series: this.series
    };

    if (this.type === 'bar') {
      this.chart = this.chartsService.bar(this.chartRef.nativeElement, {
        ...commonArgs,
        onBarClick: (category: string, seriesIndex: number) => {
          this.pointClick.emit({ category, seriesIndex });
        }
      });
    } else if (this.type === 'donut' || this.type === 'pie') {
      this.chart = this.chartsService.donut(this.chartRef.nativeElement, {
        labels: this.categories,
        values: this.series,
        colors: this.colors,
        onSliceClick: (label: string) => this.pointClick.emit(label)
      });
    } else {
      this.chart = this.chartsService.line(this.chartRef.nativeElement, {
        ...commonArgs
      });
    }

    if (this.chart && this.title) {
      try {
        this.chart.updateOptions({ title: { text: this.title } }, false, true);
      } catch (e) {
        // ignore invalid title update
      }
    }
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }
}