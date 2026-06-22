/* landing.component.ts — the public marketing / landing page (formerly
 * index.html). A faithful port of the inline scripts: matrix code-rain canvas,
 * count-up hero stats, reveal-on-scroll, theme toggle and the i18n language
 * switcher. The page-local CSS lives in landing.component.css and is scoped by
 * Angular's emulated encapsulation (its custom properties are defined on :host
 * so they never leak into the dashboard theme). */
import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { I18n } from '../../services/i18n.service';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './landing.html',
  styleUrls: ['./landing.css']
})
export class LandingComponent implements AfterViewInit, OnDestroy {
  private matrixTimer: any = null;
  private onResize: (() => void) | null = null;
  private io: IntersectionObserver | null = null;
  private onDocClick: (() => void) | null = null;
  private onI18nChange: (() => void) | null = null;

  constructor(private host: ElementRef, private router: Router, private I18n: I18n) {}

  ngAfterViewInit(): void {
    document.body.classList.remove('app-loading');
    const root: HTMLElement = this.host.nativeElement;

    this.initMatrix(root);
    this.initReveal(root);
    this.initTheme(root);
    this.initI18nAndLang(root);
    this.wireCtas(root);

    const nt = root.querySelector('#navToggle') as HTMLElement;
    if (nt) nt.onclick = () => (root.querySelector('#navLinks') as HTMLElement).classList.toggle('open');

    this.runCounters(root);
  }

  ngOnDestroy(): void {
    if (this.matrixTimer) clearInterval(this.matrixTimer);
    if (this.onResize) window.removeEventListener('resize', this.onResize);
    if (this.io) this.io.disconnect();
    if (this.onDocClick) document.removeEventListener('click', this.onDocClick);
    if (this.onI18nChange) document.removeEventListener('i18n:change', this.onI18nChange);
  }

  /* ---------- matrix rain ---------- */
  private initMatrix(root: HTMLElement): void {
    const c = root.querySelector('#matrix') as HTMLCanvasElement;
    if (!c) return;
    const x = c.getContext('2d')!;
    const chars = 'PRAYAS01アイウエオカキクケコｻｼｽｾｿ0123456789{}<>/=$#'.split('');
    const fontSize = 15; let cols = 0; let drops: number[] = [];
    const colors = ['#4C9AFF', '#45C6D6', '#4BCE97', '#A78BFA'];
    const resize = () => {
      c.width = window.innerWidth; c.height = window.innerHeight;
      cols = Math.floor(c.width / fontSize); drops = [];
      for (let i = 0; i < cols; i++) drops[i] = Math.random() * -100;
    };
    resize(); this.onResize = resize; window.addEventListener('resize', resize);
    const draw = () => {
      x.fillStyle = (getComputedStyle(document.documentElement).getPropertyValue('--matrix-fade').trim() || 'rgba(6,9,19,.10)');
      x.fillRect(0, 0, c.width, c.height);
      x.font = fontSize + 'px JetBrains Mono, monospace';
      for (let i = 0; i < drops.length; i++) {
        x.fillStyle = colors[i % colors.length];
        x.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 0.5;
      }
    };
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) this.matrixTimer = setInterval(draw, 52);
  }

  /* ---------- counters ---------- */
  private runCounters(root: HTMLElement): void {
    root.querySelectorAll('[data-count]').forEach((el: any) => {
      if (el.dataset.done) return; el.dataset.done = '1';
      const target = +el.getAttribute('data-count'); let t0: number | null = null; const dur = 1400;
      const step = (ts: number) => {
        if (!t0) t0 = ts; const p = Math.min((ts - t0) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }

  /* ---------- reveal on scroll ---------- */
  private initReveal(root: HTMLElement): void {
    this.io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); this.io!.unobserve(e.target); } });
    }, { threshold: .15 });
    root.querySelectorAll('.reveal,.stagger').forEach((el) => this.io!.observe(el));
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

  /* ---------- i18n + language switcher ---------- */
  private initI18nAndLang(root: HTMLElement): void {
    this.I18n.init();
    const cur = root.querySelector('#landLangCur') as HTMLElement;
    const menu = root.querySelector('#landLangMenu') as HTMLElement;
    const btn = root.querySelector('#landLangBtn') as HTMLElement;
    menu.innerHTML = this.I18n.LANGS.map((l: any) => '<a data-lang="' + l.code + '"><span>' + l.native + '</span><i class="bi bi-check2"></i></a>').join('');
    const sync = () => {
      const l = this.I18n.LANGS.filter((z: any) => z.code === this.I18n.lang)[0];
      cur.textContent = l ? l.short : this.I18n.lang.toUpperCase();
      Array.prototype.forEach.call(menu.querySelectorAll('a'), (a: any) => a.classList.toggle('active', a.getAttribute('data-lang') === this.I18n.lang));
      const f = root.querySelector('#landFoot') as HTMLElement;
      if (f) f.textContent = this.I18n.t('land.footer', { year: new Date().getFullYear() });
    };
    btn.onclick = (e) => { e.stopPropagation(); menu.classList.toggle('show'); };
    Array.prototype.forEach.call(menu.querySelectorAll('a'), (a: any) => {
      a.onclick = (e: Event) => { e.preventDefault(); this.I18n.set(a.getAttribute('data-lang')); menu.classList.remove('show'); sync(); };
    });
    this.onDocClick = () => menu.classList.remove('show');
    document.addEventListener('click', this.onDocClick);
    this.onI18nChange = sync;
    document.addEventListener('i18n:change', this.onI18nChange);
    this.I18n.refresh(document); sync();
  }

  /* ---------- CTA navigation (auth-aware) ---------- */
  private wireCtas(root: HTMLElement): void {
    const authed = (() => { try { return localStorage.getItem('prayas.auth') === '1'; } catch (e) { return false; } })();
    root.querySelectorAll('[data-cta-primary]').forEach((a) => {
      (a as HTMLElement).onclick = (e) => { e.preventDefault(); this.router.navigateByUrl(authed ? '/dashboard' : '/login'); };
    });
    root.querySelectorAll('[data-cta-signup]').forEach((a) => {
      (a as HTMLElement).onclick = (e) => { e.preventDefault(); this.router.navigate(['/login'], { fragment: 'signup' }); };
    });
  }
}
