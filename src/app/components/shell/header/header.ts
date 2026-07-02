import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PopupComponent } from '../../popup/popup';
import { FormsModule } from '@angular/forms';

type Prefs = {
  theme: 'light' | 'dark';
  scope: 'all' | 'critical' | 'pragati';
  persist: boolean;
};

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, PopupComponent, FormsModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private elementRef: ElementRef,
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

  cur: Prefs = this.prefs();
  prefForm: Prefs = { ...this.cur };

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

  prefs(): Prefs {
    let p: Partial<Prefs> = {};

    try {
      p = JSON.parse(localStorage.getItem('prayas.prefs') || '{}');
    } catch {}

    return {
      theme: p.theme === 'dark' ? 'dark' : 'light',
      scope: p.scope === 'critical' || p.scope === 'pragati' || p.scope === 'all' ? p.scope : 'all',
      persist: typeof p.persist === 'boolean' ? p.persist : true,
    };
  }

  savePrefs(patch: Partial<Prefs>): void {
    const p: Prefs = {
      ...this.prefs(),
      ...patch,
    };

    localStorage.setItem('prayas.prefs', JSON.stringify(p));
    localStorage.setItem('prayas.theme', p.theme);

    // keep UI state synced after save
    this.cur = { ...p };
    this.prefForm = { ...p };
  }

  openPreferences(): void {
    // always load latest saved values when opening modal
    this.cur = this.prefs();
    this.prefForm = { ...this.cur };
  }

  toggleTheme(): void {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', next);

    this.savePrefs({
      theme: next as 'light' | 'dark',
    });

    document.dispatchEvent(
      new CustomEvent('themechange', {
        detail: next,
      }),
    );
  }

  gotoHome(): void {
    const authed = localStorage.getItem('prayas.auth') === '1';
    this.router.navigateByUrl(authed ? '/dashboard' : '/login');
  }

  refresh(): void {
    window.location.reload();
  }

  handleNotification(): void {
    this.router.navigate(['/alerts']);
  }

  logout(): void {
    localStorage.removeItem('prayas.auth');
    localStorage.removeItem('prayas.prefs');
    this.router.navigate(['/login']);
  }

  handleTriggerAction(event: { type: string; modalId: string }): void {
    switch (event.modalId) {
      case 'preferencesModal':
        if (event.type === 'save') {
          this.savePrefs(this.prefForm);

          // apply selected theme immediately
          document.documentElement.setAttribute('data-theme', this.prefForm.theme);

          document.dispatchEvent(
            new CustomEvent('themechange', {
              detail: this.prefForm.theme,
            }),
          );
        }

        if (event.type === 'close') {
          // discard unsaved changes
          this.prefForm = { ...this.cur };
        }
        break;

      case 'logoutModal':
        if (event.type === 'save') {
          this.logout();
        }
        break;
    }
  }
}
