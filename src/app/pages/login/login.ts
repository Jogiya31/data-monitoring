/* login.component.ts — the authentication page (formerly login.html).
 * A faithful port of the inline scripts: Sign In / Sign Up tabs, show/hide
 * password, inline validation, matrix code-rain, theme toggle and the i18n
 * language switcher. On success it sets the auth flag and routes to the
 * dashboard. Page-local CSS is scoped via login.component.css (emulated
 * encapsulation; custom properties defined on :host so they don't leak). */
import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18n } from '../../services/i18n.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements AfterViewInit, OnDestroy {
  private matrixTimer: any = null;
  private onResize: (() => void) | null = null;
  private onDocClick: (() => void) | null = null;
  private onI18nChange: (() => void) | null = null;

  constructor(private host: ElementRef, private router: Router, private I18n: I18n) {}

  ngAfterViewInit(): void {
    document.body.classList.remove('app-loading');
    const root: HTMLElement = this.host.nativeElement;
    this.initMatrix(root);
    this.initTheme(root);
    this.initAuth(root);
  }

  ngOnDestroy(): void {
    if (this.matrixTimer) clearInterval(this.matrixTimer);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.onDocClick) document.removeEventListener('click', this.onDocClick);
    if (this.onI18nChange) document.removeEventListener('i18n:change', this.onI18nChange);
  }

  /* ---------- matrix rain ---------- */
  private initMatrix(root: HTMLElement): void {
    const c = root.querySelector('#matrix') as HTMLCanvasElement;
    if (!c) return;
    const x = c.getContext('2d')!;
    const chars = 'PRAYAS01アイウエオｻｼｽｾｿ0123456789{}<>/=$#'.split('');
    const fs = 15; let drops: number[] = [];
    const colors = ['#4C9AFF', '#45C6D6', '#4BCE97', '#A78BFA'];
    const resize = () => { c.width = innerWidth; c.height = innerHeight; const cols = Math.floor(c.width / fs); drops = []; for (let i = 0; i < cols; i++) drops[i] = Math.random() * -100; };
    resize(); this.onResize = resize; addEventListener('resize', resize);
    const draw = () => {
      x.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue('--matrix-fade').trim() || 'rgba(6,9,19,.10)'); x.fillRect(0, 0, c.width, c.height); x.font = fs + 'px JetBrains Mono, monospace';
      for (let i = 0; i < drops.length; i++) {
        x.fillStyle = colors[i % colors.length];
        x.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, drops[i] * fs);
        if (drops[i] * fs > c.height && Math.random() > 0.975) drops[i] = 0; drops[i] += 0.5;
      }
    };
    if (!(matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) this.matrixTimer = setInterval(draw, 52);
  }

  /* ---------- theme toggle (default: light, shared with dashboard) ---------- */
  private initTheme(root: HTMLElement): void {
    const cur = () => document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const apply = (t: string) => {
      document.documentElement.setAttribute('data-theme', t);
      try { localStorage.setItem('prayas.theme', t); } catch (e) {}
      const ic = root.querySelector('#themeBtn i');
      if (ic) ic.className = 'bi ' + (t === 'dark' ? 'bi-sun' : 'bi-moon-stars');
    };
    let stored = 'light';
    try { stored = localStorage.getItem('prayas.theme') || 'light'; } catch (e) {}
    apply(stored);
    const btn = root.querySelector('#themeBtn') as HTMLElement;
    if (btn) btn.onclick = () => apply(cur() === 'dark' ? 'light' : 'dark');
  }

  /* ---------- auth logic + i18n ---------- */
  private initAuth(root: HTMLElement): void {
    const byId = (id: string) => root.querySelector('#' + id) as HTMLElement;
    this.I18n.init();
    let mode = (location.hash === '#signup') ? 'signup' : 'login';

    const cur = byId('authLangCur'); const menu = byId('authLangMenu'); const lbtn = byId('authLangBtn');
    menu.innerHTML = this.I18n.LANGS.map((l: any) => '<a data-lang="' + l.code + '"><span>' + l.native + '</span><i class="bi bi-check2"></i></a>').join('');
    const syncLang = () => {
      const l = this.I18n.LANGS.filter((z: any) => z.code === this.I18n.lang)[0];
      cur.textContent = l ? l.short : this.I18n.lang.toUpperCase();
      Array.prototype.forEach.call(menu.querySelectorAll('a'), (a: any) => a.classList.toggle('active', a.getAttribute('data-lang') === this.I18n.lang));
      const f = byId('authAsideFoot'); if (f) f.textContent = this.I18n.t('land.footer', { year: new Date().getFullYear() });
    };
    lbtn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('show'); };
    Array.prototype.forEach.call(menu.querySelectorAll('a'), (a: any) => {
      a.onclick = (e: Event) => { e.preventDefault(); this.I18n.set(a.getAttribute('data-lang')); menu.classList.remove('show'); syncLang(); };
    });
    this.onDocClick = () => menu.classList.remove('show');
    document.addEventListener('click', this.onDocClick);
    this.onI18nChange = () => { syncLang(); applyMode(); };
    document.addEventListener('i18n:change', this.onI18nChange);

    const tabLogin = byId('tabLogin'); const tabSignup = byId('tabSignup'); const tabInd = byId('tabInd');
    const fName = byId('fName'); const fConfirm = byId('fConfirm');
    const loginRow = byId('loginRow'); const submitBtn = byId('submitBtn') as HTMLButtonElement;
    const title = byId('authTitle'); const sub = byId('authSub'); const swapText = byId('swapText');

    const applyMode = () => {
      const signup = mode === 'signup';
      tabLogin.classList.toggle('active', !signup);
      tabSignup.classList.toggle('active', signup);
      tabInd.classList.toggle('right', signup);
      fName.classList.toggle('hide', !signup);
      fConfirm.classList.toggle('hide', !signup);
      loginRow.classList.toggle('hide', signup);
      submitBtn.textContent = this.I18n.t(signup ? 'login.signup' : 'login.signin');
      title.textContent = this.I18n.t(signup ? 'login.tabSignup' : 'login.welcome');
      sub.textContent = this.I18n.t('login.sub');
      swapText.innerHTML = signup
        ? this.I18n.t('login.haveAccount') + ' <span class="link" id="swapLink">' + this.I18n.t('login.loginLink') + '</span>'
        : this.I18n.t('login.noAccount') + ' <span class="link" id="swapLink">' + this.I18n.t('login.signupLink') + '</span>';
      (root.querySelector('#swapLink') as HTMLElement).onclick = () => { mode = signup ? 'login' : 'signup'; clearErrors(); applyMode(); };
    };
    tabLogin.onclick = () => { mode = 'login'; clearErrors(); applyMode(); };
    tabSignup.onclick = () => { mode = 'signup'; clearErrors(); applyMode(); };

    const togglePw = byId('togglePw') as HTMLElement;
    togglePw.onclick = () => {
      const inp = byId('iPassword') as HTMLInputElement; const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      togglePw.className = 'bi toggle-pw ' + (show ? 'bi-eye-slash' : 'bi-eye');
    };

    const setErr = (id: string, on: boolean) => byId(id).classList.toggle('err', on);
    const clearErrors = () => ['fName', 'fEmail', 'fPassword', 'fConfirm'].forEach((id) => setErr(id, false));
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    (byId('authForm') as HTMLFormElement).onsubmit = (e) => {
      e.preventDefault(); clearErrors();
      const signup = mode === 'signup'; let ok = true;
      const email = (byId('iEmail') as HTMLInputElement).value.trim();
      const pw = (byId('iPassword') as HTMLInputElement).value;
      if (signup && !(byId('iName') as HTMLInputElement).value.trim()) { setErr('fName', true); ok = false; }
      if (!emailRe.test(email)) { setErr('fEmail', true); ok = false; }
      if (!pw || pw.length < 4) { setErr('fPassword', true); ok = false; }
      if (signup && (byId('iConfirm') as HTMLInputElement).value !== pw) { setErr('fConfirm', true); ok = false; }
      if (!ok) return;
      try { localStorage.setItem('prayas.auth', '1'); } catch (err) {}
      byId('okFlash').style.display = 'block';
      submitBtn.disabled = true;
      setTimeout(() => this.router.navigateByUrl('/dashboard'), 700);
    };

    this.I18n.refresh(document); syncLang(); applyMode();
  }
}
