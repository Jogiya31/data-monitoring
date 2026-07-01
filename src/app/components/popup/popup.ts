import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.html',
  styleUrls: ['./popup.css']
})
export class PopupComponent {

  // Modal
  @Input() modalId = 'popupModal';

  // Header
  @Input() title = '';
  @Input() icon = '';

  @Input() showHeader = true;
  @Input() showFooter = true;

  // Buttons

  @Input() closeText = 'Close';
  @Input() saveText = 'Save';

  @Input() closeIcon = 'bi bi-x-circle';
  @Input() saveIcon = 'bi bi-check-circle';

  @Input() showCloseButton = true;
  @Input() showSaveButton = true;

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
    | 'modal-fullscreen-xxl-down'
    = '';

  // Colors

  @Input() headerClass = '';
  @Input() bodyClass = '';
  @Input() footerClass = '';

  @Input() centered = false;
  @Input() scrollable = false;

  @Input() backdrop: boolean | 'static' = true;
  @Input() keyboard = true;

  @Output() save = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();

  onSave() {
    this.save.emit();
  }

  onClose() {
    this.close.emit();
  }

  get dialogClasses() {
    return {
      [this.size]: true,
      'modal-dialog-centered': this.centered,
      'modal-dialog-scrollable': this.scrollable
    };
  }

}