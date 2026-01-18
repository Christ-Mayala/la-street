import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Professional } from '../../../core/models/professional.model';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { SeoService } from '../../../core/services/seo.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { SiteStatsService } from '../../../core/services/site-stats.service';

// ... imports restent les mêmes jusqu'à ...

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProfessionalCardComponent],
  template: `
    <!-- Bandeau flottant pour inscription/connexion (visible seulement si non connecté) -->
    @if (!isLoggedIn() && !isNotificationHidden()) {
      <div class="notification-bar fixed top-0 left-0 right-0 z-50 px-4 py-3 sm:px-6 lg:px-8">
        <div class="flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto gap-3 sm:gap-0">
          <div class="flex items-center gap-3">
            <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 flex-shrink-0">
              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </span>
            <p class="text-sm font-medium text-white text-center sm:text-left">
              <span class="hidden sm:inline">Rejoignez la communauté des professionnels du Congo. </span>
              <span class="font-bold">Inscrivez-vous gratuitement</span> ou connectez-vous pour accéder à tous les talents.
            </p>
          </div>
          <div class="flex gap-2 items-center">
            <a
              [routerLink]="['/login']"
              class="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white/30 rounded-lg hover:bg-white/10 transition-colors duration-200 whitespace-nowrap"
            >
              Connexion
            </a>
            <a
              [routerLink]="['/register']"
              class="px-4 py-2 text-sm font-medium text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-colors duration-200 pulse-glow whitespace-nowrap"
            >
              S'inscrire
            </a>
            <button
              (click)="hideNotificationBar()"
              class="p-2 ml-2 text-white rounded-full hover:bg-white/10 transition-colors duration-200 flex-shrink-0"
              aria-label="Fermer la notification"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- Hero Section avec fond doré -->
    <section class="relative overflow-hidden hero-bg" [class.pt-20]="!isLoggedIn() && !isNotificationHidden()">
      <!-- Background avec effet doré -->
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Éléments d'arrière-plan dorés -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute top-10 left-10 w-72 h-72 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-10 w-96 h-96 bg-yellow-400/3 rounded-full blur-3xl"></div>
        <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-12 md:py-24">
        <div class="max-w-3xl mx-auto lg:mx-0">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-yellow-300">Plateforme République du Congo</span>
          </div>

          <h1 class="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white text-center lg:text-left">
            La <span class="text-yellow-400 relative inline-block">STREET
              <span class="absolute -bottom-1 left-0 w-full h-1 bg-yellow-400/50 rounded-full"></span>
            </span>
          </h1>
          <p class="mt-4 text-xl md:text-3xl font-bold text-slate-200 text-center lg:text-left">
            Les talents visibles, le travail valorisé.
          </p>
          <p class="mt-6 text-base md:text-lg text-slate-300 text-center lg:text-left">
            Trouvez un professionnel par métier et localité (République du Congo).
          </p>

          <!-- Stats -->
          <div class="mt-10 flex flex-wrap gap-6 md:gap-8 justify-center lg:justify-start">
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-400">{{ totalProfessionals }}</div>
              <div class="text-sm text-slate-400">Professionnels</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-400">{{ totalTrades }}</div>
              <div class="text-sm text-slate-400">Métiers</div>
            </div>
            <div class="text-center">
              <div class="text-2xl md:text-3xl font-bold text-yellow-400">{{ totalCities }}</div>
              <div class="text-sm text-slate-400">Villes</div>
            </div>
          </div>
        </div>

        <!-- Formulaire de recherche amélioré -->
        <div class="mt-12 bg-black/30 backdrop-blur-sm rounded-xl border border-slate-800 p-4 md:p-6 max-w-6xl mx-auto">
          <h2 class="text-lg md:text-xl font-bold text-white mb-4 md:mb-6 flex items-center gap-2 md:gap-3">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Trouvez le professionnel parfait
          </h2>

          <form class="space-y-4" (ngSubmit)="onSearch()">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <input
                  [(ngModel)]="q"
                  name="q"
                  type="text"
                  placeholder="Métier (ex: Plombier)"
                  class="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                />
              </div>

              <div class="relative">
                <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <input
                  [(ngModel)]="ville"
                  name="ville"
                  type="text"
                  placeholder="Ville (ex: Brazzaville)"
                  class="w-full pl-10 md:pl-12 pr-4 py-3 md:py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 text-sm md:text-base"
                />
              </div>

              <button
                type="submit"
                class="w-full md:w-auto px-6 md:px-8 py-3 md:py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                Rechercher
              </button>
            </div>

            <div class="flex flex-col sm:flex-row items-center justify-between pt-2 gap-2 sm:gap-0">
              <p class="text-xs md:text-sm text-slate-400 text-center sm:text-left">
                <span class="text-yellow-300 font-medium">Conseil :</span> Laissez un champ vide pour étendre votre recherche
              </p>
              <a [routerLink]="['/search']" class="text-xs md:text-sm text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200 whitespace-nowrap">
                Recherche avancée →
              </a>
            </div>
          </form>
        </div>

        <!-- Scroll indicator -->
        <div class="mt-8 md:mt-12 flex justify-center">
          <div class="animate-bounce">
            <svg class="w-5 h-5 md:w-6 md:h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <main class="container py-8 md:py-12">
      <!-- Section Recommandés (seulement ceux avec 4-5 étoiles) -->
      <section class="mb-12 md:mb-16">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
          <div>
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-white">Professionnels recommandés</h2>
            <p class="mt-1 md:mt-2 text-sm md:text-base text-slate-400">Les meilleurs professionnels avec 4 à 5 étoiles</p>
          </div>
          <a
            [routerLink]="['/search']"
            class="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 text-sm md:text-base whitespace-nowrap"
          >
            Voir tout
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>

        <!-- Loading state -->
        @if (loadingRecommended) {
          <div class="flex justify-center py-8 md:py-12">
            <div class="spinner"></div>
          </div>
        }

        <!-- Content -->
        @if (!loadingRecommended && recommended().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            @for (p of recommended(); track p._id) {
              <app-professional-card [pro]="p" />
            }
          </div>
        }

        <!-- Empty state -->
        @if (!loadingRecommended && recommended().length === 0) {
          <div class="text-center py-8 md:py-12 bg-black/20 rounded-xl border border-slate-800">
            <svg class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
            </svg>
            <h3 class="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">Aucune recommandation pour le moment</h3>
            <p class="text-xs md:text-sm text-slate-400">Les professionnels avec 4 à 5 étoiles apparaîtront ici</p>
          </div>
        }
      </section>

      <!-- Section Nouveaux profils (limité aux 3 derniers) -->
      <section>
        <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4 sm:gap-0">
          <div>
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-white">Nouveaux profils</h2>
            <p class="mt-1 md:mt-2 text-sm md:text-base text-slate-400">Les 3 derniers professionnels inscrits</p>
          </div>
          <a
            [routerLink]="['/search']"
            class="inline-flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 text-sm md:text-base whitespace-nowrap"
          >
            Explorer tous les profils
            <svg class="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>

        <!-- Loading state -->
        @if (loadingPros) {
          <div class="flex justify-center py-8 md:py-12">
            <div class="spinner"></div>
          </div>
        }

        <!-- Content - Limité à 3 profils -->
        @if (!loadingPros && pros().length > 0) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            @for (p of getLastThreeProfessionals(); track p._id) {
              <app-professional-card [pro]="p" />
            }
          </div>
        }

        <!-- Error state -->
        @if (error) {
          <div class="mt-6 p-4 md:p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 md:w-6 md:h-6 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="text-sm md:text-base font-semibold text-red-300 mb-1">Erreur de chargement</h3>
                <p class="text-xs md:text-sm text-red-200">{{ error }}</p>
                <button
                  (click)="retryLoading()"
                  class="mt-2 md:mt-3 text-xs md:text-sm px-3 md:px-4 py-1.5 md:py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-300 transition-colors duration-200"
                >
                  Réessayer
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Empty state -->
        @if (!loadingPros && !error && pros().length === 0) {
          <div class="text-center py-8 md:py-12 bg-black/20 rounded-xl border border-slate-800">
            <svg class="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
            <h3 class="text-base md:text-lg font-semibold text-white mb-1 md:mb-2">Aucun profil disponible</h3>
            <p class="text-xs md:text-sm text-slate-400 mb-4 md:mb-6">Soyez le premier à rejoindre notre plateforme</p>
            <a
              [routerLink]="['/register']"
              class="inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm md:text-base"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Inscrivez-vous gratuitement
            </a>
          </div>
        }
      </section>

      <!-- CTA Section -->
      @if (!isLoggedIn()) {
        <section class="mt-12 md:mt-20">
          <div class="bg-black/30 rounded-xl border border-slate-800 p-6 md:p-8 lg:p-12 text-center">
            <h2 class="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-3 md:mb-4">Vous êtes professionnel ?</h2>
            <p class="text-sm md:text-base text-slate-300 mb-6 md:mb-8 max-w-2xl mx-auto">
              Rejoignez notre communauté et augmentez votre visibilité. Des milliers de clients vous attendent.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a
                [routerLink]="['/register']"
                class="px-6 md:px-8 py-2.5 md:py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm md:text-base"
              >
                Créer mon profil gratuitement
              </a>
              <a
                [routerLink]="['/about']"
                class="px-6 md:px-8 py-2.5 md:py-3.5 bg-black/60 border border-slate-700 text-white font-semibold rounded-lg hover:bg-black/80 hover:border-slate-600 transition-all duration-200 text-sm md:text-base"
              >
                En savoir plus
              </a>
            </div>
          </div>
        </section>
      }
    </main>

    <!-- Modale d'inscription/connexion (seulement si non connecté et pas déjà fermée) -->
    @if (showAuthModal && !isLoggedIn() && !isModalDismissed()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="max-w-md w-full bg-black/90 rounded-2xl border border-yellow-500/20 overflow-hidden shadow-2xl shadow-yellow-500/10">
          <div class="p-6 md:p-8 text-center">
            <div class="mx-auto w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-full bg-yellow-500/20 mb-3 md:mb-4">
              <svg class="w-6 h-6 md:w-8 md:h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl md:text-2xl font-bold text-white mb-2">Rejoignez La STREET</h3>
            <p class="text-sm md:text-base text-slate-300 mb-4 md:mb-6">
              Créez votre profil gratuitement et accédez à des milliers de professionnels vérifiés en République du Congo.
            </p>
            <div class="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <a
                [routerLink]="['/register']"
                (click)="closeModal()"
                class="px-4 md:px-6 py-2.5 md:py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors duration-200 spotlight text-sm md:text-base"
              >
                S'inscrire
              </a>
              <a
                [routerLink]="['/login']"
                (click)="closeModal()"
                class="px-4 md:px-6 py-2.5 md:py-3 bg-transparent border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-200 text-sm md:text-base"
              >
                Connexion
              </a>
            </div>
            <button
              (click)="dismissModal()"
              class="absolute top-2 md:top-4 right-2 md:right-4 p-2 text-white rounded-full hover:bg-white/10 transition-colors duration-200"
              aria-label="Fermer la modale"
            >
              <svg class="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <div class="mt-4 md:mt-6">
              <label class="flex items-center justify-center gap-2 text-xs md:text-sm text-slate-400">
                <input type="checkbox" [checked]="isModalDismissed()" (change)="toggleModalDismiss($event)" class="w-3 h-3 md:w-4 md:h-4" />
                Ne plus afficher
              </label>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .hero-bg {
      background-image:
        radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%);
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(234, 179, 8, 0.2);
      border-radius: 50%;
      border-top-color: #eab308;
      animation: spin 1s ease-in-out infinite;
    }

    @media (min-width: 768px) {
      .spinner {
        width: 50px;
        height: 50px;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .notification-bar {
      background: linear-gradient(90deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 20, 0.95) 100%);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(234, 179, 8, 0.2);
    }

    @keyframes pulse-glow {
      0% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0.4); }
      70% { box-shadow: 0 0 0 8px rgba(234, 179, 8, 0); }
      100% { box-shadow: 0 0 0 0 rgba(234, 179, 8, 0); }
    }

    .pulse-glow {
      animation: pulse-glow 2s infinite;
    }

    @keyframes spotlight {
      0% { filter: drop-shadow(0 0 0 rgba(234, 179, 8, 0.8)); }
      100% { filter: drop-shadow(0 0 12px rgba(234, 179, 8, 0.8)); }
    }

    .spotlight {
      animation: spotlight 1.5s ease-in-out infinite alternate;
    }

    :host ::ng-deep app-professional-card {
      transition: transform 0.2s ease;
    }

    :host ::ng-deep app-professional-card:hover {
      transform: translateY(-2px);
    }
  `]
})
export class HomePage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly stats = inject(SiteStatsService);
  private readonly seo = inject(SeoService);

  private authSubscription?: Subscription;
  private modalTimer?: any;

  q = '';
  ville = '';
  loadingPros = true;
  loadingRecommended = true;
  totalProfessionals = 0;
  totalTrades = 0;
  totalCities = 0;
  showAuthModal = false;

  readonly pros = signal<Professional[]>([]);
  readonly recommended = signal<Professional[]>([]);
  readonly isLoggedIn = signal<boolean>(false);
  readonly isNotificationHidden = signal<boolean>(false);
  readonly isModalDismissed = signal<boolean>(false);
  error = '';

  ngOnInit() {
    // Vérifier l'état d'authentification initial
    this.isLoggedIn.set(!!this.auth.user());

    // S'abonner aux changements d'authentification
    this.authSubscription = this.auth.user$.subscribe(user => {
      this.isLoggedIn.set(!!user);

      // Si l'utilisateur se connecte, fermer toutes les modales et notifications
      if (user) {
        this.showAuthModal = false;
        this.isNotificationHidden.set(true);
        this.dismissModal();
      }
    });

    // Charger les préférences stockées
    this.loadPreferences();

    // Vérifier si l'utilisateur est admin
    const user = this.auth.user();
    if (user?.role?.toLowerCase() === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    this.loadRecommended();
    this.loadProfessionals();
    this.loadStats();

    // Configuration SEO
    this.seo.setTitle('La STREET · Plateforme des métiers');
    this.seo.updateTags({
      description: 'La STREET connecte les habitants à des professionnels par métier et localité en République du Congo.'
    });

    // Afficher la modale après 10 secondes seulement si l'utilisateur n'est pas connecté
    // et n'a pas déjà choisi de ne plus la voir
    if (!this.isLoggedIn() && !this.isModalDismissed()) {
      this.modalTimer = setTimeout(() => {
        this.showAuthModal = true;
      }, 10000);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
    }
  }

  private loadPreferences() {
    const notificationHidden = localStorage.getItem('home_notification_hidden');
    const modalDismissed = localStorage.getItem('home_modal_dismissed');

    if (notificationHidden === 'true') {
      this.isNotificationHidden.set(true);
    }

    if (modalDismissed === 'true') {
      this.isModalDismissed.set(true);
    }
  }

  private savePreferences() {
    localStorage.setItem('home_notification_hidden', this.isNotificationHidden().toString());
    localStorage.setItem('home_modal_dismissed', this.isModalDismissed().toString());
  }

  private loadStats() {
    this.stats.counts().subscribe({
      next: (c) => {
        this.totalCities = c?.totalCities || 0;
        this.totalTrades = c?.totalTrades || 0;
        if (!this.totalProfessionals) this.totalProfessionals = c?.totalProfessionals || 0;
      },
      error: () => {
        // Valeurs par défaut en cas d'erreur
        this.totalCities = 15;
        this.totalTrades = 50;
        this.totalProfessionals = this.pros().length;
      }
    });
  }

  loadRecommended() {
    this.loadingRecommended = true;
    this.api.recommendations({ limit: 6 }).subscribe({
      next: (list) => {
        const highRated = (list || []).filter(pro => {
          const rating = pro.rating || 0;
          return rating >= 4;
        });
        this.recommended.set(highRated);
        this.loadingRecommended = false;
      },
      error: () => {
        this.recommended.set([]);
        this.loadingRecommended = false;
      },
    });
  }

  loadProfessionals() {
    this.loadingPros = true;
    this.error = '';
    this.api.professionalsPaged({ page: 1, limit: 50 }).subscribe({
      next: (r) => {
        const items = r?.items || [];
        this.pros.set(items);
        this.totalProfessionals = r?.total || 0;
        this.loadingPros = false;
      },
      error: (e) => {
        this.error = e?.message || 'Erreur lors du chargement des profils';
        this.pros.set([]);
        this.loadingPros = false;
      },
    });
  }

  getLastThreeProfessionals(): Professional[] {
    return this.pros().slice(0, 3);
  }

  retryLoading() {
    this.loadProfessionals();
    this.loadRecommended();
  }

  onSearch() {
    const query: any = {};
    if (this.q.trim()) query.q = this.q.trim();
    if (this.ville.trim()) query.ville = this.ville.trim();
    this.router.navigate(['/search'], { queryParams: query });
  }

  hideNotificationBar() {
    this.isNotificationHidden.set(true);
    this.savePreferences();
  }

  closeModal() {
    this.showAuthModal = false;
  }

  dismissModal() {
    this.closeModal();
    this.isModalDismissed.set(true);
    this.savePreferences();
  }

  toggleModalDismiss(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isModalDismissed.set(checked);
    this.savePreferences();

    if (checked) {
      this.closeModal();
    }
  }
}
