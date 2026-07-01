import {
  Component,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PopupComponent } from "../../popup/popup";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, PopupComponent],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {

  constructor(
    private router: Router,
    private elementRef: ElementRef
  ) {}

  isBellOpen = false;
  isProfileOpen = false;

  notifications = [
    {
      title: 'No new alerts',
      time: 'Just now',
      severity: 'low',
    },
  ];

  toggleBell(event: MouseEvent): void {
    event.stopPropagation();

    this.isBellOpen = !this.isBellOpen;

    if (this.isBellOpen) {
      this.isProfileOpen = false;
    }
  }

  toggleProfile(event: MouseEvent): void {
    event.stopPropagation();

    this.isProfileOpen = !this.isProfileOpen;

    if (this.isProfileOpen) {
      this.isBellOpen = false;
    }
  }

  @HostListener('document:click', ['$event'])

  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isBellOpen = false;
      this.isProfileOpen = false;
    }
  }

  prefs(): any {
    let p: any = {};

    try {
      p = JSON.parse(localStorage.getItem('prayas.prefs') || '{}');
    } catch {}

    return Object.assign(
      {
        theme: 'light',
        scope: 'all',
        persist: true,
      },
      p
    );
  }

  savePrefs(patch: any): void {
    const p = Object.assign(this.prefs(), patch);

    localStorage.setItem('prayas.prefs', JSON.stringify(p));
    localStorage.setItem('prayas.theme', p.theme);
  }

  toggleTheme(): void {
    const current =
      document.documentElement.getAttribute('data-theme') || 'light';

    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);

    this.savePrefs({
      theme: next,
    });

    document.dispatchEvent(
      new CustomEvent('themechange', {
        detail: next,
      })
    );
  }

  gotoHome(): void {
    const authed = localStorage.getItem('prayas.auth') === '1';

    this.router.navigateByUrl(
      authed ? '/dashboard' : '/login'
    );
  }

  referesh(): void {
    window.location.reload();
  }

  logout(): void {
    localStorage.removeItem('prayas.auth');
    this.router.navigate(['/login']);
  }
}