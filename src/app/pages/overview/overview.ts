import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { heroComponent } from '../../components/hero/hero';
import { CardsSection } from '../../components/cards-section/cards-section';
import { KpiCard } from "../../components/kpi-card/kpi-card";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, heroComponent, CardsSection, KpiCard],
  templateUrl: './overview.html'
})
export class OverviewComponent {}
