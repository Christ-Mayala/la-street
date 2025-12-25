import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { Professional } from '../models/professional.model';
import { APP_ENV } from '../config/app-env';

type DryResponse<T> = { success: boolean; message: string; data: T; timestamp: string };

const unwrap = <T>(r: DryResponse<T>): T => {
  if (!r?.success) throw new Error(r?.message || 'Erreur API');
  return r.data;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  baseUrl = signal<string>(APP_ENV.apiBaseUrl || '');
  private readonly prefix = '/api/v1/lastreet';

  private safeBaseUrl(): string {
    const url = this.baseUrl();
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

  public getSafeBaseUrl(): string {
    return this.safeBaseUrl();
  }

  private baseOrError<T>(hint?: string): Observable<T> {
    const base = this.baseUrl();
    const msg = hint
      ? `API non disponible: ${hint}`
      : `API non disponible. Configure public/runtime-config.js (window.__STREET_CONFIG__.apiBaseUrl) ou NG_APP_API_BASE_URL/VITE_API_BASE_URL. Valeur actuelle: ${base || '(vide)'}`;
    return throwError(() => new Error(msg));
  }

  categories(): Observable<any[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any[]>('Base URL manquante ou invalide (env NG_APP_/VITE_, CORS / mixed-content)');
    return this.http.get<DryResponse<any[]>>(`${base}${this.prefix}/categories`).pipe(map(unwrap));
  }

  professionals(params?: { ville?: string; quartier?: string; categoryId?: string; tradeId?: string; q?: string }): Observable<Professional[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional[]>('Base URL manquante ou invalide (env NG_APP_/VITE_, CORS / mixed-content)');

    let httpParams = new HttpParams();
    if (params?.ville) httpParams = httpParams.set('ville', params.ville);
    if (params?.quartier) httpParams = httpParams.set('quartier', params.quartier);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.tradeId) httpParams = httpParams.set('tradeId', params.tradeId);
    if (params?.q) httpParams = httpParams.set('q', params.q);

    return this.http
      .get<DryResponse<{ items: Professional[] }>>(`${base}${this.prefix}/professionals`, { params: httpParams })
      .pipe(map((r) => unwrap(r).items || []));
  }

  professionalById(id: string): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.get<DryResponse<Professional>>(`${base}${this.prefix}/professionals/${id}`).pipe(map(unwrap));
  }

  createProfessional(form: FormData): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.post<DryResponse<Professional>>(`${base}${this.prefix}/professionals`, form).pipe(map(unwrap));
  }

  rateProfessional(id: string, rating: number): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.post<DryResponse<Professional>>(`${base}${this.prefix}/professionals/${id}/rate`, { rating }).pipe(map(unwrap));
  }

  adminStats(): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();
    return this.http.get<DryResponse<any>>(`${base}${this.prefix}/admin/stats`).pipe(map(unwrap));
  }

  adminProfessionals(params?: { approvalStatus?: string }): Observable<{ items: Professional[]; total?: number }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ items: Professional[]; total?: number }>();

    let httpParams = new HttpParams();
    if (params?.approvalStatus) httpParams = httpParams.set('approvalStatus', params.approvalStatus);

    return this.http
      .get<DryResponse<{ items: Professional[]; total: number }>>(`${base}${this.prefix}/admin/professionals`, { params: httpParams })
      .pipe(map(unwrap));
  }

  adminUpdateProfessionalStatus(id: string, approvalStatus: 'pending' | 'approved' | 'rejected'): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();

    return this.http
      .patch<DryResponse<Professional>>(`${base}${this.prefix}/admin/professionals/${id}/status`, { approvalStatus })
      .pipe(map(unwrap));
  }

  adminDeleteProfessional(id: string): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();

    return this.http.delete<DryResponse<any>>(`${base}${this.prefix}/admin/professionals/${id}`).pipe(map(unwrap));
  }

  adminUsers(): Observable<{ items: any[]; total?: number }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ items: any[]; total?: number }>();

    return this.http.get<DryResponse<{ items: any[]; total: number }>>(`${base}${this.prefix}/admin/users`).pipe(map(unwrap));
  }

  adminCreateUser(payload: { name: string; email: string; password: string; role: string; telephone?: string }): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();

    return this.http.post<DryResponse<any>>(`${base}${this.prefix}/admin/users`, payload).pipe(map(unwrap));
  }

  adminDeleteUser(id: string): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();

    return this.http.delete<DryResponse<any>>(`${base}${this.prefix}/admin/users/${id}`).pipe(map(unwrap));
  }

  adminAudits(): Observable<any[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any[]>();

    return this.http.get<DryResponse<any[]>>(`${base}${this.prefix}/admin/audits`).pipe(map(unwrap));
  }

  recommendations(params?: { ville?: string; limit?: number }): Observable<Professional[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional[]>();

    let httpParams = new HttpParams();
    if (params?.ville) httpParams = httpParams.set('ville', params.ville);
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<DryResponse<Professional[]>>(`${base}${this.prefix}/professionals/recommendations`, { params: httpParams }).pipe(map(unwrap));
  }

  myProfessional(): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.get<DryResponse<Professional>>(`${base}${this.prefix}/professionals/me`).pipe(map(unwrap));
  }

  updateMyProfessional(payload: any): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.patch<DryResponse<Professional>>(`${base}${this.prefix}/professionals/me`, payload).pipe(map(unwrap));
  }

  updateMyAccount(payload: { name?: string; telephone?: string; nom?: string }): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();
    return this.http.patch<DryResponse<any>>(`${base}${this.prefix}/auth/profile`, payload).pipe(map(unwrap));
  }

  reportProfile(payload: { professionalId?: string; targetUserId?: string; reason: string; message?: string }): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();
    return this.http.post<DryResponse<any>>(`${base}${this.prefix}/reports`, payload).pipe(map(unwrap));
  }

  adminReports(params?: { status?: 'open' | 'resolved'; limit?: number }): Observable<{ items: any[] }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ items: any[] }>();

    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<DryResponse<{ items: any[] }>>(`${base}${this.prefix}/admin/reports`, { params: httpParams }).pipe(map(unwrap));
  }

  adminReportDecision(id: string, payload: { decision: 'keep' | 'delete'; note?: string }): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();

    return this.http.post<DryResponse<any>>(`${base}${this.prefix}/admin/reports/${id}/decision`, payload).pipe(map(unwrap));
  }
}

