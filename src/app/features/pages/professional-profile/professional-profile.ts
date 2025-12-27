import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { AuthService } from '../../../core/services/auth.service';
import { Professional } from '../../../core/models/professional.model';
import { ToastService } from '../../../core/services/toast.service';
import { FavoritesService } from '../../../core/services/favorites.service';

@Component({
  selector: 'app-professional-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Loading State -->
        <div *ngIf="!pro && !error" class="flex justify-center py-16">
          <div class="spinner"></div>
        </div>

        <!-- Error State -->
        <div *ngIf="error" class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 text-center">
          <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-xl font-bold text-white mb-2">Professionnel introuvable</h2>
          <p class="text-slate-300 mb-6">Ce profil n'existe pas ou a été supprimé.</p>
          <a routerLink="/search" class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Retour à la recherche
          </a>
        </div>

        <!-- Professional Profile -->
        <div *ngIf="pro" class="space-y-8">
          <!-- Header Card -->
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <div class="flex flex-col md:flex-row gap-6">
              <!-- Avatar -->
              <div class="relative">
                <div class="h-28 w-28 rounded-full overflow-hidden bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border-2 border-yellow-400/30 flex items-center justify-center font-bold text-2xl shadow-lg">
                  <img *ngIf="avatarUrl" [src]="avatarUrl" alt="{{ pro.name }}" class="h-full w-full object-cover" loading="lazy" decoding="async" />
                  <span *ngIf="!avatarUrl" class="text-yellow-300">{{ initials }}</span>
                </div>

                <!-- Status Indicator -->
                <div
                  class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-black flex items-center justify-center"
                  [ngClass]="{
                    'bg-emerald-500': pro.availabilityStatus === 'available',
                    'bg-amber-500': pro.availabilityStatus === 'busy',
                    'bg-rose-500': pro.availabilityStatus === 'temporarily_unavailable',
                    'bg-slate-500': !pro.availabilityStatus
                  }"
                  [title]="availabilityLabel(pro.availabilityStatus)"
                >
                  <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
                </div>
              </div>

              <!-- Info -->
              <div class="flex-1">
                <div class="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <div class="flex items-center gap-3 mb-2">
                      <h1 class="text-2xl md:text-3xl font-bold text-white">{{ pro.name }}</h1>
                      <span
                        class="badge px-3 py-1 rounded-full text-xs font-medium border"
                        [ngClass]="statusBadgeClass(pro.availabilityStatus)"
                      >
                        {{ availabilityLabel(pro.availabilityStatus) }}
                      </span>
                    </div>

                    <div class="flex flex-wrap items-center gap-3 mb-4">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                        <span class="text-lg font-medium text-yellow-300">{{ tradeLabel }}</span>
                      </div>

                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span class="text-slate-300">{{ pro.ville }}</span>
                        <span *ngIf="pro.quartier" class="text-slate-400">· {{ pro.quartier }}</span>
                      </div>
                    </div>

                    <!-- Experience -->
                    <div *ngIf="pro.experienceRange" class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                      <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-sm font-medium text-yellow-300">{{ getExperienceLabel(pro.experienceRange) }}</span>
                    </div>
                  </div>

                  <!-- Favorite Button -->
                  <div class="flex items-center gap-3">
                    <button
                      class="p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200 group"
                      (click)="toggleFavorite()"
                      [title]="isFavorite() ? 'Retirer des favoris' : 'Ajouter aux favoris'"
                    >
                      <svg
                        *ngIf="!isFavorite()"
                        class="w-5 h-5 text-slate-400 group-hover:text-red-400 transition-colors duration-200"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      <svg
                        *ngIf="isFavorite()"
                        class="w-5 h-5 text-red-500 animate-pulse"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contact Buttons -->
            <div class="mt-8 pt-6 border-t border-slate-800">
              <div class="flex flex-col sm:flex-row gap-3">
                <!-- Call Button -->
                <button
                  *ngIf="canCall()"
                  (click)="call()"
                  class="flex-1 px-6 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  Appeler
                </button>

                <!-- WhatsApp Button -->
                <button
                  *ngIf="canWhatsapp()"
                  (click)="whatsapp()"
                  class="flex-1 px-6 py-3.5 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.548 4.125 1.514 5.865L.212 23.505a.5.5 0 00.787.42l4.787-3.144A11.926 11.926 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.93 9.93 0 01-5.167-1.438l-.36-.214-3.766 1.246 1.262-3.678-.21-.36A9.93 9.93 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm5.61-13.5c-.33-.825-1.086-1.5-1.973-1.5H11.39c-.887 0-1.644.675-1.973 1.5l-.94 2.4c-.33.825-.088 1.575.54 2.1l.72.6c.628.525 1.455.6 1.973.225l.72-.45c.518-.375 1.345-.3 1.973.225l.72.6c.628.525.87 1.275.54 2.1l-.94 2.4c-.33.825-1.086 1.5-1.973 1.5h-2.246c-.887 0-1.644-.675-1.973-1.5l-.94-2.4c-.33-.825-.088-1.575.54-2.1l.72-.6c.628-.525 1.455-.6 1.973-.225l.72.45c.518.375 1.345.3 1.973-.225l.72-.6c.628-.525.87-1.275.54-2.1l-.94-2.4z"/>
                  </svg>
                  WhatsApp
                </button>

                <!-- Report Button -->
                <button
                  (click)="openReport()"
                  class="flex-1 px-6 py-3.5 bg-black/40 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-7.034 7.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  Signaler
                </button>
              </div>

              <!-- Login Prompt -->
              <div *ngIf="!auth.isAuthenticated()" class="mt-4 p-4 rounded-lg bg-black/40 border border-slate-700">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="text-sm font-medium text-white">Connectez-vous pour contacter ce professionnel</div>
                    <div class="text-xs text-slate-400 mt-1">Accédez à toutes les fonctionnalités</div>
                  </div>
                  <a routerLink="/login" class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm">
                    Se connecter
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-8">
              <!-- About Section -->
              <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  À propos
                </h3>
                <div class="prose prose-invert max-w-none">
                  <p class="text-slate-300 leading-relaxed" *ngIf="pro.description; else noDescription">
                    {{ pro.description }}
                  </p>
                  <ng-template #noDescription>
                    <div class="text-center py-8">
                      <svg class="w-12 h-12 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                      </svg>
                      <p class="text-slate-400">Aucune description fournie</p>
                    </div>
                  </ng-template>
                </div>
              </div>

              <!-- Rating Section -->
              <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 class="text-xl font-bold text-white flex items-center gap-3">
                      <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                      </svg>
                      Notes et avis
                    </h3>
                    <p class="text-sm text-slate-400 mt-1">Laissez votre avis sur ce professionnel</p>
                  </div>
                  <div class="text-right">
                    <div class="text-3xl font-bold text-white">{{ (pro.rating ?? 0) | number:'1.1-1' }}</div>
                    <div class="text-sm text-slate-400">{{ pro.ratingCount || 0 }} avis</div>
                  </div>
                </div>

                <!-- Rating Stars -->
                <div class="flex items-center gap-2 mb-4">
                  <div class="flex">
                    <button
                      type="button"
                      class="p-1 cursor-pointer transition-transform hover:scale-110 disabled:cursor-not-allowed disabled:opacity-60"
                      *ngFor="let s of stars; let i = index"
                      [disabled]="ratingLoading"
                      (click)="rate(i+1)"
                      [title]="'Noter ' + (i+1) + '/5'"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-7 w-7 transition-colors duration-200"
                        viewBox="0 0 20 20"
                        [attr.fill]="(i+1) <= myRating ? 'currentColor' : 'none'"
                        stroke="currentColor"
                        stroke-width="1.5"
                        [ngClass]="{
                          'text-amber-400': (i+1) <= myRating,
                          'text-slate-200 hover:text-amber-300': (i+1) > myRating
                        }"
                      >
                        <path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.563-.954L10 0l2.949 5.956 6.563.954-4.756 4.635 1.122 6.545z"/>
                      </svg>
                    </button>
                  </div>

                  <div *ngIf="ratingLoading" class="flex items-center gap-2 text-sm text-amber-400 ml-2">
                    <div class="spinner-small"></div>
                    <span>Envoi...</span>
                  </div>
                </div>

                <!-- Login Prompt for Rating -->
                <div *ngIf="!auth.isAuthenticated()" class="mt-4 p-4 rounded-lg bg-black/40 border border-slate-700">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="text-sm font-medium text-white">Connectez-vous pour noter</div>
                      <div class="text-xs text-slate-400 mt-1">Votre avis compte !</div>
                    </div>
                    <a routerLink="/login" class="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm">
                      Se connecter
                    </a>
                  </div>
                </div>
              </div>

              <!-- Images Section -->
              <div *ngIf="pro.images?.length" class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Photos
                </h3>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div
                    *ngFor="let img of pro.images"
                    class="relative aspect-square rounded-xl overflow-hidden border border-slate-700 group cursor-pointer"
                    (click)="viewImage(img.url)"
                  >
                    <img [src]="img.url" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <!-- Details Card -->
              <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Détails
                </h3>

                <div class="space-y-6">
                  <!-- Availability -->
                  <div>
                    <h4 class="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Disponibilités
                    </h4>
                    <div *ngIf="(pro.daysAvailable || []).length > 0 || pro.hoursAvailable" class="space-y-2">
                      <div *ngIf="(pro.daysAvailable || []).length > 0" class="flex flex-wrap gap-2">
                        <span
                          *ngFor="let day of pro.daysAvailable"
                          class="px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-sm font-medium text-yellow-300"
                        >
                          {{ day }}
                        </span>
                      </div>
                      <div *ngIf="pro.hoursAvailable" class="text-white font-medium">
                        {{ pro.hoursAvailable }}
                      </div>
                    </div>
                    <div *ngIf="!(pro.daysAvailable || []).length && !pro.hoursAvailable" class="text-slate-400 text-sm">
                      Non spécifié
                    </div>
                  </div>

                  <!-- Contact Info -->
                  <div>
                    <h4 class="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      Contact
                    </h4>
                    <div class="space-y-2">
                      <div class="text-white font-medium">{{ pro.telephone || 'Non disponible' }}</div>
                      <div class="text-sm text-slate-400">
                        Préfère : {{ preferredContactLabel(pro.preferredContact) }}
                      </div>
                      <div *ngIf="pro.whatsapp" class="text-sm text-emerald-400 flex items-center gap-1">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.548 4.125 1.514 5.865L.212 23.505a.5.5 0 00.787.42l4.787-3.144A11.926 11.926 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                        </svg>
                        WhatsApp disponible
                      </div>
                    </div>
                  </div>

                  <!-- Location -->
                  <div>
                    <h4 class="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                      Localisation
                    </h4>
                    <div class="space-y-1">
                      <div class="text-white font-medium">{{ pro.ville }}</div>
                      <div *ngIf="pro.quartier" class="text-slate-300">{{ pro.quartier }}</div>
                      <div class="text-sm text-slate-400">République du Congo</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Share Card -->
              <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
                <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                  </svg>
                  Partager
                </h3>
                <p class="text-slate-300 mb-4">Partagez ce profil avec vos amis et collègues</p>
                <div class="flex gap-3">
                  <button
                    (click)="shareProfile()"
                    class="flex-1 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
                    </svg>
                    Partager
                  </button>
                  <button
                    (click)="copyProfileLink()"
                    class="px-4 py-2.5 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200"
                    title="Copier le lien"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Report Modal -->
        <div *ngIf="reportOpen" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-black/90 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-7.034 7.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-bold text-white">Signaler ce profil</h3>
              </div>
              <button
                (click)="closeReport()"
                class="p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
              >
                <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>

            <!-- Report Error -->
            <div *ngIf="reportError" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div class="flex items-center gap-3">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div class="text-red-200 text-sm">{{ reportError }}</div>
              </div>
            </div>

            <!-- Report Form -->
            <div class="space-y-6">
              <!-- Reason -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Motif du signalement</label>
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0l-7.034 7.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <select
                    [(ngModel)]="reportReason"
                    name="reportReason"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="FAUX_PROFIL">Faux profil</option>
                    <option value="ARNAQUE">Arnaque ou escroquerie</option>
                    <option value="COMPORTEMENT_DEPLACE">Comportement déplacé</option>
                    <option value="INFORMATION_INCORRECTE">Information incorrecte</option>
                    <option value="AUTRE">Autre raison</option>
                  </select>
                  <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <!-- Message -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">
                  Détails (optionnel)
                  <span class="float-right text-xs text-slate-500">{{ reportMessage.length }}/500</span>
                </label>
                <div class="relative">
                  <svg class="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <textarea
                    [(ngModel)]="reportMessage"
                    name="reportMessage"
                    rows="4"
                    maxlength="500"
                    placeholder="Expliquez brièvement la raison de votre signalement..."
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent transition-all duration-200 resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button
                  (click)="closeReport()"
                  class="flex-1 px-6 py-3 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  (click)="submitReport()"
                  [disabled]="reportLoading"
                  class="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <div *ngIf="reportLoading" class="spinner-small"></div>
                  {{ reportLoading ? 'Envoi en cours...' : 'Envoyer le signalement' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Image Viewer -->
        <div *ngIf="viewingImage" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="relative max-w-4xl max-h-[90vh]">
            <button
              (click)="viewingImage = ''"
              class="absolute -top-12 right-0 p-2 rounded-lg hover:bg-slate-800/50 transition-colors duration-200"
            >
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <img [src]="viewingImage" class="max-w-full max-h-[80vh] object-contain rounded-lg" />
          </div>
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

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .badge {
      display: inline-block;
      padding: 2px 10px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 500;
      line-height: 1;
      white-space: nowrap;
    }
  `]
})
export class ProfessionalProfilePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly favorites = inject(FavoritesService);
  auth = inject(AuthService);

  pro: Professional | null = null;
  error = '';
  initials = '';
  viewingImage = '';

  myRating = 0;
  ratingLoading = false;

  reportOpen = false;
  reportReason: 'FAUX_PROFIL' | 'ARNAQUE' | 'COMPORTEMENT_DEPLACE' | 'INFORMATION_INCORRECTE' | 'AUTRE' = 'FAUX_PROFIL';
  reportMessage = '';
  reportError = '';
  reportLoading = false;

  get stars() {
    return Array(5).fill(0);
  }

  ngOnInit() {
    this.route.paramMap.subscribe((p) => {
      const id = p.get('id') || '';
      if (!id) return;

      this.api.professionalById(id).subscribe({
        next: (pro) => {
          this.pro = pro;
          this.initials = (pro.name || '')
            .split(' ')
            .filter(Boolean)
            .map((s) => s[0])
            .join('')
            .slice(0, 2)
            .toUpperCase();

          // Update SEO
          this.seo.setTitle(`${pro.name} · ${this.tradeLabel} · La STREET`);
          this.seo.updateTags({
            description: `${pro.name} - ${this.tradeLabel} à ${pro.ville}${pro.quartier ? ', ' + pro.quartier : ''}. ${pro.description || 'Professionnel disponible sur La STREET.'}`
          });
        },
        error: () => {
          this.pro = null;
          this.error = 'Professionnel introuvable';
          this.seo.setTitle('Professionnel introuvable · La STREET');
        },
      });
    });
  }

  // Helper methods
  get avatarUrl() {
    return this.pro?.profileImage?.url || '';
  }

  get tradeLabel() {
    const t: any = this.pro?.tradeId;
    if (t && typeof t === 'object') return t.name || 'Métier';
    return 'Métier';
  }

  statusBadgeClass(s: any) {
    if (s === 'available') return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    if (s === 'busy') return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
    if (s === 'temporarily_unavailable') return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    return 'bg-slate-500/10 text-slate-300 border-slate-500/25';
  }

  availabilityLabel(s: any) {
    if (s === 'available') return 'Disponible';
    if (s === 'busy') return 'Occupé';
    if (s === 'temporarily_unavailable') return 'Indisponible';
    return '—';
  }

  getExperienceLabel(range: string): string {
    switch(range) {
      case '0-1': return 'Débutant';
      case '2-5': return 'Intermédiaire';
      case '5+': return 'Expérimenté';
      default: return range;
    }
  }

  preferredContactLabel(v: any) {
    if (v === 'call') return 'Appel téléphonique';
    if (v === 'whatsapp') return 'WhatsApp';
    if (v === 'both') return 'Appel et WhatsApp';
    return '—';
  }

  isFavorite(): boolean {
    return this.pro?._id ? this.favorites.isFav(this.pro._id) : false;
  }

  toggleFavorite() {
    if (!this.pro?._id) return;
    this.favorites.toggle(this.pro._id);
  }

  // Contact methods
  canCall(): boolean {
    const p = this.pro;
    if (!p?.telephone) return false;
    return (p.preferredContact || 'both') !== 'whatsapp';
  }

  canWhatsapp(): boolean {
    const p = this.pro;
    if (!p?.telephone) return false;
    if (!p.whatsapp) return false;
    return (p.preferredContact || 'both') !== 'call';
  }

  call() {
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connectez-vous pour contacter ce professionnel');
      return;
    }

    const tel = this.pro?.telephone || '';
    if (!tel) {
      this.toast.warning('Numéro de téléphone non disponible');
      return;
    }
    window.location.href = `tel:${tel}`;
  }

  whatsapp() {
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connectez-vous pour contacter ce professionnel');
      return;
    }

    const tel = this.pro?.telephone || '';
    if (!tel) {
      this.toast.warning('Numéro de téléphone non disponible');
      return;
    }
    const clean = tel.replace(/\s+/g, '').replace(/^\+/, '');
    const message = encodeURIComponent(`Bonjour ${this.pro?.name}, je suis intéressé par vos services.`);
    window.open(`https://wa.me/${clean}?text=${message}`, '_blank');
  }

  // Rating methods
  rate(v: number) {
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connectez-vous pour noter ce professionnel');
      return;
    }
    if (!this.pro?._id) return;

    this.myRating = v;
    this.submitRating();
  }

  submitRating() {
    if (!this.pro?._id) return;
    if (!this.auth.isAuthenticated()) return;

    this.ratingLoading = true;
    this.api.rateProfessional(this.pro._id, this.myRating).subscribe({
      next: (updated) => {
        if (this.pro) {
          this.pro = {
            ...this.pro,
            rating: (updated as any)?.rating ?? this.pro.rating,
            ratingCount: (updated as any)?.ratingCount ?? this.pro.ratingCount
          };
        }
        this.toast.success('Merci', 'Votre note a été enregistrée');
        this.ratingLoading = false;
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Impossible de noter';
        this.toast.error('Erreur', msg);
        this.ratingLoading = false;
      },
    });
  }

  // Report methods
  openReport() {
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connectez-vous pour signaler un profil');
      return;
    }
    this.reportError = '';
    this.reportMessage = '';
    this.reportReason = 'FAUX_PROFIL';
    this.reportOpen = true;
  }

  closeReport() {
    this.reportOpen = false;
    this.reportLoading = false;
    this.reportError = '';
  }

  submitReport() {
    if (!this.pro?._id) return;
    this.reportLoading = true;
    this.reportError = '';

    this.api.reportProfile({
      professionalId: this.pro._id,
      reason: this.reportReason,
      message: this.reportMessage || undefined
    }).subscribe({
      next: () => {
        this.reportLoading = false;
        this.reportOpen = false;
        this.toast.success('Merci', 'Le signalement a été envoyé à notre équipe');
      },
      error: (e) => {
        this.reportLoading = false;
        this.reportError = e?.error?.message || e?.message || 'Impossible d\'envoyer le signalement.';
      },
    });
  }

  // Image viewer
  viewImage(url: string) {
    this.viewingImage = url;
  }

  // Share methods
  shareProfile() {
    if (navigator.share) {
      navigator.share({
        title: `${this.pro?.name} - ${this.tradeLabel}`,
        text: `Découvrez ${this.pro?.name}, ${this.tradeLabel} sur La STREET`,
        url: window.location.href,
      });
    } else {
      this.copyProfileLink();
    }
  }

  copyProfileLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.toast.success('Lien copié', 'Le lien du profil a été copié dans le presse-papier');
    });
  }
}
