import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { escapeHtml, UiService } from '../../services/ui.service';
import { CardsSection } from '../../components/cards-section/cards-section';
import { DataTableComponent } from '../../components/data-table/data-table';
import { ChartComponent } from '../../components/charts/charts';

@Component({
  selector: 'app-anomaly',
  standalone: true,
  imports: [CommonModule, KpiCard, CardsSection, DataTableComponent, ChartComponent],
  templateUrl: './anomaly.html',
})
export class AnomalyComponent {
  cards: Array<{ label: string; value: string; cls: string; icon: string; foot: string }>;
  bands: Array<{ label: string; value: string; cls: string; icon: string; foot: string }>;
  private palette: any;
  escapeHtml = escapeHtml;
  funnelColors: string[] = [];
  lineColors: string[] = [];
  DistrictColors: string[] = [];
  barColors: string[] = [];

  constructor(private ui: UiService) {
    this.palette = this.ui.palette();
    this.escapeHtml = this.ui.escapeHtml;
    this.cards = [
      {
        label: 'Zero value',
        value: this.ui.fmtNum(128),
        cls: 'warn',
        icon: '0-circle',
        foot: 'Current value = 0',
      },
      {
        label: 'Consecutive zero',
        value: this.ui.fmtNum(51),
        cls: 'danger',
        icon: 'stack',
        foot: 'Current + previous = 0',
      },
      {
        label: 'Negative value',
        value: this.ui.fmtNum(115),
        cls: 'danger',
        icon: 'dash-circle',
        foot: 'Current value < 0',
      },
      {
        label: 'Cumulative dip',
        value: this.ui.fmtNum(1240),
        cls: 'warn',
        icon: 'graph-down',
        foot: 'Current < previous',
      },
      {
        label: 'Abnormal spikes',
        value: this.ui.fmtNum(1104),
        cls: 'accent',
        icon: 'graph-up',
        foot: 'Positive growth vs previous',
      },
    ];
    this.funnelColors = [this.palette.primary, this.palette.warn, this.palette.danger];
    this.lineColors = [this.palette.danger];
    this.DistrictColors = [this.palette.warn];
    this.barColors = [this.palette.accent];

    this.bands = [
      {
        label: '0% – 5%',
        value: this.ui.fmtNum(112),
        cls: 'ok',
        icon: 'graph-up',
        foot: 'Mild positive movement',
      },
      {
        label: '5% – 25%',
        value: this.ui.fmtNum(299),
        cls: 'warn',
        icon: 'graph-up-arrow',
        foot: 'Notable growth',
      },
      {
        label: 'Above 25%',
        value: this.ui.fmtNum(693),
        cls: 'danger',
        icon: 'exclamation-triangle',
        foot: 'Abnormal spike',
      },
    ];
  }

  /* ---- Section 1: Zero value ---------------------------------------- */
  lineChartcategories = ['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Half-Yearly', 'Yearly'];
  // Chart service expects an array of series objects for line charts
  lineChartseries = [
    {
      name: 'Value',
      data: [27, 20, 25, 17, 21, 18],
    },
  ];

  tableData = [];
  tableColumns = [
    { title: 'Scheme' },
    { title: 'Department' },
    { title: 'KPI' },
    { title: 'Frequency' },
    { title: 'State' },
    { title: 'prev value' },
    { title: 'received' },
  ];

  /* ---- Section 2: Consecutive zero ---------------------------------- */
  consecutiveCategories = [
    'Ministry of Women…',
    'Ministry of Power',
    'Department of Agr…',
    'Department of Rur…',
    'Ministry of New a…',
    'Department of Lan…',
    'Department of Hig…',
    'Department of Hea…',
  ];
  consecutiveSeries = [{ name: 'Consecutive zero', data: [9, 9, 8, 5, 5, 5, 3, 2] }];

  /* ---- Section 3: Negative value ------------------------------------ */
  consecutiveTableColumns = [
    { title: 'Scheme' },
    { title: 'Department' },
    { title: 'KPI' },
    { title: 'Frequency' },
    { title: 'State' },
    { title: 'District' },
  ];

  /* ---- Section 4: Cumulative dip ------------------------------------ */

  funnelCategories = ['Records in scope', 'Cumulative dips', 'Severe dips (>50%)'];
  funnelSeries = [1483, 1240, 316];

  dipTrendCategory = [];
  dipTrendSeries = [
    {
      name: 'Dips',
      data: [236, 188, 200, 190, 224, 202],
    },
  ];

  stateCategory = [
    'Madhya Pradesh',
    'Rajasthan',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Gujarat',
    'Odisha',
    'Bihar',
  ];
  stateSeries = [
    {
      name: 'Dips',
      data: [138, 136, 133, 128, 124, 122, 121, 121],
    },
  ];
}
