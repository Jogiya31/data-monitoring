import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { heroComponent } from '../../components/hero/hero';
import { CardsSection } from '../../components/cards-section/cards-section';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, heroComponent,CardsSection],
  templateUrl: './overview.html'
})
export class OverviewComponent {}
