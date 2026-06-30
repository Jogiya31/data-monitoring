import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class HeaderComponent {

  constructor(private router: Router){}

  /* ---------- theme toggle (default: light, shared with dashboard) ---------- */
   _prefs(): any {
    let p: any = {};
    try { p = JSON.parse(localStorage.getItem('prayas.prefs') || '{}'); } catch (e) {}
    return Object.assign({ theme: 'light', scope: 'all', persist: true }, p);
  }

   _savePrefs(patch: any) {
    const p = Object.assign(this._prefs(), patch);
    try { localStorage.setItem('prayas.prefs', JSON.stringify(p)); } catch (e) {}
    localStorage.setItem('prayas.theme', p.theme);
  }

  toggleTheme() {
    const cur = document.documentElement.getAttribute('data-theme');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    this._savePrefs({ theme: next });
    this._syncThemeIcon();
    document.dispatchEvent(new CustomEvent('themechange', { detail: next }));
  }

  _syncThemeIcon() {
    const icon = document.querySelector('#btnTheme i');
    if (icon) (icon as HTMLElement).className = document.documentElement.getAttribute('data-theme') === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
  }

  gotoHome(){
    const authed = (() => { try { return localStorage.getItem('prayas.auth') === '1'; } catch (e) { return false; } })();
    this.router.navigateByUrl(authed ? '/dashboard' : '/login')
  }

  referesh(){
    window.location.reload();
  }

}
