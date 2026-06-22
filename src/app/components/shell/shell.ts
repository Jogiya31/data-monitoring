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

  selectedSectors: any[] = [];
  selectedDepartments: any[] = [];
  selectedStates: any[] = [];
  selectedDistricts: any[] = [];
  selectedSchemes: any[] = [];
  selectedKPIs: any[] = [];
  selectedDataFrequencies: any[] = [];

  onSectorChange(items: any[]) {
    this.selectedSectors = items;
    console.log(items);
  }

  onDepartmentChange(items: any[]) {
    this.selectedDepartments = items;
    console.log(items);
  }

  onStateChange(items: any[]) {
    this.selectedStates = items;
    console.log(items);
  }

  onDistrictChange(items: any[]) {
    this.selectedDistricts = items;
    console.log(items);
  }

  onSchemeChange(items: any[]) {
    this.selectedSchemes = items;
    console.log(items);
  }

  onKPIChange(items: any[]) {
    this.selectedKPIs = items;
    console.log(items);
  }

  onDataFrequencyChange(items: any[]) {
    this.selectedDataFrequencies = items;
    console.log(items);
  }

}
