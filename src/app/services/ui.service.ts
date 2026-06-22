/* ui.service.ts — shared presentation helpers extracted from the original
 * `App` object: number/percent formatting, html escaping, skeleton/empty
 * states, the chart colour palette, toasts and the modal system. Pages and the
 * shell inject this in place of the former global `App`. */
import { Injectable } from '@angular/core';

export function escapeHtml(s: any): string {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' } as any)[c]));
}
export function escapeAttr(s: any): string { return escapeHtml(s); }
export function truncate(s: any, n: number): string { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

export interface ModalOpts { title: string; icon?: string; body: string; foot?: string; width?: string; }

@Injectable({ providedIn: 'root' })
export class UiService {
  escapeHtml = escapeHtml;
  escapeAttr = escapeAttr;
  truncate = truncate;

  fmtNum(n: any): string { return (n == null || isNaN(n)) ? '—' : Number(n).toLocaleString('en-IN'); }
  fmtPct(n: any): string { return (n == null || isNaN(n)) ? '—' : Number(n).toFixed(1) + '%'; }

  skeleton(el: HTMLElement, lines = 3) {
    el.innerHTML = '<div class="skeleton-wrap">' +
      Array.from({ length: lines }).map(() => '<div class="skeleton-line"></div>').join('') + '</div>';
  }
  empty(el: HTMLElement, msg: string, icon = 'inbox') {
    el.innerHTML = `<div class="empty-state"><i class="bi bi-${icon}"></i><p>${escapeHtml(msg)}</p></div>`;
  }

  toast(msg: string, type: 'info' | 'success' | 'warning' = 'info') {
    let host = document.getElementById('toastHost');
    if (!host) { host = document.createElement('div'); host.id = 'toastHost'; host.className = 'toast-host'; document.body.appendChild(host); }
    const t = document.createElement('div');
    t.className = 'toast-msg toast-' + type;
    t.innerHTML = `<i class="bi bi-${type === 'warning' ? 'exclamation-triangle' : type === 'success' ? 'check-circle' : 'info-circle'}"></i><span>${escapeHtml(msg)}</span>`;
    host.appendChild(t);
    setTimeout(() => t.classList.add('show'), 10);
    setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, 2600);
  }

  modal({ title, icon, body, foot, width }: ModalOpts): HTMLElement {
    const host = document.getElementById('modalHost')!;
    const card = document.createElement('div');
    card.className = 'modal-card';
    if (width) card.style.maxWidth = width;
    card.innerHTML = `
      <div class="modal-card__head"><h3><i class="bi bi-${icon || 'window'}"></i> ${escapeHtml(title)}</h3>
        <button class="modal-close" aria-label="Close">&times;</button></div>
      <div class="modal-card__body">${body}</div>
      ${foot ? `<div class="modal-card__foot">${foot}</div>` : ''}`;
    host.querySelectorAll('.modal-card').forEach((c) => c.remove());
    host.appendChild(card);
    host.classList.add('show');
    (card.querySelector('.modal-close') as HTMLElement).onclick = () => this.closeModal();
    const bd = document.getElementById('modalBackdrop');
    if (bd) (bd as HTMLElement).onclick = () => this.closeModal();
    return card;
  }
  closeModal() {
    const host = document.getElementById('modalHost');
    if (host) { host.classList.remove('show'); host.querySelectorAll('.modal-card').forEach((c) => c.remove()); }
  }

  palette() {
    const css = getComputedStyle(document.documentElement);
    const v = (n: string) => css.getPropertyValue(n).trim();
    return {
      primary: v('--c-primary'), accent: v('--c-accent'), teal: v('--c-teal'),
      ok: v('--c-ok'), warn: v('--c-warn-2'), danger: v('--c-danger'),
      info: v('--c-teal'), muted: v('--c-muted'), text: v('--c-text'), grid: v('--c-border'),
      series: [v('--c-s1'), v('--c-s2'), v('--c-s3'), v('--c-s4'), v('--c-s5'), v('--c-s6'), v('--c-s7'), v('--c-s8')]
    };
  }
  isDark(): boolean { return document.documentElement.getAttribute('data-theme') === 'dark'; }
}
