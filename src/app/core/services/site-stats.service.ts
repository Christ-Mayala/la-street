import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, defer, expand, last, map, of, shareReplay, tap, timeout } from 'rxjs';
import { ApiService } from './api.service';

export type SiteCounts = {
  totalProfessionals: number;
  totalTrades: number;
  totalCities: number;
};

@Injectable({ providedIn: 'root' })
export class SiteStatsService {
  private readonly api = inject(ApiService);

  private readonly counts$ = defer(() => this.computeCounts()).pipe(shareReplay(1));

  counts(): Observable<SiteCounts> {
    return this.counts$;
  }

  private computeCounts(): Observable<SiteCounts> {
    const tradeIds = new Set<string>();
    const villes = new Set<string>();
    let totalProfessionals = 0;
    const limit = 100;
    const maxPages = 200;

    return this.api.professionalsPaged({ page: 1, limit }).pipe(
      tap((r) => {
        totalProfessionals = Number(r?.total || 0);
        for (const p of r?.items || []) {
          const v = String((p as any)?.ville || '').trim();
          if (v) villes.add(v);

          const t: any = (p as any)?.tradeId;
          const id = typeof t === 'string' ? t : String(t?._id || '').trim();
          if (id) tradeIds.add(id);
        }
      }),
      expand((r, idx) => {
        if (idx + 1 >= maxPages) return EMPTY;
        const totalPages = Number(r?.totalPages || 0);
        const itemsLen = (r?.items || []).length;
        const nextPage = idx + 2;
        if (totalPages && nextPage > totalPages) return EMPTY;
        if (!totalPages && itemsLen < limit) return EMPTY;
        return this.api.professionalsPaged({ page: nextPage, limit });
      }),
      last(),
      map(() => ({
        totalProfessionals,
        totalTrades: tradeIds.size,
        totalCities: villes.size,
      })),
      timeout({ first: 12000 }),
      catchError(() => of({ totalProfessionals: 0, totalTrades: 0, totalCities: 0 })),
    );
  }
}
