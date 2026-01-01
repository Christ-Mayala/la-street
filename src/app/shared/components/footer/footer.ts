import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="border-t border-slate-800/50 bg-black/95 backdrop-blur-sm">
      <!-- Main Footer Content -->
      <div class="container px-4 py-8 sm:py-10 md:py-12 lg:py-16">
        <!-- Brand Section -->
        <div class="mb-10 md:mb-12">
          <a routerLink="/" class="inline-flex items-center gap-3 group mb-6">
            <div class="relative">
              <img
                src="/logo.jpg"
                alt="La STREET"
                class="relative z-10 h-12 w-12 rounded-xl object-cover ring-1 ring-yellow-400/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-yellow-400/30"
              />
              <div class="absolute -inset-1 rounded-xl bg-yellow-400/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="flex-1">
              <div class="font-bold text-lg text-white group-hover:text-yellow-400 transition-colors duration-200 mb-1">La STREET</div>
              <div class="text-sm text-slate-300 leading-tight">Plateforme des métiers locaux</div>
              <div class="text-xs text-slate-400">République du Congo</div>
            </div>
          </a>

          <p class="text-sm text-slate-300 leading-relaxed mb-6 max-w-lg">
            Connectez les talents locaux aux opportunités. Trouvez des professionnels qualifiés,
            contactez-les directement et faites avancer vos projets en toute simplicité.
          </p>

          <div class="flex flex-wrap gap-3">
            <a href="https://cyberfusion-group.vercel.app/"
               target="_blank"
               rel="noopener noreferrer"
               class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-yellow-400 transition-all duration-200 group">
              <span class="text-sm">Développé par Cyberfusion Group</span>
              <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12">
          <!-- Navigation Column -->
          <div class="space-y-6">
            <h3 class="font-bold text-white text-base relative pb-2 border-b border-slate-800/50">
              Navigation
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-yellow-400"></span>
            </h3>
            <ul class="space-y-3">
              <li>
                <a routerLink="/" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Accueil
                </a>
              </li>
              <li>
                <a routerLink="/search" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Rechercher un pro
                </a>
              </li>
              <li>
                <a routerLink="/favorites" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Mes favoris
                </a>
              </li>
              <li>
                <a routerLink="/profile" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Mon profil
                </a>
              </li>
              <li>
                <a routerLink="/about" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  À propos
                </a>
              </li>
            </ul>
          </div>

          <!-- Support Column -->
          <div class="space-y-6">
            <h3 class="font-bold text-white text-base relative pb-2 border-b border-slate-800/50">
              Support
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-yellow-400"></span>
            </h3>
            <ul class="space-y-3">
              <li>
                <a routerLink="/contact" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                  </svg>
                  Contact & Support
                </a>
              </li>
              <li>
                <a href="mailto:cyberfusion22@gmail.com" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                  </svg>
                  Email direct
                </a>
              </li>
            </ul>

            <div class="mt-4 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p class="text-xs text-slate-400 leading-relaxed">
                <span class="text-yellow-400 font-medium block mb-1">Signalez-nous :</span>
                Tout comportement inapproprié ou faux profil depuis la page concernée.
              </p>
            </div>
          </div>

          <!-- Legal Column -->
          <div class="space-y-6">
            <h3 class="font-bold text-white text-base relative pb-2 border-b border-slate-800/50">
              Légal
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-yellow-400"></span>
            </h3>
            <ul class="space-y-3">
              <li>
                <a routerLink="/terms" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  Conditions d'utilisation
                </a>
              </li>
              <li>
                <a routerLink="/privacy" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
                  Politique de confidentialité
                </a>
              </li>
            </ul>
          </div>

          <!-- Professional Section -->
          <div class="lg:col-span-1 space-y-6">
            <h3 class="font-bold text-white text-base relative pb-2 border-b border-slate-800/50">
              Professionnels
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-yellow-400"></span>
            </h3>
            <div class="space-y-4">
              <a routerLink="/register" class="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-yellow-400/30 transition-all duration-200">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-white">Devenir partenaire</div>
                  <div class="text-xs text-slate-400 mt-0.5">Inscrivez-vous gratuitement</div>
                </div>
              </a>

              <a routerLink="/search" class="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-yellow-400/30 transition-all duration-200">
                <div class="flex-shrink-0">
                  <div class="h-10 w-10 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-white">Booster sa visibilité</div>
                  <div class="text-xs text-slate-400 mt-0.5">Augmentez vos opportunités</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="mt-10 pt-8 border-t border-slate-800/50 md:col-span-4">
          <h3 class="font-bold text-white text-base mb-6 relative pb-2 border-b border-slate-800/50">
            À propos de La STREET
            <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-yellow-400"></span>
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <a routerLink="/about#mission" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
              Notre mission & valeurs
            </a>
            <a routerLink="/about#vision" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
              Vision & objectifs
            </a>
            <a routerLink="/about#team" class="flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-400 transition-colors duration-200 py-1.5">
              L'équipe derrière le projet
            </a>
          </div>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="border-t border-slate-800/50 bg-black/60 mt-8 pt-6">
        <div class="container px-4 py-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <!-- Copyright Info -->
            <div class="text-center md:text-left">
              <div class="text-sm text-slate-300 mb-1">
                © {{ year }} La STREET. Tous droits réservés.
              </div>
              <div class="text-xs text-slate-400">
                Plateforme dédiée aux professionnels et clients en République du Congo
              </div>
            </div>

            <!-- Location and Slogan -->
            <div class="flex flex-col sm:flex-row items-center gap-3 text-sm">
              <div class="flex items-center gap-2 text-slate-300 font-medium">
                <span class="text-yellow-400">🇨🇬</span>
                République du Congo
              </div>
              <div class="hidden sm:inline text-slate-600">|</div>
              <div class="text-slate-400 italic">
                Talents visibles, travail valorisé
              </div>
            </div>
          </div>

          <!-- Legal Links -->
          <div class="mt-6 pt-4 border-t border-slate-800/50">
            <div class="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-400">
              <a routerLink="/terms" class="hover:text-yellow-400 transition-colors">Conditions d'utilisation</a>
              <a routerLink="/privacy" class="hover:text-yellow-400 transition-colors">Confidentialité</a>
              <a routerLink="/contact" class="hover:text-yellow-400 transition-colors">Contact</a>
              <a routerLink="/about" class="hover:text-yellow-400 transition-colors">À propos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @media (max-width: 640px) {
      .footer-card-mobile {
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
      }
    }
  `]
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
