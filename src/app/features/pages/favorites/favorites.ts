import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ApiService } from '../../../core/services/api.service';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ProfessionalCardComponent],
  template: `
    <section class="container py-8">
      <h1 class="text-2xl font-bold">Favoris</h1>
      <p class="mt-2 text-slate-300">Vos professionnels favoris.</p>

      <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <app-professional-card *ngFor="let p of pros" [pro]="p" />
      </div>

      <div *ngIf="pros.length===0" class="mt-6 text-sm text-slate-300">Aucun favori pour le moment.</div>
    </section>
  `
})
export class FavoritesPage{
  private readonly fav = inject(FavoritesService);
  private readonly api = inject(ApiService);
  pros: any[] = [];

  constructor(){
    const ids = (this.fav.favs() || []).filter(Boolean);
    if (!ids.length) return;

    forkJoin(
      ids.map((id) => this.api.professionalById(id).pipe(catchError(() => of(null as any)))),
    ).subscribe((list) => {
      this.pros = (list || []).filter(Boolean);
    });
  }
}
