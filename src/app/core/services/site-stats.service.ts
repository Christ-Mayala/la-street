import { inject, Injectable } from '@angular/core';
import { EMPTY, Observable, catchError, defer, expand, last, map, of, shareReplay, tap } from 'rxjs';
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

    return this.api.professionalsPaged({ page: 1, limit: 100 }).pipe(
      tap((r) => {
        totalProfessionals = Number(r?.total || 0);
      }),
      expand((r) => {
        const current = Number(r?.currentPage || 1);
        const totalPages = Number(r?.totalPages || 1);
        if (current >= totalPages) return EMPTY;
        return this.api.professionalsPaged({ page: current + 1, limit: 100 });
      }),
      tap((r) => {
        for (const p of r?.items || []) {
          const v = String((p as any)?.ville || '').trim();
          if (v) villes.add(v);

          const t: any = (p as any)?.tradeId;
          const id = typeof t === 'string' ? t : String(t?._id || '').trim();
          if (id) tradeIds.add(id);
        }
      }),
      last(),
      map(() => ({
        totalProfessionals,
        totalTrades: tradeIds.size,
        totalCities: villes.size,
      })),
      catchError(() => of({ totalProfessionals: 0, totalTrades: 0, totalCities: 0 })),
    );
  }
}
