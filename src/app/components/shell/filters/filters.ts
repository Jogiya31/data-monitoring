import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiselectComponent } from '../../multiselect/multiselect';

export interface FilterOption {
  label: string;
  value: string | number;
}

export interface FilterState {
  sectors: FilterOption[];
  departments: FilterOption[];
  states: FilterOption[];
  districts: FilterOption[];
  schemes: FilterOption[];
  kpis: FilterOption[];
  frequencies: FilterOption[];
  search: string;
  fromDate: string;
  toDate: string;
  mode: string;
}

export type FilterArrayKey = Exclude<keyof FilterState, 'search' | 'fromDate' | 'toDate' | 'mode'>;

export interface ActiveChip {
  group: FilterArrayKey;
  label: string;
  value: string | number;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, MultiselectComponent],
  templateUrl: './filters.html',
  styleUrls: ['./filters.css'],
})
export class FilterBarComponent {
  @Output() filtersChange = new EventEmitter<FilterState>();

  isOpen = false;

  dirty = false;

  chipLimit = 8;

  chipsExpanded = false;

  activeLabel = 'Active Filters';

  mode: 'all' | 'critical' | 'pragati' = 'all';

  // ==========================================
  // FILTER OPTIONS
  // ==========================================

  sectorList: FilterOption[] = [
    { label: 'Agriculture & Rural', value: 1 },
    { label: 'Social & Welfare', value: 2 },
    { label: 'Finance & Economy', value: 3 },
    { label: 'Infrastructure & Resources', value: 4 },
    { label: 'Technology & Governance', value: 5 },
    { label: 'Foreign & Security', value: 6 },
    { label: 'Human Resources', value: 7 },
  ];

  departmentList: FilterOption[] = [
    { label: 'Department of Commerce', value: 1 },
    { label: 'Department of Consumer Affairs', value: 2 },
    { label: 'Ministry of Finance', value: 3 },
  ];

  stateList: FilterOption[] = [
    { label: 'Andhra Pradesh', value: 1 },
    { label: 'Bihar', value: 2 },
    { label: 'Gujarat', value: 3 },
  ];

  districtList: FilterOption[] = [
    { label: '24 Parganas North', value: 1 },
    { label: '24 Parganas South', value: 2 },
    { label: 'Adilabad', value: 3 },
  ];

  schemeList: FilterOption[] = [
    { label: 'Scheme A', value: 1 },
    { label: 'Scheme B', value: 2 },
  ];

  kpiList: FilterOption[] = [
    { label: 'KPI A', value: 1 },
    { label: 'KPI B', value: 2 },
  ];

  frequencyList: FilterOption[] = [
    { label: 'Daily', value: 1 },
    { label: 'Weekly', value: 2 },
    { label: 'Monthly', value: 3 },
  ];

  // ==========================================
  // CENTRAL FILTER STATE
  // ==========================================

  filterState: FilterState = {
    sectors: [],
    departments: [],
    states: [],
    districts: [],
    schemes: [],
    kpis: [],
    frequencies: [],
    search: '',
    fromDate: '',
    toDate: '',
    mode: 'all',
  };

  // ==========================================
  // PANEL TOGGLE
  // ==========================================

  handleToggle(): void {
    this.isOpen = !this.isOpen;
  }

  // ==========================================
  // SCOPE RADIO
  // ==========================================

  onModeChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.mode = target.value as 'all' | 'critical' | 'pragati';
    this.dirty = true;
    console.log('Mode changed:', this.mode);
  }

  // ==========================================
  // FILTER UPDATE
  // ==========================================

  updateFilter(key: FilterArrayKey, items: FilterOption[]): void {
    this.filterState = {
      ...this.filterState,
      [key]: [...items],
    };
    this.dirty = true;
  }

  // ==========================================
  // FILTER SEARCH
  // ==========================================
  onSearchChange(value: string): void {
    this.filterState = {
      ...this.filterState,
      search: value,
    };
    this.dirty = true;
  }

  // ==========================================
  // DATE RANGE
  // ==========================================

  onFromDateChange(value: string): void {
    this.filterState = {
      ...this.filterState,
      fromDate: value,
    };
    this.dirty = true;
  }

  onToDateChange(value: string): void {
    this.filterState = {
      ...this.filterState,
      toDate: value,
    };
    this.dirty = true;
  }

  // ==========================================
  // TOTAL COUNT
  // ==========================================

  get totalSelectedCount(): number {
    return (Object.keys(this.filterState) as Array<FilterArrayKey>)
      .filter((key) => Array.isArray(this.filterState[key as FilterArrayKey]))
      .reduce((total, current) => total + this.filterState[current as FilterArrayKey].length, 0);
  }

  // ==========================================
  // ACTIVE CHIPS
  // ==========================================

  get activeChips(): ActiveChip[] {
    const chips: ActiveChip[] = [];

    (Object.keys(this.filterState) as Array<FilterArrayKey>)
      .filter((key) => Array.isArray(this.filterState[key]))
      .forEach((group) => {
        const arrayItems = this.filterState[group];
        if (Array.isArray(arrayItems)) {
          arrayItems.forEach((item) => {
            chips.push({
              group,
              label: item.label,
              value: item.value,
            });
          });
        }
      });

    return chips;
  }

  // ==========================================
  // DISPLAYED CHIPS
  // ==========================================

  get displayedChips(): ActiveChip[] {
    return this.chipsExpanded ? this.activeChips : this.activeChips.slice(0, this.chipLimit);
  }

  // ==========================================
  // HIDDEN CHIP COUNT
  // ==========================================

  get hiddenChipCount(): number {
    return Math.max(0, this.activeChips.length - this.chipLimit);
  }

  // ==========================================
  // CHIP EXPAND/COLLAPSE
  // ==========================================

  toggleChips(expanded: boolean): void {
    this.chipsExpanded = expanded;
  }

  // ==========================================
  // REMOVE CHIP
  // ==========================================

  removeChip(group: FilterArrayKey, value: string | number): void {
    this.filterState = {
      ...this.filterState,
      [group]: this.filterState[group].filter((item) => item.value !== value),
    };

    if (this.activeChips.length <= this.chipLimit) {
      this.chipsExpanded = false;
    }
    this.dirty = true;
  }

  // ==========================================
  // CLEAR ALL
  // ==========================================

  clearAllFilters(): void {
    this.filterState = {
      sectors: [],
      departments: [],
      states: [],
      districts: [],
      schemes: [],
      kpis: [],
      frequencies: [],
      search: '',
      fromDate: '',
      toDate: '',
      mode: 'all',
    };

    this.chipsExpanded = false;
    this.dirty = false;
  }

  // ==========================================
  // FILTER COUNT
  // ==========================================

  getCount(key: FilterArrayKey): number {
    return this.filterState[key].length;
  }

  // ==========================================
  // DISPLAY TEXT
  // ==========================================

  getDisplayText(key: FilterArrayKey, placeholder: string): string {
    const selected = this.filterState[key];

    if (!selected.length) {
      return placeholder;
    }

    if (selected.length === 1) {
      return selected[0].label;
    }

    return `${selected[0].label} +${selected.length - 1}`;
  }

  // ==========================================
  // CHIP LABEL TRUNCATION
  // ==========================================

  truncate(text: string, limit = 30): string {
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  // ==========================================
  // APPLY
  // ==========================================

  applyFilters(): void {
    console.log('Applied Filters:', this.filterState);
    this.filtersChange.emit(this.filterState);
    this.dirty = false;
  }
}
