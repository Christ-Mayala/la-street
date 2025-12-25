import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const u = this.auth.user();
    const isAdmin = String(u?.role || '').toLowerCase() === 'admin';
    if (u && isAdmin) return true;
    if (!u) this.router.navigate(['/login']);
    else this.router.navigate(['/']);
    return false;
  }
}
