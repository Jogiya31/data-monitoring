import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header';
import { SidebarComponent } from './sidebar/sidebar';
import { FilterBarComponent } from './filters/filters';
import { FooterComponent } from './footer/footer';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, FilterBarComponent, FooterComponent],
  templateUrl: './shell.html',
})
export class ShellComponent {
  currentYear = new Date().getFullYear();

  selectedFiltersChange(filterState: any) {
    console.log('Received filter state in ShellComponent:', filterState);
  }

}
