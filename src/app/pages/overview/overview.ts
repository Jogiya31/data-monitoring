import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { heroComponent } from '../../components/hero/hero';
import { CardsSection } from '../../components/cards-section/cards-section';
import { KpiCard } from '../../components/kpi-card/kpi-card';
import { DataTableComponent } from '../../components/data-table/data-table';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, heroComponent, CardsSection, KpiCard, DataTableComponent],
  templateUrl: './overview.html',
})
export class OverviewComponent {
  loading = false;

  tableColumns = [
    { title: 'State' },
    { title: 'District' },
    { title: 'Village' },
    { title: 'Critical' },
  ];

  tableData = [
    ['Delhi', 'North', 'Village 1', 'Y'],
    ['UP', 'Noida', 'Village 2', 'N'],
  ];
}
