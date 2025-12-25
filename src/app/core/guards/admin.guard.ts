import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const u = this.auth.user();
    if (u && u.role === 'admin') return true;
    // redirect to login if not authenticated, or home if authenticated but not admin
    if (!u) this.router.navigate(['/login']);
    else this.router.navigate(['/']);
    return false;
  }
}
