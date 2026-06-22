import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: number | string;
}

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiselect.html',
  styleUrl: './multiselect.css',
})
export class MultiselectComponent {
  @Input() placeholder = 'Select Items';

  @Input() options: SelectOption[] = [];

  @Output() selectionChange = new EventEmitter<SelectOption[]>();

  searchText = '';

  selectedItems: SelectOption[] = [];

  get filteredOptions(): SelectOption[] {
    const search = this.searchText?.trim().toLowerCase();

    if (!search) {
      return this.options;
    }

    return this.options.filter((item) => item.label.toLowerCase().includes(search));
  }

  get displayText(): string {
    if (this.selectedItems.length === 0) {
      return this.placeholder;
    }

    if (this.selectedItems.length === 1) {
      return this.selectedItems[0].label;
    }

    return `${this.selectedItems.length} Selected`;
  }

  toggleSelection(item: SelectOption): void {
    const index = this.selectedItems.findIndex((selected) => selected.value === item.value);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }

    this.selectionChange.emit([...this.selectedItems]);
  }

  isSelected(item: SelectOption): boolean {
    return this.selectedItems.some((selected) => selected.value === item.value);
  }

  selectAll(): void {
    const selectedValues = new Set(this.selectedItems.map((item) => item.value));

    this.filteredOptions.forEach((item) => {
      if (!selectedValues.has(item.value)) {
        this.selectedItems.push(item);
      }
    });

    this.selectionChange.emit([...this.selectedItems]);
  }

  clearAll(): void {
    this.selectedItems = [];
    this.selectionChange.emit([]);
  }
}
