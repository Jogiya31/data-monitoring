import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  @Input() cls = '';
  @Input() icon = '';
  @Input() label = '';
  @Input() value = '';
  @Input() foot = '';
  @Input() go: (() => void) | null = null;
}
