import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Professional } from '../../../core/models/professional.model';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, ProfessionalCardComponent, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-12 md:py-16">
        <div class="max-w-4xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <span class="text-sm font-medium text-yellow-300">Recherche avancée</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Trouvez le <span class="text-yellow-400">professionnel</span> qu'il vous faut
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Utilisez nos filtres pour découvrir les meilleurs professionnels près de chez vous
          </p>

          <!-- Search Form Card -->
          <div class="mt-8 bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 shadow-2xl shadow-black/50">
            <h2 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Affinez votre recherche
            </h2>

            <form class="space-y-4" (ngSubmit)="doSearch()">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  <select
                    [(ngModel)]="tradeId"
                    name="tradeId"
                    class="w-full pl-12 pr-10 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option [ngValue]="''">Tous les métiers</option>
                    <option *ngFor="let t of tradeOptions" [ngValue]="t.id">{{ t.name }}</option>
                  </select>
                  <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>

                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  <input
                    [(ngModel)]="ville"
                    name="ville"
                    type="text"
                    placeholder="Ville (ex: Brazzaville)"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                  <input
                    [(ngModel)]="quartier"
                    name="quartier"
                    type="text"
                    placeholder="Quartier (optionnel)"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div class="text-sm text-slate-400">
                  <span class="text-yellow-300 font-medium">Astuce :</span> Laissez un champ vide pour élargir votre recherche
                </div>
                <div class="flex gap-3">
                  <button
                    type="button"
                    (click)="clearFilters()"
                    class="px-6 py-3.5 bg-black/40 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200"
                  >
                    Effacer les filtres
                  </button>
                  <button
                    type="submit"
                    class="px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Rechercher
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

    <!-- Results Section -->
    <main class="container py-10 md:py-16">
      <!-- Results Summary -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-2xl md:text-3xl font-bold text-white">
              <span class="text-yellow-400">{{ totalResults }}</span> professionnels trouvés
            </h2>
            <p class="mt-2 text-slate-300">{{ subtitle }}</p>

            <div *ngIf="tradeId || ville || quartier" class="mt-3 flex flex-wrap items-center gap-2">
              <span *ngIf="tradeId" class="badge bg-yellow-400/10 text-yellow-200 border-yellow-400/20">Métier : {{ tradeName(tradeId) }}</span>
              <span *ngIf="ville" class="badge bg-yellow-400/10 text-yellow-200 border-yellow-400/20">Ville : {{ ville }}</span>
              <span *ngIf="quartier" class="badge bg-yellow-400/10 text-yellow-200 border-yellow-400/20">Quartier : {{ quartier }}</span>
              <button
                type="button"
                class="ml-auto text-sm px-3 py-2 rounded-lg border border-slate-700 bg-black/30 text-slate-200 hover:bg-black/50 transition-colors"
                (click)="clearFilters()"
              >
                Tout effacer
              </button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-sm text-slate-400">
              <span class="font-medium text-yellow-300">{{ recommended.length }}</span> recommandés
            </span>
            <div class="w-2 h-2 bg-slate-700 rounded-full"></div>
            <span class="text-sm text-slate-400">
              <span class="font-medium text-yellow-300">{{ getAvailableCount() }}</span> disponibles
            </span>
          </div>
        </div>
      </div>

      <!-- Recommended Section -->
<!--      <div *ngIf="recommended.length" class="mb-12">-->
<!--        <div class="flex items-center justify-between mb-6">-->
<!--          <div>-->
<!--            <h3 class="text-xl font-bold text-white flex items-center gap-3">-->
<!--              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">-->
<!--                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>-->
<!--              </svg>-->
<!--              Professionnels recommandés-->
<!--            </h3>-->
<!--            <p class="text-sm text-slate-400 mt-1">Basé sur la disponibilité, les notes et votre localisation</p>-->
<!--          </div>-->
<!--        </div>-->

