import  ApexCharts from 'apexcharts';
/* charts.service.ts — themed ApexCharts factories shared by every page.
 * Ported from pages/charts-helper.js. Charts register themselves so they can
 * re-theme on a light/dark toggle (driven by the 'themechange' document event). */
import { Injectable } from '@angular/core';
import { UiService } from './ui.service';

@Injectable({ providedIn: 'root' })
export class ChartsService {
  private registry: any[] = [];

  constructor(private ui: UiService) {
    document.addEventListener('themechange', () => this.rethemeAll());
  }

  private baseOpts(): any {
    const p = this.ui.palette();
    const dark = this.ui.isDark();
    return {
      chart: {
        fontFamily: 'Inter, sans-serif', foreColor: p.muted, toolbar: { show: false },
        background: 'transparent', animations: { speed: 350 }
      },
      grid: { borderColor: p.grid, strokeDashArray: 4, padding: { left: 6, right: 6 } },
      tooltip: { theme: dark ? 'dark' : 'light' },
      dataLabels: { enabled: false },
      legend: { fontSize: '12px', labels: { colors: p.muted }, markers: { radius: 4 } },
      noData: { text: 'No data for the current filters', style: { color: p.muted, fontSize: '13px' } }
    };
  }

  bar(el: any, { series, categories, colors, stacked, horizontal, onBarClick }: any) {
    const p = this.ui.palette();
    const opts = Object.assign(this.baseOpts(), {
      series,
      chart: Object.assign(this.baseOpts().chart, {
        type: 'bar', height: '100%',
        events: onBarClick ? {
          dataPointSelection: (_e: any, _ctx: any, cfg: any) => onBarClick(categories[cfg.dataPointIndex], cfg.seriesIndex)
        } : {}
      }),
      colors: colors || p.series,
      plotOptions: { bar: { columnWidth: '55%', borderRadius: 5, horizontal: !!horizontal } },
      xaxis: { categories, labels: { style: { fontSize: '11px' } } },
      chartOptions: {},
      ...(stacked ? { chart: Object.assign(this.baseOpts().chart, { type: 'bar', height: '100%', stacked: true, events: onBarClick ? { dataPointSelection: (_e: any, _c: any, cfg: any) => onBarClick(categories[cfg.dataPointIndex], cfg.seriesIndex) } : {} }) } : {})
    });
    return this.mount(el, opts);
  }

  donut(el: any, { labels, values, colors, onSliceClick }: any) {
    const p = this.ui.palette();
    const opts = Object.assign(this.baseOpts(), {
      series: values,
      chart: Object.assign(this.baseOpts().chart, {
        type: 'donut', height: '100%',
        events: onSliceClick ? { dataPointSelection: (_e: any, _c: any, cfg: any) => onSliceClick(labels[cfg.dataPointIndex]) } : {}
      }),
      labels, colors: colors || p.series,
      plotOptions: { pie: { donut: { size: '64%', labels: { show: true, total: { show: true, label: 'Total', color: p.muted, fontSize: '12px' } } } } },
      stroke: { width: 2, colors: [this.ui.isDark() ? '#161d2e' : '#fff'] }
    });
    return this.mount(el, opts);
  }

  pie(el: any, args: any) { return this.donut(el, args); }

  funnel(el: any, { categories, values, colors }: any) {
    const p = this.ui.palette();
    const opts = Object.assign(this.baseOpts(), {
      series: [{ name: 'Records', data: values }],
      chart: Object.assign(this.baseOpts().chart, { type: 'bar', height: '100%' }),
      colors: colors || [p.accent],
      plotOptions: { bar: { horizontal: true, borderRadius: 4, barHeight: '70%', distributed: true, isFunnel: true } },
      xaxis: { categories },
      dataLabels: { enabled: true, formatter: (v: any, o: any) => categories[o.dataPointIndex] + ': ' + v, style: { colors: ['#fff'], fontSize: '11px' } },
      legend: { show: false }
    });
    return this.mount(el, opts);
  }

  line(el: any, { series, categories, colors }: any) {
    const p = this.ui.palette();
    const opts = Object.assign(this.baseOpts(), {
      series,
      chart: Object.assign(this.baseOpts().chart, { type: 'area', height: '100%' }),
      colors: colors || p.series,
      stroke: { curve: 'smooth', width: 2 },
      fill: { type: 'gradient', gradient: { opacityFrom: .35, opacityTo: .03 } },
      xaxis: { categories }
    });
    return this.mount(el, opts);
  }

  rethemeAll() {
    this.registry = this.registry.filter((c) => c._node && document.body.contains(c._node));
    this.registry.forEach((c) => { try { c.destroy(); c._remount(); } catch (e) {} });
  }

  /** Destroy every registered chart and clear the registry. Called by a page
   * component on teardown so charts don't leak across route changes. */
  destroyAll() {
    this.registry.forEach((c) => { try { if (c._node) c._node._chart = null; c.destroy(); } catch (e) {} });
    this.registry = [];
  }

  private mount(el: any, opts: any): any {
    const node = typeof el === 'string' ? document.querySelector(el) : el;
    if (!node) return null;
    if ((node as any)._chart) { try { (node as any)._chart.destroy(); } catch (e) {} this.registryRemove((node as any)._chart); }
    const chart: any = new ApexCharts(node, opts);
    chart.render();
    chart._node = node; (node as any)._chart = chart;
    chart._remount = () => { const c: any = new ApexCharts(node, opts); c.render(); (node as any)._chart = c; };
    this.registry.push(chart);
    return chart;
  }
  private registryRemove(c: any) { const i = this.registry.indexOf(c); if (i > -1) this.registry.splice(i, 1); }
}
