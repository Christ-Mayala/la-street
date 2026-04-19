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
    <div class="min-h-screen bg-[#0a0a0c] selection:bg-yellow-500/30">
      
      <!-- PREMIUM HEADER -->
      <section class="relative pt-32 pb-20 overflow-hidden">
        <!-- Background -->
        <div class="absolute inset-0 z-0">
          <div class="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-yellow-500/10 via-transparent to-transparent"></div>
          <div class="absolute top-1/4 right-0 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px]"></div>
          <div class="absolute -bottom-20 -left-20 w-[600px] h-[600px] bg-slate-500/5 rounded-full blur-[150px]"></div>
        </div>

        <div class="container mx-auto px-6 relative z-10">
          <div class="max-w-4xl">
            <div class="flex items-center gap-3 mb-6">
              <span class="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                Répertoire Élite
              </span>
              <div class="h-px w-12 bg-white/10"></div>
            </div>

            <h1 class="text-5xl md:text-6xl font-black text-white tracking-tighter mb-4 leading-tight">
              Explorer les <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 font-black">Talents</span>
            </h1>
            <p class="text-lg text-slate-400 max-w-2xl mb-12 font-medium">
              Trouvez le partenaire idéal parmi notre réseau exclusif de professionnels certifiés en République du Congo.
            </p>

            <!-- GLASS FILTER BAR -->
            <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 md:p-4 shadow-2xl">
              <form class="flex flex-col lg:flex-row gap-3" (ngSubmit)="doSearch()">
                
                <!-- Trade Select -->
                <div class="flex-1 relative group">
                   <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                     <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                   </div>
                   <select [(ngModel)]="tradeId" name="tradeId" class="w-full bg-[#0a0a0c]/60 border-none rounded-2xl py-4 pr-10 pl-14 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 appearance-none transition-all cursor-pointer">
                     <option [ngValue]="''">Tous les métiers</option>
                     <option *ngFor="let t of tradeOptions" [ngValue]="t.id">{{ t.name }}</option>
                   </select>
                   <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-600">
                     <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                   </div>
                </div>

                <!-- Ville -->
                <div class="flex-1 relative group">
                   <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                     <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                   </div>
                   <input [(ngModel)]="ville" name="ville" type="text" placeholder="Ville (ex: Brazzaville)" class="w-full bg-[#0a0a0c]/60 border-none rounded-2xl py-4 pr-5 pl-14 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 transition-all">
                </div>

                <!-- Quartier -->
                <div class="flex-1 relative group">
                   <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-yellow-500 transition-colors">
                     <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                   </div>
                   <input [(ngModel)]="quartier" name="quartier" type="text" placeholder="Quartier..." class="w-full bg-[#0a0a0c]/60 border-none rounded-2xl py-4 pr-5 pl-14 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 transition-all">
                </div>

                <!-- Submit -->
                <button type="submit" class="lg:w-auto px-10 py-4 bg-yellow-500 text-black text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 shadow-xl shadow-yellow-500/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                   Rechercher
                </button>
              </form>

              <div class="mt-4 flex flex-col sm:flex-row justify-between items-center px-4">
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                    <span class="text-yellow-500">Conseil :</span> Optimisez par zone pour plus de réactivité
                 </p>
                 <button (click)="clearFilters()" class="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors py-2">Tout Réinitialiser</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- RESULTS CONTENT -->
      <main class="container mx-auto px-6 py-20">
        
        <!-- Summary & Stats -->
        <div class="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 pb-8 border-b border-white/5">
           <div class="space-y-2">
             <div class="flex items-center gap-3">
               <h2 class="text-2xl font-black text-white tracking-widest italic uppercase">{{ totalResults }} Trouvés</h2>
               <div class="w-2 h-2 rounded-full bg-yellow-500"></div>
             </div>
             <p class="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">{{ subtitle }}</p>
           </div>

           <div class="flex gap-12">
             <div class="flex flex-col items-end">
               <span class="text-2xl font-black text-white">{{ recommended.length }}</span>
               <span class="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">Recommandés</span>
             </div>
             <div class="flex flex-col items-end">
               <span class="text-2xl font-black text-white">{{ getAvailableCount() }}</span>
               <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Disponibles</span>
             </div>
           </div>
        </div>

        <!-- LOADING -->
        @if (loading) {
          <div class="flex flex-col items-center justify-center py-40 gap-6">
            <div class="w-16 h-16 border-4 border-white/5 border-t-yellow-500 rounded-full animate-spin"></div>
            <span class="text-slate-500 font-black uppercase tracking-widest text-sm animate-pulse">Scan en cours...</span>
          </div>
        }

        <!-- LISTING -->
        @if (!loading && totalResults > 0) {
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             @for (p of pagedResults(); track trackByProfessional($index, p)) {
               <app-professional-card [pro]="p" class="animate-fade-in-up" />
             }
           </div>

           <!-- PREMIUM PAGINATION -->
           @if (totalResults > pageSize) {
             <div class="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
                
                <div class="text-xs font-black text-slate-500 uppercase tracking-[0.2em]">
                   Profils <span class="text-white">{{ pageStart() }}</span> — <span class="text-white">{{ pageEnd() }}</span> sur <span class="text-yellow-500">{{ totalResults }}</span>
                </div>

                <nav class="flex items-center gap-2">
                  <button 
                    [disabled]="page <= 1" 
                    (click)="goToPage(page - 1)" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7"></path></svg>
                  </button>

                  <div class="flex items-center gap-2">
                    @for (p of pages(); track $index) {
                      @if (p === '…') {
                        <span class="w-12 h-12 flex items-center justify-center text-slate-600 font-black">...</span>
                      } @else {
                        <button 
                          (click)="goToPage($any(p))"
                          [class]="p === page ? 'bg-yellow-500 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)]' : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'"
                          class="w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all active:scale-95"
                        >
                          {{ p }}
                        </button>
                      }
                    }
                  </div>

                  <button 
                    [disabled]="page >= totalPages()" 
                    (click)="goToPage(page + 1)" 
                    class="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-20 transition-all active:scale-95"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </nav>

             </div>
           }
        }

        <!-- EMPTY STATE -->
        @if (!loading && totalResults === 0) {
           <div class="py-32 flex flex-col items-center text-center">
             <div class="w-32 h-32 rounded-[2.5rem] bg-white/[0.02] border border-white/5 flex items-center justify-center mb-12 relative">
                <div class="absolute inset-0 bg-yellow-500/10 blur-[40px] rounded-full"></div>
                <svg class="w-16 h-16 text-slate-700 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
             </div>
             <h3 class="text-4xl font-black text-white tracking-tighter mb-4">Ombre & Silence</h3>
             <p class="text-slate-500 max-w-sm font-bold uppercase text-xs tracking-widest leading-loose mb-12">Nous n'avons trouvé aucun profil correspondant à vos critères actuels d'excellence.</p>
             <button (click)="clearFilters()" class="px-10 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 transition-all">Relancer le Scan Global</button>
           </div>
        }

        <!-- ERROR STATE -->
        @if (error) {
           <div class="mt-8 p-10 rounded-[2.5rem] bg-red-500/10 border border-red-500/20 text-center flex flex-col items-center">
             <div class="w-20 h-20 rounded-[1.5rem] bg-red-500/20 flex items-center justify-center mb-6 text-red-500 shadow-2xl">
               <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
             </div>
             <h3 class="text-xl font-black text-red-400 uppercase tracking-widest mb-4">Signal Interrompu</h3>
             <p class="text-red-300 text-sm font-medium mb-10 max-w-md">{{ error }}</p>
             <button (click)="retrySearch()" class="px-8 py-3 bg-red-500 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-red-400 transition-all">Rétablir la Connexion</button>
           </div>
        }

        <!-- CTA HELP -->
        @if (!loading && results.length > 0) {
           <section class="mt-40 relative rounded-[3rem] overflow-hidden group">
              <div class="absolute inset-0 bg-yellow-500/5 group-hover:bg-yellow-500/10 transition-colors"></div>
              <div class="relative z-10 p-12 md:p-20 flex flex-col items-center text-center">
                 <h2 class="text-4xl font-black text-white tracking-tighter mb-6">Besoin d'un Guide ?</h2>
                 <p class="text-slate-400 max-w-xl font-medium mb-10">Nos experts peuvent vous accompagner dans la recherche du profil parfait pour vos projets complexes.</p>
                 <a routerLink="/contact" class="px-10 py-5 bg-yellow-500 text-black text-sm font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all active:scale-95 shadow-2xl">Ouvrir un Dossier</a>
              </div>
           </section>
        }

      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in-up {
      animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
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
