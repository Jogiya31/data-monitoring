import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiselect',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './multiselect.html',
  styleUrls: ['./multiselect.css'],
})
export class MultiselectComponent {
  @Input() options: any[] = [];

  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: any[] = [];

  toggleSelection(item: any) {
    const index = this.selectedItems.findIndex((x) => x.value === item.value);

    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }

    this.selectionChange.emit([...this.selectedItems]);
  }

  isSelected(item: any) {
    return this.selectedItems.some((x) => x.value === item.value);
  }

  selectAll() {
    this.selectedItems = [...this.options];
    this.selectionChange.emit(this.selectedItems);
  }

  clearAll() {
    this.selectedItems = [];
    this.selectionChange.emit(this.selectedItems);
  }
}