<!--        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">-->
<!--          <app-professional-card *ngFor="let p of recommended" [pro]="p" [highlight]="true" />-->
<!--        </div>-->
<!--      </div>-->

      <!-- All Results -->
      <div class="mb-12">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-white">Tous les résultats</h3>
          <span class="text-sm text-slate-400">{{ totalResults }} {{ totalResults === 1 ? 'profil' : 'profils' }}</span>
        </div>

        <!-- Loading State -->
        <div *ngIf="loading" class="flex justify-center py-12">
          <div class="spinner"></div>
        </div>

        <!-- Results Grid -->
        <div *ngIf="!loading && totalResults > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-professional-card *ngFor="let p of pagedResults(); trackBy: trackByProfessional" [pro]="p" />
        </div>

        <div *ngIf="!loading && totalResults > pageSize" class="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="text-sm text-slate-400">
            Affichage <span class="text-yellow-300 font-medium">{{ pageStart() }}</span>–<span class="text-yellow-300 font-medium">{{ pageEnd() }}</span>
            sur <span class="text-yellow-300 font-medium">{{ totalResults }}</span>
          </div>

          <nav class="flex items-center gap-2" aria-label="Pagination">
            <button
              type="button"
              class="px-3 py-2 rounded-lg border border-slate-700 bg-black/30 text-slate-200 hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              [disabled]="page <= 1"
              (click)="goToPage(page - 1)"
            >
              Précédent
            </button>

            <div class="hidden sm:flex items-center gap-1">
              <ng-container *ngFor="let p of pages()">
                <span *ngIf="p === '…'" class="px-2 text-slate-500">…</span>
                <button
                  *ngIf="p !== '…'"
                  type="button"
                  class="min-w-9 px-3 py-2 rounded-lg border transition-colors"
                  [ngClass]="p === page ? 'border-yellow-400/40 bg-yellow-400/10 text-yellow-200' : 'border-slate-700 bg-black/30 text-slate-200 hover:bg-black/50'"
                  (click)="goToPage($any(p))"
                >
                  {{ p }}
                </button>
              </ng-container>
            </div>

            <div class="sm:hidden text-sm text-slate-300 px-2">
              Page <span class="text-yellow-300 font-medium">{{ page }}</span>/<span class="text-yellow-300 font-medium">{{ totalPages() }}</span>
            </div>

            <button
              type="button"
              class="px-3 py-2 rounded-lg border border-slate-700 bg-black/30 text-slate-200 hover:bg-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              [disabled]="page >= totalPages()"
              (click)="goToPage(page + 1)"
            >
              Suivant
            </button>
          </nav>
        </div>

        <!-- No Results -->
        <div *ngIf="!loading && totalResults === 0" class="text-center py-16 bg-black/30 rounded-2xl border border-slate-800">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-white mb-2">Aucun professionnel trouvé</h3>
          <p class="text-slate-400 mb-6">Essayez d'élargir vos critères de recherche</p>
          <button
            (click)="clearFilters()"
            class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
          >
            Voir tous les professionnels
          </button>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="mt-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl">
        <div class="flex items-start gap-3">
          <svg class="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <div>
            <h3 class="font-semibold text-red-300 mb-1">Erreur de recherche</h3>
            <p class="text-red-200 text-sm">{{ error }}</p>
            <button
              (click)="retrySearch()"
              class="mt-3 text-sm px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors duration-200"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div *ngIf="results.length > 0" class="mt-16">
        <div class="bg-gradient-to-r from-yellow-400/10 via-black/30 to-yellow-400/10 rounded-2xl border border-yellow-400/20 p-8 text-center">
          <h3 class="text-xl font-bold text-white mb-4">Vous ne trouvez pas le professionnel idéal ?</h3>
          <p class="text-slate-300 mb-6 max-w-2xl mx-auto">
            Essayez d'élargir votre recherche ou contactez-nous pour obtenir des recommandations personnalisées.
          </p>
          <a
            routerLink="/contact"
            class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            Nous contacter
          </a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .hero-bg {
      background-image:
        radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%);
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(234, 179, 8, 0.2);
      border-radius: 50%;
      border-top-color: #eab308;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SearchPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  results: Professional[] = [];
  totalResults = 0;
  totalPagesApi = 1;

  recommended: Professional[] = [];
  subtitle = '';
  error = '';
  loading = true;

  tradeId = '';
  tradeOptions: Array<{ id: string; name: string }> = [];

  ville = '';
  quartier = '';

  page = 1;
  pageSize = 9;

  ngOnInit() {
    this.loadTrades();

    this.route.queryParamMap.subscribe((qp) => {
      this.loading = true;
      this.tradeId = qp.get('tradeId') || '';
      this.ville = qp.get('ville') || '';
      this.quartier = qp.get('quartier') || '';
      this.page = Math.max(1, parseInt(qp.get('page') || '1', 10) || 1);

      // Update subtitle
      const pieces = [] as string[];
      if (this.tradeId) pieces.push(`Métier : ${this.tradeName(this.tradeId)}`);
      if (this.ville) pieces.push(`Ville : ${this.ville}`);
      if (this.quartier) pieces.push(`Quartier : ${this.quartier}`);
      this.subtitle = pieces.length ? pieces.join(' · ') : 'Tous les professionnels approuvés';

      // Load recommended professionals
      // Corrigé : Supprimé le paramètre 'q' qui n'est pas accepté
      this.api.recommendations({
        ville: this.ville || undefined,
        limit: 6
      }).subscribe({
        next: (list) => (this.recommended = list || []),
        error: () => (this.recommended = []),
      });

      // Load all professionals
      this.api.professionalsPaged({
        tradeId: this.tradeId || undefined,
        ville: this.ville || undefined,
        quartier: this.quartier || undefined,
        page: this.page,
        limit: this.pageSize,
      }).subscribe({
        next: (r) => {
          this.error = '';
          this.results = r?.items || [];
          this.totalResults = r?.total || 0;
          this.totalPagesApi = r?.totalPages || 1;
          this.loading = false;

          if (this.page > this.totalPagesApi) {
            this.goToPage(this.totalPagesApi);
            return;
          }

          // Update SEO
          this.updateSeo();
        },
        error: (e) => {
          this.error = e?.message || 'Une erreur est survenue lors de la recherche';
          this.results = [];
          this.recommended = [];
          this.loading = false;
        },
      });
    });
  }

  updateSeo() {
    let title = 'Recherche de professionnels';
    let description = 'Trouvez les meilleurs professionnels près de chez vous';

    if (this.tradeId || this.ville || this.quartier) {
      const filters = [];
      if (this.tradeId) filters.push(`métier : ${this.tradeName(this.tradeId)}`);
      if (this.ville) filters.push(`ville : ${this.ville}`);
      if (this.quartier) filters.push(`quartier : ${this.quartier}`);

      title = `Recherche : ${filters.join(' · ')}`;
      description = `${this.results.length} professionnels trouvés pour "${filters.join(' ')}"`;
    }

    this.seo.setTitle(`${title} · La STREET`);
    this.seo.updateTags({ description });
  }

  doSearch() {
    const qp: any = {};
    if (this.tradeId) qp.tradeId = this.tradeId;
    if (this.ville) qp.ville = this.ville;
    if (this.quartier) qp.quartier = this.quartier;
    qp.page = 1;
    this.router.navigate([], { queryParams: qp });
  }

  clearFilters() {
    this.tradeId = '';
    this.ville = '';
    this.quartier = '';
    this.doSearch();
  }

  retrySearch() {
    this.error = '';
    this.doSearch();
  }

  getAvailableCount(): number {
    return this.results.filter(p => p.availabilityStatus === 'available').length;
  }

  totalPages(): number {
    return Math.max(1, this.totalPagesApi || 1);
  }

  pagedResults(): Professional[] {
    return this.results || [];
  }

  pageStart(): number {
    return this.totalResults ? (this.page - 1) * this.pageSize + 1 : 0;
  }

  pageEnd(): number {
    return Math.min(this.totalResults || 0, this.page * this.pageSize);
  }

  pages(): Array<number | '…'> {
    const total = this.totalPages();
    const current = this.page;

    if (total <= 7) {
      const all: number[] = [];
      for (let i = 1; i <= total; i++) all.push(i);
      return all;
    }

    const out: Array<number | '…'> = [1];

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) out.push('…');
    for (let p = start; p <= end; p++) out.push(p);
    if (end < total - 1) out.push('…');

    out.push(total);
    return out;
  }

  goToPage(p: number) {
    const tp = this.totalPages();
    const next = Math.min(tp, Math.max(1, p));
    if (next === this.page) return;

    this.page = next;
    this.router.navigate([], { queryParams: { page: next }, queryParamsHandling: 'merge' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  trackByProfessional = (_: number, p: Professional) => p._id || p.name;

  loadTrades() {
    if (this.tradeOptions.length) return;

    this.api.categories().subscribe({
      next: (cats: any[]) => {
        const byId = new Map<string, string>();
        for (const c of cats || []) {
          const trades = (c?.trades || c?.tradeIds || c?.metiers || []) as any[];
          for (const t of trades || []) {
            const id = String(t?._id || '').trim();
            const name = String(t?.name || '').trim();
            if (!id || !name) continue;
            byId.set(id, name);
          }
        }

        const used = new Set<string>();
        const limit = 100;

        const loadPage = (page: number) => {
          this.api.professionalsPaged({ page, limit }).subscribe({
            next: (r) => {
              for (const p of r?.items || []) {
                const t: any = (p as any)?.tradeId;
                const id = typeof t === 'string' ? t : String(t?._id || '');
                if (id) used.add(id);
              }

              if ((r?.currentPage || page) < (r?.totalPages || 1)) {
                loadPage(page + 1);
                return;
              }

              this.tradeOptions = Array.from(used)
                .map((id) => ({ id, name: byId.get(id) || '' }))
                .filter((x) => x.id && x.name)
                .sort((a, b) => a.name.localeCompare(b.name));
            },
            error: () => {
              this.tradeOptions = [];
            },
          });
        };

        loadPage(1);
      },
      error: () => {
        this.tradeOptions = [];
      },
    });
  }

  tradeName(id: string): string {
    const hit = (this.tradeOptions || []).find((x) => x.id === id);
    return hit?.name || 'Métier';
  }
}
}
