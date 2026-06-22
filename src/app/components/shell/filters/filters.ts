import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiselectComponent } from '../../multiselect/multiselect';

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiselectComponent],
  templateUrl: './filters.html',
  styleUrls: ['./filters.css'],
})
export class FilterBarComponent {
  
  @Output() sectorChange = new EventEmitter<any[]>();
  @Output() departmentChange = new EventEmitter<any[]>();
  @Output() stateChange = new EventEmitter<any[]>();
  @Output() districtChange = new EventEmitter<any[]>();
  @Output() schemeChange = new EventEmitter<any[]>();
  @Output() kpiChange = new EventEmitter<any[]>();
  @Output() dataFrequencyChange = new EventEmitter<any[]>();
  @Output() modeChange = new EventEmitter<any>();

  isOpen = false;

  sectorList = [
    { label: 'Agriculture & Rural', value: 1 },
    { label: 'Social & Welfare', value: 2 },
    { label: 'Finance & Economy', value: 3 },
    { label: 'Infrastructure & Resources', value: 4 },
    { label: 'Technology & Governance', value: 5 },
    { label: 'Foreign & Security', value: 6 },
    { label: 'Human Resources', value: 7 },
  ];

  handleToggle() {
    this.isOpen = !this.isOpen;
  }

  onSectorChange(items: any[]) {
    this.sectorChange.emit(items);
  }

  onDepartmentChange(items: any[]) {
    this.departmentChange.emit(items);
  }

  onStateChange(items: any[]) {
    this.stateChange.emit(items);
  }

  onDistrictChange(items: any[]) {
    this.districtChange.emit(items);
  }

  onSchemeChange(items: any[]) {
    this.schemeChange.emit(items);
  }

  onKPIChange(items: any[]) {
    this.kpiChange.emit(items);
  }
  onDataFrequencyChange(items: any[]) {
    this.dataFrequencyChange.emit(items);
  }

  onModeChange($event: any) {
    this.modeChange.emit($event);
  }
  
}
