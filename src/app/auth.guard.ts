/* auth.guard.ts — replaces the per-page inline redirect script. Allows the
 * dashboard routes only when localStorage['prayas.auth'] === '1', otherwise
 * sends the visitor back to the animated landing page. */
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  let authed = false;
  try { authed = localStorage.getItem('prayas.auth') === '1'; } catch (e) {}
  if (authed) return true;
  router.navigateByUrl('/');
  return false;
};
