import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../models/user.model';
import { APP_ENV } from '../config/app-env';

type DryResponse<T> = { success: boolean; message: string; data: T; timestamp: string };

const unwrap = <T>(r: DryResponse<T>): T => {
  if (!r?.success) throw new Error(String(r?.message || 'Une erreur est survenue.'));
  return r.data;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly storageKey = 'street_user';

  // Signal pour les composants réactifs
  user = signal<User | null>(this.loadUser());

  // Subject pour les observables
  private userSubject = new BehaviorSubject<User | null>(this.loadUser());

  // Observable pour les abonnements
  user$: Observable<User | null> = this.userSubject.asObservable();

  private normalizeRole(raw: any): User['role'] {
    const r = String(raw || 'user').toLowerCase();
    if (r === 'admin') return 'admin';
    if (r === 'professional') return 'professional';
    return 'user';
  }

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return null;
      const u = JSON.parse(raw);
      if (u && typeof u === 'object') {
        u.role = this.normalizeRole(u.role);
      }
      return u as User;
    } catch {
      return null;
    }
  }

  private saveUser(u: User | null) {
    if (u) localStorage.setItem(this.storageKey, JSON.stringify(u));
    else localStorage.removeItem(this.storageKey);

    // Mettre à jour à la fois le signal et le subject
    this.user.set(u);
    this.userSubject.next(u);
  }

  setUser(u: User | null) {
    this.saveUser(u);
  }

  private safeBaseUrl(): string {
    const url = this.apiBaseUrl();
    if (!url) return '';
    try {
      const pageProto = typeof window !== 'undefined' ? window.location.protocol : 'http:';
      const pageHost = typeof window !== 'undefined' ? window.location.hostname : '';
      const urlProto = url.startsWith('https://') ? 'https:' : (url.startsWith('http://') ? 'http:' : pageProto);
      if (pageHost === 'localhost' || pageHost === '127.0.0.1') return url;
      if (pageProto === urlProto) return url;
      return '';
    } catch {
      return '';
    }
  }

  private apiBaseUrl(): string {
    return APP_ENV.apiBaseUrl;
  }

  token(): string {
    return this.user()?.token || '';
  }

  async login(credentials: { email: string; password: string }): Promise<User>;
  async login(email: string, password: string): Promise<User>;
  async login(emailOrCredentials: string | { email: string; password: string }, password?: string): Promise<User> {
    let email: string;
    let pwd: string;

    if (typeof emailOrCredentials === 'object') {
      email = emailOrCredentials.email;
      pwd = emailOrCredentials.password;
    } else {
      email = emailOrCredentials;
      pwd = password!;
    }

    const base = this.safeBaseUrl();
    if (!base) throw new Error('Connexion impossible. Vérifiez votre connexion internet et réessayez.');

    const res = await firstValueFrom(
      this.http.post<DryResponse<{ token: string; user: any }>>(
        `${base}/api/v1/lastreet/auth/login`,
        { email, password: pwd }
      ),
    );

    const data = unwrap(res);

    const u: User = {
      _id: data.user?._id,
      name: data.user?.name,
      email: data.user?.email,
      role: this.normalizeRole(data.user?.role),
      telephone: data.user?.telephone,
      token: data.token,
    };

    this.saveUser(u);
    return u;
  }

  async register(payload: {
    name: string;
    email: string;
    password: string;
    role: string;
    telephone?: string
  }) {
    const base = this.safeBaseUrl();
    if (!base) throw new Error('Connexion impossible. Vérifiez votre connexion internet et réessayez.');

    const res = await firstValueFrom(
      this.http.post<DryResponse<any>>(
        `${base}/api/v1/lastreet/auth/register`,
        payload
      )
    );

    return unwrap(res);
  }

  logout() {
    this.saveUser(null);
  }

  isAuthenticated() {
    return !!this.user()?.token;
  }
}
