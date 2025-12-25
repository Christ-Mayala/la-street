import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { User } from '../models/user.model';
import { APP_ENV } from '../config/app-env';

type DryResponse<T> = { success: boolean; message: string; data: T; timestamp: string };

const unwrap = <T>(r: DryResponse<T>): T => {
  if (!r?.success) throw new Error(r?.message || 'Erreur API');
  return r.data;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly storageKey = 'street_user';
  user = signal<User | null>(this.loadUser());

  private loadUser(): User | null {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  private saveUser(u: User | null) {
    if (u) localStorage.setItem(this.storageKey, JSON.stringify(u));
    else localStorage.removeItem(this.storageKey);
    this.user.set(u);
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

    // Gestion des deux signatures
    if (typeof emailOrCredentials === 'object') {
      email = emailOrCredentials.email;
      pwd = emailOrCredentials.password;
    } else {
      email = emailOrCredentials;
      pwd = password!;
    }

    const base = this.safeBaseUrl();
    if (!base) throw new Error('API base URL non configurée');

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
      role: (data.user?.role || 'user') as any,
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
    if (!base) throw new Error('API base URL non configurée');

    // Enregistrer l'utilisateur seulement, sans login automatique
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
