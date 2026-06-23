import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  imports: [],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.css',
})
export class KpiCard {
  @Input() cls: string = '';
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() value: string | number | null = null;
  @Input() foot: string = '';
  @Input() go: (() => void) | null = null;
}
