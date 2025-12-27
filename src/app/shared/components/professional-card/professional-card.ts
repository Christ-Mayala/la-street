import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Professional } from '../../../core/models/professional.model';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-professional-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <article class="card p-4 hover:shadow-lg transition-shadow duration-200 rounded-lg border border-slate-800 bg-black/30 hover:bg-black/40 overflow-hidden">
      <div class="flex items-start gap-3 sm:gap-4">
        <!-- Avatar -->
        <div class="h-14 w-14 sm:h-16 sm:w-16 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 text-primary flex items-center justify-center font-bold text-lg border border-yellow-400/30">
          <img *ngIf="avatarUrl" [src]="avatarUrl" class="w-full h-full object-cover" alt="" loading="lazy" decoding="async" />
          <span *ngIf="!avatarUrl" class="text-yellow-300">{{ initials }}</span>
        </div>

        <div class="min-w-0 flex-1">
          <!-- Header -->
          <div class="mb-2">
            <div class="flex items-start gap-2 min-w-0">
              <h3 class="min-w-0 flex-1 text-base font-semibold text-white leading-snug clamp-2 text-anywhere" [title]="pro.name">{{ pro.name }}</h3>
              <span class="badge shrink-0 whitespace-nowrap" [ngClass]="statusBadgeClass(pro.availabilityStatus)">{{ availabilityLabel(pro.availabilityStatus) }}</span>
            </div>
          </div>

          <!-- Location & Trade -->
          <p class="text-sm text-slate-300 clamp-2 text-anywhere mb-4" [title]="tradeLabel + ' · ' + pro.ville + (pro.quartier ? ' · ' + pro.quartier : '')">
            {{ tradeLabel }} · {{ pro.ville }}
            <span *ngIf="pro.quartier"> · {{ pro.quartier }}</span>
          </p>

          <!-- Rating -->
          <div class="flex items-center gap-3 mb-4">
            <div class="flex items-center gap-1">
              <button
                type="button"
                class="p-0.5 cursor-pointer transition-all duration-150 hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                *ngFor="let s of stars; let i = index"
                [disabled]="ratingLoading"
                (click)="rate(i+1)"
                [title]="'Noter ' + (i+1) + '/5'"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 transition-colors duration-150"
                  viewBox="0 0 20 20"
                  [attr.fill]="(i+1) <= displayRating ? 'currentColor' : 'none'"
                  stroke="currentColor"
                  stroke-width="1.5"
                  [ngClass]="{
                    'text-amber-400': (i+1) <= displayRating,
                    'text-slate-300': (i+1) > displayRating
                  }"
                >
                  <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.563-.954L10 0l2.949 5.956 6.563.954-4.756 4.635 1.122 6.545z"/>
                </svg>
              </button>
            </div>

            <div class="flex items-center gap-2">
              <span class="text-sm font-bold text-white">{{ (pro.rating ?? 0) | number:'1.1-1' }}</span>
              <span class="text-xs text-slate-400">({{ getRatingCount() }})</span>

              <!-- Loading indicator -->
              <div *ngIf="ratingLoading" class="flex items-center gap-1 text-xs text-amber-400">
                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Envoi...</span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-2 items-center">
            <button
              class="px-4 py-2 bg-transparent border border-slate-700 text-slate-300 text-sm font-medium rounded-lg hover:bg-slate-800/50 hover:border-slate-600 hover:text-white transition-all duration-200"
              (click)="viewProfile()"
            >
              Voir
            </button>
            <button
              class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-sm font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200"
              (click)="call()"
            >
              Contacter
            </button>
            <button
              class="ml-auto p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
              (click)="toggleFav()"
              [title]="favorites.isFav(pro._id || '') ? 'Retirer des favoris' : 'Ajouter aux favoris'"
            >
              <svg *ngIf="!favorites.isFav(pro._id || '')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400 hover:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C13.46 4.99 14.96 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <svg *ngIf="favorites.isFav(pro._id || '')" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C13.46 4.99 14.96 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </article>
  `,
})
export class ProfessionalCardComponent {
  statusBadgeClass(s: any) {
    if (s === 'available') return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    if (s === 'busy') return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
    if (s === 'temporarily_unavailable') return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    return 'bg-slate-500/10 text-slate-300 border-slate-500/25';
  }

  availabilityLabel(s: any) {
    if (s === 'available') return 'Disponible';
    if (s === 'busy') return 'Occupé';
    if (s === 'temporarily_unavailable') return 'Indispo.';
    return '—';
  }

  @Input({ required: true }) pro!: Professional;

  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  protected readonly favorites = inject(FavoritesService);

  ratingLoading = false;
  myRating = 0;
  @Input() highlight!: boolean;

  get initials() {
    return (this.pro.name || '')
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  get avatarUrl() {
    return this.pro.profileImage?.url || '';
  }

  get tradeLabel() {
    const t: any = this.pro.tradeId;
    if (t && typeof t === 'object') return t.name || 'Métier';
    return 'Métier';
  }

  get stars() {
    return Array(5).fill(0);
  }

  get displayRating() {
    return this.myRating || Math.round((this.pro?.rating as any) ?? 0);
  }

  getRatingCount(): number {
    return (this.pro as any).ratingCount || 0;
  }

  rate(v: number) {
    if (!this.pro?._id) return;
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connexion requise');
      this.router.navigate(['/login']);
      return;
    }

    this.myRating = v;
    this.ratingLoading = true;

    this.api.rateProfessional(this.pro._id, v).subscribe({
      next: (updated: any) => {
        this.pro.rating = updated?.rating ?? this.pro.rating;
        (this.pro as any).ratingCount = updated?.ratingCount ?? (this.pro as any).ratingCount;
        this.toast.success('Merci', 'Note enregistrée');
        this.ratingLoading = false;
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Impossible de noter';
        this.toast.error('Erreur', msg);
        this.myRating = 0;
        this.ratingLoading = false;
      },
    });
  }

  viewProfile() {
    this.router.navigate(['/professional', this.pro._id]);
  }

  toggleFav() {
    const id = this.pro._id || this.pro.name;
    this.favorites.toggle(id);
  }

  call() {
    if (!this.auth.isAuthenticated()) {
      alert('Créez un compte pour contacter les professionnels.');
      this.router.navigate(['/register']);
      return;
    }

    const tel = this.pro.telephone;
    if (!tel) {
      alert('Aucun numéro disponible.');
      return;
    }

    const pref: any = (this.pro as any).preferredContact || 'both';

    if (pref === 'whatsapp' && this.pro.whatsapp) {
      const clean = tel.replace(/\s+/g, '').replace(/^\+/, '');
      window.open(`https://wa.me/${clean}`, '_blank');
      return;
    }

    window.location.href = `tel:${tel}`;
  }
}
