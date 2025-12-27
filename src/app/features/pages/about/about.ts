import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SiteStatsService } from '../../../core/services/site-stats.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Animated background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-20 -left-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-16 md:py-24">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-yellow-300">Made in Congo</span>
          </div>

          <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            <span class="text-yellow-400">La STREET</span>,<br>
            <span class="text-3xl md:text-4xl font-bold text-slate-200 mt-2 block">La vitrine des métiers locaux</span>
          </h1>

          <p class="mt-8 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Nous connectons les habitants aux meilleurs professionnels et artisans de leur région grâce à des profils vérifiés, une recherche intelligente et un cadre de confiance.
          </p>

          <!-- Stats -->
          <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400">{{ loadingStats ? '…' : (totalProfessionals | number) }}</div>
              <div class="text-sm text-slate-400">Professionnels</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400">{{ loadingStats ? '…' : (totalTrades | number) }}</div>
              <div class="text-sm text-slate-400">Métiers</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400">{{ loadingStats ? '…' : (totalCities | number) }}</div>
              <div class="text-sm text-slate-400">Villes</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-yellow-400">100%</div>
              <div class="text-sm text-slate-400">Gratuit</div>
            </div>
          </div>

          <!-- CTA Buttons -->
          <div class="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              routerLink="/register"
              class="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Devenir professionnel
            </a>
            <a
              routerLink="/search"
              class="px-8 py-3.5 bg-black/40 border border-slate-700 text-white font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              Explorer les profils
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="container py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Pourquoi choisir La STREET ?</h2>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto">Une plateforme conçue pour faciliter les échanges entre professionnels et clients</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Card 1 -->
        <div class="feature-card group">
          <div class="feature-icon bg-yellow-400/10">
            <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mt-6">Recherche intelligente</h3>
          <p class="mt-3 text-slate-300">Trouvez rapidement le professionnel qu'il vous faut par métier, ville ou quartier. Une interface simple et efficace.</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Filtrage par localisation
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Recherche par métier
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-yellow-400 rounded-full"></span>
              Suggestions personnalisées
            </li>
          </ul>
        </div>

        <!-- Card 2 -->
        <div class="feature-card group">
          <div class="feature-icon bg-emerald-400/10">
            <svg class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mt-6">Confiance garantie</h3>
          <p class="mt-3 text-slate-300">Un système de signalement et de modération pour assurer la qualité des échanges et la sécurité des utilisateurs.</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Signalement des abus
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Modération active
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
              Système de notation
            </li>
          </ul>
        </div>

        <!-- Card 3 -->
        <div class="feature-card group">
          <div class="feature-icon bg-blue-400/10">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mt-6">Disponibilité en temps réel</h3>
          <p class="mt-3 text-slate-300">Voyez directement si un professionnel est disponible, occupé ou indisponible. Plus de temps perdu !</p>
          <ul class="mt-4 space-y-2 text-sm text-slate-400">
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Statut visible
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Contact direct
            </li>
            <li class="flex items-center gap-2">
              <span class="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
              Mise à jour instantanée
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="container py-16">
      <div class="text-center mb-12">
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4">Comment ça marche ?</h2>
        <p class="text-lg text-slate-300 max-w-2xl mx-auto">En 4 étapes simples, connectez-vous aux meilleurs professionnels</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Steps -->
        <div class="space-y-8">
          <!-- Step 1 -->
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="step-number">1</div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Créez votre compte</h3>
              <p class="mt-2 text-slate-300">Inscrivez-vous gratuitement en quelques clics. Simple, rapide et sans engagement.</p>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="step-number">2</div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Recherchez un professionnel</h3>
              <p class="mt-2 text-slate-300">Utilisez nos filtres pour trouver le profil qui correspond à vos besoins.</p>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="step-number">3</div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Consultez le profil</h3>
              <p class="mt-2 text-slate-300">Photos, qualifications, avis et disponibilités : toutes les informations en un coup d'œil.</p>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="flex gap-4">
            <div class="flex-shrink-0">
              <div class="step-number">4</div>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Contactez directement</h3>
              <p class="mt-2 text-slate-300">Appel ou WhatsApp, prenez contact avec le professionnel qui vous convient.</p>
            </div>
          </div>
        </div>

        <!-- Our Commitment -->
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-8">
          <h3 class="text-2xl font-bold text-white mb-6">Notre engagement</h3>

          <div class="space-y-6">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-white">Expérience mobile-first</h4>
                <p class="text-sm text-slate-300 mt-1">Une interface optimisée pour mobile, simple et rapide à utiliser.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-white">Lutte contre les abus</h4>
                <p class="text-sm text-slate-300 mt-1">Système de signalement et modération active pour garantir la qualité.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-white">Profils professionnels</h4>
                <p class="text-sm text-slate-300 mt-1">Des outils pour présenter vos compétences, disponibilités et réalisations.</p>
              </div>
            </div>

            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              <div>
                <h4 class="font-semibold text-white">Support personnalisé</h4>
                <p class="text-sm text-slate-300 mt-1">Email de bienvenue et assistance pour faciliter votre prise en main.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="container py-16">
      <div class="bg-gradient-to-r from-yellow-400/10 via-black/30 to-yellow-400/10 rounded-2xl border border-yellow-400/20 p-8 md:p-12 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">Prêt à rejoindre La STREET ?</h2>
        <p class="text-slate-300 mb-8 max-w-2xl mx-auto">
          Que vous soyez professionnel cherchant à développer votre activité ou client à la recherche de services de qualité, notre plateforme est faite pour vous.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            routerLink="/register"
            class="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Créer un profil gratuitement
          </a>

          <a
            routerLink="/profile"
            class="px-8 py-3.5 bg-black/40 border border-slate-700 text-white font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Gérer mon compte
          </a>
        </div>

        <p class="mt-8 text-sm text-slate-400">
          Déjà <span class="text-yellow-300 font-semibold">{{ loadingStats ? '…' : (totalProfessionals | number) }} professionnels</span> nous font confiance. Et vous ?
        </p>
      </div>
    </section>
  `,
  styles: [`
    .hero-bg {
      background-image:
        radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%);
    }

    .feature-card {
      @apply p-6 bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 hover:border-yellow-400/30 transition-all duration-300 hover:bg-black/40;
    }

    .feature-icon {
      @apply w-12 h-12 rounded-xl flex items-center justify-center;
    }

    .step-number {
      @apply w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 text-white font-bold rounded-full flex items-center justify-center text-lg;
    }
  `]
})
export class AboutPage implements OnInit {
  private readonly stats = inject(SiteStatsService);

  loadingStats = true;
  totalProfessionals = 0;
  totalTrades = 0;
  totalCities = 0;

  ngOnInit() {
    const seo = inject(SeoService);
    seo.setTitle('À propos · La STREET - La vitrine des métiers locaux');
    seo.updateTags({
      description: 'Découvrez La STREET, la plateforme qui connecte les habitants aux meilleurs professionnels et artisans locaux en République du Congo. Simple, rapide et fiable.'
    });

    this.loadingStats = true;
    this.stats.counts().subscribe({
      next: (c) => {
        this.totalProfessionals = c?.totalProfessionals || 0;
        this.totalTrades = c?.totalTrades || 0;
        this.totalCities = c?.totalCities || 0;
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
      },
    });
  }
}
