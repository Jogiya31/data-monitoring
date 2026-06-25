import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { escapeHtml, UiService } from '../../services/ui.service';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { CardsSection } from "../../components/cards-section/cards-section";

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, KpiCard, CardsSection],
  templateUrl: './alerts.html',
})
export class AlertsComponent {
  cards: Array<{ label: string; value: string; cls: string; icon: string; foot: string }>;
  escapeHtml = escapeHtml;
  alertCategory = [
    'All',
    'Critical Delay',
    'Pragati Delay',
    'Outside Grace Period',
    'Consecutive Zero',
    'Negative Value',
    'Abnormal Spike',
    'Cumulative Dip',
    'Executive Summary',
  ];
  constructor(private ui: UiService) {
    this.escapeHtml = this.ui.escapeHtml;
    this.cards = [
      {
        label: 'Total alerts',
        value: this.ui.fmtNum(191),
        cls: 'accent',
        icon: 'bell',
        foot: 'For current filters',
      },
      {
        label: 'High severity',
        value: this.ui.fmtNum(120),
        cls: 'danger',
        icon: 'exclamation-octagon',
        foot: 'Needs immediate action',
      },
      {
        label: 'Medium severity',
        value: this.ui.fmtNum(70),
        cls: 'warn',
        icon: 'exclamation-triangle',
        foot: 'Monitor closely',
      },
      {
        label: 'Unacknowledged',
        value: this.ui.fmtNum(191),
        cls: 'teal',
        icon: 'inbox',
        foot: 'Awaiting review',
      },
    ];
  }
}
