import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable, throwError } from 'rxjs';
import { Professional } from '../models/professional.model';
import { APP_ENV } from '../config/app-env';

type DryResponse<T> = { success: boolean; message: string; data: T; timestamp: string };

// Convention backend: le serveur renvoie {success, message, data}.
// Si success=false, on lève une erreur avec un message lisible (pas de message système).

const unwrap = <T>(r: DryResponse<T>): T => {
  if (!r?.success) throw new Error(String(r?.message || 'Une erreur est survenue.'));
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

  // Quand l'API n'est pas joignable (mauvaise config, mixed-content, CORS, serveur down),
  // on renvoie un message utilisateur simple.
  private baseOrError<T>(): Observable<T> {
    return throwError(() => new Error('Connexion impossible. Vérifiez votre connexion internet et réessayez.'));
  }

  categories(): Observable<any[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any[]>();
    return this.http.get<DryResponse<any[]>>(`${base}${this.prefix}/categories`).pipe(map(unwrap));
  }

  professionals(params?: { ville?: string; quartier?: string; categoryId?: string; tradeId?: string; q?: string }): Observable<Professional[]> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional[]>();

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

  professionalsPaged(params?: {
    ville?: string;
    quartier?: string;
    categoryId?: string;
    tradeId?: string;
    q?: string;
    page?: number;
    limit?: number;
  }): Observable<{ items: Professional[]; total: number; totalPages: number; currentPage: number }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ items: Professional[]; total: number; totalPages: number; currentPage: number }>();

    let httpParams = new HttpParams();
    if (params?.ville) httpParams = httpParams.set('ville', params.ville);
    if (params?.quartier) httpParams = httpParams.set('quartier', params.quartier);
    if (params?.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params?.tradeId) httpParams = httpParams.set('tradeId', params.tradeId);
    if (params?.q) httpParams = httpParams.set('q', params.q);
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http
      .get<DryResponse<{ items: Professional[]; total: number; totalPages: number; currentPage: number }>>(`${base}${this.prefix}/professionals`, { params: httpParams })
      .pipe(map(unwrap));
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

  adminProfessionalById(id: string): Observable<Professional> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<Professional>();
    return this.http.get<DryResponse<Professional>>(`${base}${this.prefix}/admin/professionals/${id}`).pipe(map(unwrap));
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

  adminUsers(params?: { status?: 'active' | 'inactive' | 'deleted' | 'all'; role?: string; search?: string; page?: number; limit?: number }): Observable<{ items: any[]; total?: number; totalPages?: number; currentPage?: number }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ items: any[]; total?: number }>();

    let httpParams = new HttpParams();
    if (params?.status) httpParams = httpParams.set('status', params.status);
    if (params?.role) httpParams = httpParams.set('role', params.role);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.page) httpParams = httpParams.set('page', String(params.page));
    if (params?.limit) httpParams = httpParams.set('limit', String(params.limit));

    return this.http.get<DryResponse<{ items: any[]; total: number; totalPages?: number; currentPage?: number }>>(`${base}${this.prefix}/admin/users`, { params: httpParams }).pipe(map(unwrap));
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

  adminUpdateUserStatus(id: string, payload: { status: 'active' | 'inactive'; restore?: boolean }): Observable<any> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<any>();

    return this.http.patch<DryResponse<any>>(`${base}${this.prefix}/admin/users/${id}/status`, payload).pipe(map(unwrap));
  }

  adminSendUserEmail(id: string, payload: { subject: string; message: string }): Observable<{ to: string }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ to: string }>();

    return this.http.post<DryResponse<{ to: string }>>(`${base}${this.prefix}/admin/users/${id}/email`, payload).pipe(map(unwrap));
  }

  adminBroadcastEmail(payload: { audience: 'users' | 'professionals'; subject: string; message: string }): Observable<{ attempted: number; sent: number; failed: number }> {
    const base = this.safeBaseUrl();
    if (!base) return this.baseOrError<{ attempted: number; sent: number; failed: number }>();

    return this.http.post<DryResponse<{ attempted: number; sent: number; failed: number }>>(`${base}${this.prefix}/admin/email/broadcast`, payload).pipe(map(unwrap));
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

  updateMyAccount(payload: any): Observable<any> {
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

