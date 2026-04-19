import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ApiService } from '../../../core/services/api.service';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { SeoService } from '../../../core/services/seo.service';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfessionalCardComponent],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="relative z-10 pt-32 pb-24">
        <!-- Header -->
        <section class="container px-6 mb-16">
          <div class="max-w-4xl mx-auto text-center space-y-6">
            <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-2">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
              </svg>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Ma Sélection Privée</span>
            </div>

            <h1 class="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none">
              Mes <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Coups de Cœur</span>
            </h1>
            <p class="text-lg text-slate-400 max-w-xl mx-auto font-medium">
              Retrouvez ici les professionnels qui ont retenu votre attention pour vos futurs projets.
            </p>
          </div>
        </section>

        <!-- Main Content -->
        <main class="container px-6">
          <!-- Loading State -->
          @if (loading) {
            <div class="flex flex-col items-center justify-center py-32 space-y-6">
              <div class="relative w-16 h-16">
                <div class="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
                <div class="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              <p class="text-xs font-black uppercase tracking-[0.3em] text-yellow-500 animate-pulse">Synchronisation de vos favoris...</p>
            </div>
          }

          <!-- Empty State -->
          @if (!loading && pros().length === 0) {
            <div class="max-w-xl mx-auto text-center py-24 px-8 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-xl animate-fade-in">
              <div class="w-24 h-24 bg-yellow-400/10 rounded-[2rem] flex items-center justify-center mx-auto mb-10 rotate-12 transition-transform hover:rotate-0">
                <svg class="w-12 h-12 text-yellow-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white mb-4 tracking-tighter uppercase">Liste Vide</h2>
              <p class="text-slate-500 mb-12 font-medium leading-relaxed">Vous n'avez pas encore de professionnels enregistrés dans vos favoris. Parcourez notre catalogue pour découvrir des talents.</p>
              <a routerLink="/search" class="inline-flex items-center gap-4 px-10 py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl hover:bg-yellow-500 transition-all duration-300 transform active:scale-95 shadow-2xl">
                 Explorer le catalogue
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </a>
            </div>
          }

          <!-- Favorites Grid -->
          @if (!loading && pros().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
              @for (prof of pros(); track prof._id) {
                <div class="pb-8">
                  <app-professional-card 
                    [pro]="prof"
                    (onToggleFavorite)="loadFavorites()">
                  </app-professional-card>
                </div>
              }
            </div>
          }
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #050505; }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class FavoritesPage implements OnInit {
  protected readonly fav = inject(FavoritesService);
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  
  pros = signal<any[]>([]);
  loading = false;

  ngOnInit() {
    this.seo.setTitle('Mes Favoris · La STREET');
    this.seo.updateTags({
      description: 'Retrouvez votre sélection personnalisée de professionnels et artisans sur La STREET.'
    });
    this.loadFavorites();
  }

  loadFavorites() {
    const ids = (this.fav.favs() || []).filter(Boolean);
    if (!ids.length) {
      this.pros.set([]);
      return;
    }

    this.loading = true;
    forkJoin(
      ids.map((id) => this.api.professionalById(id).pipe(catchError(() => of(null as any)))),
    ).subscribe((list) => {
      this.pros.set((list || []).filter(Boolean));
      this.loading = false;
    });
  }
}
