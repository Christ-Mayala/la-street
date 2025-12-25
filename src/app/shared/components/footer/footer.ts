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
      <div class="container px-4 py-8 sm:py-10 md:py-12 lg:py-14">
        <div class="grid grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2 xl:grid-cols-4">

          <!-- Brand Column -->
          <div class="xl:col-span-2">
            <a routerLink="/" class="inline-flex items-center gap-3 group mb-6">
              <div class="relative">
                <span class="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-black font-bold text-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30">
                  LS
                </span>
                <div class="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div class="flex-1">
                <div class="font-bold text-lg text-white group-hover:text-primary transition-colors duration-200 mb-1">La STREET</div>
                <div class="text-sm text-slate-300 leading-tight">Plateforme des métiers</div>
                <div class="text-xs text-slate-400">République du Congo</div>
              </div>
            </a>

            <p class="text-sm text-slate-300 leading-relaxed mb-6 max-w-lg pr-4">
              Connectez les talents aux opportunités. Trouvez des professionnels qualifiés,
              contactez-les directement et faites avancer vos projets en toute simplicité.
            </p>

            <div class="flex flex-wrap gap-3">
              <a href="https://cyberfusion-group.vercel.app/"
                 target="_blank"
                 rel="noopener noreferrer"
                 class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 hover:text-primary transition-all duration-200 group">
                <span class="text-sm">Propulsé par Cyberfusion Group</span>
                <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Quick Links Column -->
          <div class="lg:col-span-1">
            <h3 class="font-bold text-white text-base mb-6 relative pb-2 border-b border-slate-800/50">
              Navigation
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-primary"></span>
            </h3>
            <ul class="space-y-3.5">
              <li>
                <a routerLink="/"
                   class="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-all duration-200 hover:translate-x-1 group py-1.5">
                  <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Accueil
                </a>
              </li>
              <li>
                <a routerLink="/search"
                   class="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-all duration-200 hover:translate-x-1 group py-1.5">
                  <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Rechercher un pro
                </a>
              </li>
              <li>
                <a routerLink="/favorites"
                   class="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-all duration-200 hover:translate-x-1 group py-1.5">
                  <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Mes favoris
                </a>
              </li>
              <li>
                <a routerLink="/profile"
                   class="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-all duration-200 hover:translate-x-1 group py-1.5">
                  <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  Mon profil
                </a>
              </li>
              <li>
                <a routerLink="/about"
                   class="flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-all duration-200 hover:translate-x-1 group py-1.5">
                  <svg class="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                  À propos
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal & Support Column -->
          <div class="lg:col-span-1">
            <h3 class="font-bold text-white text-base mb-6 relative pb-2 border-b border-slate-800/50">
              Support & Légal
              <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-primary"></span>
            </h3>

            <div class="space-y-6">
              <div>
                <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Aide</h4>
                <ul class="space-y-3.5">
                  <li>
                    <a routerLink="/contact"
                       class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-colors duration-200 group">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg>
                      Contact & Support
                    </a>
                  </li>
                  <li>
                    <a href="mailto:cyberfusion22@gmail.com"
                       class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-primary transition-colors duration-200 group">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      Email direct
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Documents</h4>
                <ul class="space-y-3.5">
                  <li>
                    <a routerLink="/terms"
                       class="text-sm text-slate-300 hover:text-primary transition-colors duration-200 block py-0.5">
                      Conditions d'utilisation
                    </a>
                  </li>
                  <li>
                    <a routerLink="/privacy"
                       class="text-sm text-slate-300 hover:text-primary transition-colors duration-200 block py-0.5">
                      Politique de confidentialité
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Important Notice -->
            <div class="mt-8 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
              <p class="text-xs text-slate-400 leading-relaxed">
                <span class="text-primary font-medium block mb-1">Signalez-nous :</span>
                Tout comportement inapproprié ou faux profil depuis la page concernée.
              </p>
            </div>
          </div>
        </div>

        <!-- Professional Section -->
        <div class="mt-12 pt-10 border-t border-slate-800/50">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <h3 class="font-bold text-white text-base mb-6 relative pb-2 border-b border-slate-800/50">
                Pour les Professionnels
                <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-primary"></span>
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <a routerLink="/register"
                   class="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-primary/30 transition-all duration-200 group">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white group-hover:text-primary">Devenir partenaire</div>
                    <div class="text-xs text-slate-400 mt-0.5">Inscrivez-vous gratuitement</div>
                  </div>
                </a>

                <a routerLink="/search"
                   class="flex items-center gap-3 p-4 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 border border-slate-700/50 hover:border-primary/30 transition-all duration-200 group">
                  <div class="flex-shrink-0">
                    <div class="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <div class="text-sm font-medium text-white group-hover:text-primary">Booster sa visibilité</div>
                    <div class="text-xs text-slate-400 mt-0.5">Augmentez vos opportunités</div>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 class="font-bold text-white text-base mb-6 relative pb-2 border-b border-slate-800/50">
                À propos de La STREET
                <span class="absolute -bottom-px left-0 w-10 h-0.5 bg-primary"></span>
              </h3>
              <ul class="space-y-3.5">
                <li>
                  <a routerLink="/about#mission"
                     class="text-sm text-slate-300 hover:text-primary transition-colors duration-200 block py-1.5">
                    Notre mission & valeurs
                  </a>
                </li>
                <li>
                  <a routerLink="/about#vision"
                     class="text-sm text-slate-300 hover:text-primary transition-colors duration-200 block py-1.5">
                    Vision & objectifs
                  </a>
                </li>
                <li>
                  <a routerLink="/about#team"
                     class="text-sm text-slate-300 hover:text-primary transition-colors duration-200 block py-1.5">
                    L'équipe derrière le projet
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Copyright Bar -->
      <div class="border-t border-slate-800/50 bg-black/60">
        <div class="container px-4 py-6 sm:py-7">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-5">
            <div class="text-center lg:text-left">
              <div class="text-sm text-slate-300 mb-1">
                © {{ year }} La STREET. Tous droits réservés.
              </div>
              <div class="text-xs text-slate-400">
                Plateforme dédiée aux professionnels et clients en République du Congo
              </div>
            </div>

            <div class="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
              <div class="text-sm text-slate-300 font-medium flex items-center gap-2">
                <span class="text-primary">🇨🇬</span>
                République du Congo
              </div>
              <div class="hidden sm:block text-slate-600">•</div>
              <div class="text-sm text-slate-400 italic text-center sm:text-left">
                Talents visibles, travail valorisé
              </div>
            </div>
          </div>

          <!-- Legal Links -->
          <div class="mt-6 pt-5 border-t border-slate-800/50">
            <div class="flex flex-wrap items-center justify-center gap-4 sm:gap-5 text-xs text-slate-400">
              <a routerLink="/terms" class="hover:text-primary transition-colors duration-200 px-1">Conditions d'utilisation</a>
              <span class="text-slate-600 hidden sm:inline">•</span>
              <a routerLink="/privacy" class="hover:text-primary transition-colors duration-200 px-1">Confidentialité</a>
              <span class="text-slate-600 hidden sm:inline">•</span>
              <a routerLink="/contact" class="hover:text-primary transition-colors duration-200 px-1">Contact</a>
              <span class="text-slate-600 hidden sm:inline">•</span>
              <a routerLink="/about" class="hover:text-primary transition-colors duration-200 px-1">À propos</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
