import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ApiService } from '../../../core/services/api.service';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, ProfessionalCardComponent],
  template: `
    <div class="min-h-screen relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden pointer-events-none">
        <div class="absolute -top-24 -left-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-yellow-400/5 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <div class="relative z-10">
        <!-- Hero Section -->
        <section class="relative overflow-hidden">
          <div class="container relative z-10 py-12 md:py-16">
            <div class="max-w-3xl mx-auto text-center">
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
                <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm font-medium text-yellow-300">Vos coups de cœur</span>
              </div>

              <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
                Mes <span class="text-yellow-400">favoris</span>
              </h1>
              <p class="mt-4 text-lg text-slate-300">
                Retrouvez ici tous les professionnels que vous avez enregistrés
              </p>
            </div>
          </div>
        </section>

        <!-- Main Content -->
        <main class="container py-10 md:py-16">
          <div *ngIf="loading" class="flex justify-center py-20">
            <div class="w-12 h-12 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
          </div>

          <div *ngIf="!loading && pros.length === 0" class="max-w-md mx-auto text-center py-20">
            <div class="w-20 h-20 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg class="w-10 h-10 text-yellow-400/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
            </div>
            <h2 class="text-2xl font-bold text-white mb-2">Aucun favori</h2>
            <p class="text-slate-400 mb-8">Vous n'avez pas encore ajouté de professionnel à vos favoris.</p>
            <a routerLink="/search" class="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black font-bold rounded-lg hover:bg-yellow-400 transition-colors">
              Découvrir les pros
            </a>
          </div>

          <div *ngIf="!loading && pros.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <app-professional-card 
              *ngFor="let prof of pros" 
              [pro]="prof"
              (onToggleFavorite)="loadFavorites()">
            </app-professional-card>
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class FavoritesPage {
  protected readonly fav = inject(FavoritesService);
  private readonly api = inject(ApiService);
  
  pros: any[] = [];
  loading = false;

  constructor(){
    this.loadFavorites();
  }

  loadFavorites(){
    const ids = (this.fav.favs() || []).filter(Boolean);
    if (!ids.length) {
      this.pros = [];
      return;
    }

    this.loading = true;
    forkJoin(
      ids.map((id) => this.api.professionalById(id).pipe(catchError(() => of(null as any)))),
    ).subscribe((list) => {
      this.pros = (list || []).filter(Boolean);
      this.loading = false;
    });
  }
}
