import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-section',
  standalone: true,
  templateUrl: './cards-section.html',
  styleUrl: './cards-section.css',

})
export class CardsSection {
  @Input() title = 'Complete dataset';
  @Input() icon = '';
  @Input() info = '';

}
