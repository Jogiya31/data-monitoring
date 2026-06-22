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

  // Parent controls selection
  @Input() selectedItems: SelectOption[] = [];

  @Output() selectionChange = new EventEmitter<SelectOption[]>();

  searchText = '';

  get filteredOptions(): SelectOption[] {
    const search = this.searchText.trim().toLowerCase();

    if (!search) {
      return this.options;
    }

    return this.options.filter((item) => item.label.toLowerCase().includes(search));
  }

  get displayText(): string {
    if (!this.selectedItems.length) {
      return this.placeholder;
    }

    if (this.selectedItems.length === 1) {
      return this.selectedItems[0].label;
    }

    return `${this.selectedItems.length} Selected`;
  }

  get selectedCount(): number {
    return this.selectedItems.length;
  }

  toggleSelection(item: SelectOption): void {
    const exists = this.selectedItems.some((selected) => selected.value === item.value);

    const updated = exists
      ? this.selectedItems.filter((selected) => selected.value !== item.value)
      : [...this.selectedItems, item];

    this.selectionChange.emit(updated);
  }

  isSelected(item: SelectOption): boolean {
    return this.selectedItems.some((selected) => selected.value === item.value);
  }

  selectAll(): void {
    const selectedValues = new Set(this.selectedItems.map((item) => item.value));

    const updated = [...this.selectedItems];

    this.filteredOptions.forEach((item) => {
      if (!selectedValues.has(item.value)) {
        updated.push(item);
      }
    });

    this.selectionChange.emit(updated);
  }

  clearAll(): void {
    this.selectionChange.emit([]);
  }
}
