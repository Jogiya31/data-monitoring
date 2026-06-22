import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
})
export class FooterComponent {
  @Input() year = new Date().getFullYear();
}
