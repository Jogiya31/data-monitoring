import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PopupActionType = 'save' | 'close';

export interface PopupActionEvent {
  type: PopupActionType;
  modalId: string;
}

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css'],
})
export class PopupComponent {
  // Modal
  @Input() modalId = 'popupModal';
  @Input() dialogClass = '';

  // Header
  @Input() title = '';
  @Input() icon = '';
  @Input() iconColor = '';

  @Input() showHeader = true;
  @Input() showFooter = true;

  // Buttons
  @Input() closeText = 'Close';
  @Input() saveText = 'Save';

  @Input() closeIcon = '';
  @Input() saveIcon = '';

  @Input() showCloseButton = true;
  @Input() showSaveButton = true;

  @Input() closeButtonClass = 'soft';
  @Input() saveButtonClass = 'primary-solid';

  // Loading
  @Input() loading = false;

  // Modal Size
  @Input() size:
    | ''
    | 'modal-sm'
    | 'modal-lg'
    | 'modal-xl'
    | 'modal-fullscreen'
    | 'modal-fullscreen-sm-down'
    | 'modal-fullscreen-md-down'
    | 'modal-fullscreen-lg-down'
    | 'modal-fullscreen-xl-down'
    | 'modal-fullscreen-xxl-down' = '';

  // Classes
  @Input() headerClass = '';
  @Input() bodyClass = '';
  @Input() footerClass = '';

  @Input() centered = false;
  @Input() scrollable = false;

  @Input() backdrop: boolean | 'static' = true;
  @Input() keyboard = true;

  @Output() action = new EventEmitter<PopupActionEvent>();

  onAction(type: PopupActionType): void {
    this.action.emit({
      type,
      modalId: this.modalId,
    });
  }

  get dialogClasses(): string[] {
    const classes: string[] = [];

    if (this.size) {
      classes.push(this.size);
    }

    if (this.centered) {
      classes.push('modal-dialog-centered');
    }

    if (this.scrollable) {
      classes.push('modal-dialog-scrollable');
    }

    if (this.dialogClass) {
      classes.push(this.dialogClass);
    }

    return classes;
  }
}