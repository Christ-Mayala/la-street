import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-40 w-full bg-black/95 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/20">
      <div class="container flex h-16 items-center justify-between">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 font-semibold text-white group">
          <div class="relative">
            <img
              src="/logo.jpg"
              alt="La STREET"
              class="relative z-10 h-9 w-9 rounded-lg object-cover ring-1 ring-primary/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/30"
            />
            <div class="absolute -inset-1 rounded-lg bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          <span class="text-lg font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            La STREET
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <ng-container *ngIf="auth.user() as u; else normalNav">
            <a *ngIf="String(u.role).toLowerCase()==='admin'"
               routerLink="/admin"
               routerLinkActive="text-primary"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              Tableau
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>

            <a routerLink="/profile"
               routerLinkActive="text-primary"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              Mon profil
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>

            <ng-container *ngIf="String(u.role).toLowerCase()!=='admin'">
              <a routerLink="/"
                 routerLinkActive="text-primary"
                 [routerLinkActiveOptions]="{exact: true}"
                 class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
                Accueil
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>

              <a routerLink="/search"
                 routerLinkActive="text-primary"
                 class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
                Recherche
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>

              <a routerLink="/about"
                 routerLinkActive="text-primary"
                 class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
                À propos
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>

              <a routerLink="/contact"
                 routerLinkActive="text-primary"
                 class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
                Contact
                <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
              </a>
            </ng-container>
          </ng-container>

          <ng-template #normalNav>
            <a routerLink="/"
               routerLinkActive="text-primary"
               [routerLinkActiveOptions]="{exact: true}"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              Accueil
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>

            <a routerLink="/search"
               routerLinkActive="text-primary"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              Recherche
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>

            <a routerLink="/about"
               routerLinkActive="text-primary"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              À propos
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>

            <a routerLink="/contact"
               routerLinkActive="text-primary"
               class="text-sm text-slate-200 hover:text-primary transition-all duration-200 hover:scale-105 relative group">
              Contact
              <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
            </a>
          </ng-template>
        </nav>

        <!-- Right Actions -->
        <div class="flex items-center gap-3">
          <!-- Favorites Button -->
          <button class="relative p-2 group"
                  [routerLink]="['/favorites']"
                  title="Favoris"
                  [attr.aria-label]="'Favoris ' + (favCount > 0 ? '(' + favCount + ')' : '')">
            <svg xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6 text-slate-200 group-hover:text-primary transition-all duration-200 group-hover:scale-110"
                 viewBox="0 0 24 24"
                 fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C13.46 4.99 14.96 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span *ngIf="favCount > 0"
                  class="absolute -top-1 -right-1 inline-flex items-center justify-center rounded-full bg-primary text-black text-xs font-bold h-5 w-5 min-w-[20px] animate-pulse shadow-lg">
              {{ favCount > 99 ? '99+' : favCount }}
            </span>
          </button>

          <!-- User Actions -->
          <ng-container *ngIf="auth.user() as u; else guest">
            <div class="hidden sm:flex items-center gap-4">
              <!-- User Info -->
              <div class="flex items-center gap-2">
                <div class="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                  <span class="text-xs font-bold text-primary">{{ getUserInitials(u.name) }}</span>
                </div>
                <div class="hidden lg:flex flex-col">
                  <span class="text-xs text-slate-400">Bonjour,</span>
                  <span class="text-sm font-medium text-slate-200 max-w-[120px] truncate">{{ u.name }}</span>
                </div>
              </div>

              <!-- Logout Button -->
              <button class="btn-outline group relative overflow-hidden"
                      (click)="logout()"
                      [attr.aria-label]="'Déconnexion de ' + u.name">
                <span class="relative z-10 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  Déconnexion
                </span>
              </button>
            </div>
          </ng-container>

          <ng-template #guest>
            <div class="hidden sm:flex items-center gap-2">
              <button class="btn-outline group relative overflow-hidden" [routerLink]="['/login']">
                <span class="relative z-10">Connexion</span>
              </button>
              <button class="btn-primary group relative overflow-hidden" [routerLink]="['/register']">
                <span class="relative z-10 flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  S'inscrire
                </span>
              </button>
            </div>
          </ng-template>

          <!-- Mobile Menu Button - CORRIGÉ -->
          <button class="md:hidden p-2 rounded-md bg-black/50 border border-slate-800 hover:border-primary/30 transition-all duration-200 group"
                  (click)="toggleMenu($event)"
                  [attr.aria-expanded]="menuOpen()"
                  [attr.aria-label]="menuOpen() ? 'Fermer le menu' : 'Ouvrir le menu'">
            <svg *ngIf="!menuOpen()"
                 xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6 text-slate-200 group-hover:text-primary transition-transform duration-200"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
            <svg *ngIf="menuOpen()"
                 xmlns="http://www.w3.org/2000/svg"
                 class="h-6 w-6 text-slate-200 group-hover:text-primary transition-transform duration-200"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div *ngIf="menuOpen()"
           class="md:hidden bg-black/95 backdrop-blur-lg border-t border-slate-800/50 animate-slideDown"
           (click)="$event.stopPropagation()">

        <div class="px-4 py-3 flex items-center justify-end">
          <button class="p-2 rounded-md text-slate-400 hover:text-primary transition-colors"
                  (click)="closeMenu()"
                  aria-label="Fermer le menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="px-4 py-2 flex flex-col gap-1">
          <!-- Navigation Links -->
          <ng-container *ngIf="auth.user() as u">
            <div *ngIf="u.role==='admin'" class="py-3">
              <a routerLink="/admin"
                 (click)="closeMenu()"
                 class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Tableau de bord
              </a>
            </div>

            <a routerLink="/profile"
               (click)="closeMenu()"
               class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              Mon profil
            </a>
          </ng-container>

          <a routerLink="/"
             (click)="closeMenu()"
             class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
            </svg>
            Accueil
          </a>

          <a routerLink="/search"
             (click)="closeMenu()"
             class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            Recherche
          </a>

          <a routerLink="/about"
             (click)="closeMenu()"
             class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            À propos
          </a>

          <a routerLink="/contact"
             (click)="closeMenu()"
             class="flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
            Contact
          </a>

          <a routerLink="/favorites"
             (click)="closeMenu()"
             class="flex items-center justify-between py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.54 0 3.04.99 3.57 2.36h.87C13.46 4.99 14.96 4 16.5 4 19 4 21 6 21 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              Favoris
            </div>
            <span *ngIf="favCount > 0"
                  class="inline-flex items-center justify-center rounded-full bg-primary text-black text-xs font-bold h-5 w-5 min-w-[20px]">
              {{ favCount > 99 ? '99+' : favCount }}
            </span>
          </a>

          <!-- User Section -->
          <div class="mt-4 pt-4 border-t border-slate-800/50">
            <ng-container *ngIf="auth.user() as u; else guestMobile">
              <div class="flex items-center gap-3 mb-4 p-3 rounded-lg bg-primary/5">
                <div class="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border border-primary/30 flex items-center justify-center">
                  <span class="text-sm font-bold text-primary">{{ getUserInitials(u.name) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-slate-200 truncate">{{ u.name }}</div>
                  <div class="text-xs text-slate-400">{{ u.email }}</div>
                </div>
              </div>

              <button (click)="logout(); closeMenu()"
                      class="w-full flex items-center gap-3 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                </svg>
                Déconnexion
              </button>
            </ng-container>

            <ng-template #guestMobile>
              <div class="grid grid-cols-2 gap-2">
                <button [routerLink]="['/login']"
                        (click)="closeMenu()"
                        class="flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-slate-200 hover:bg-primary/10 hover:text-primary transition-all duration-200 group border border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                  </svg>
                  Connexion
                </button>
                <button [routerLink]="['/register']"
                        (click)="closeMenu()"
                        class="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-primary text-black font-medium hover:bg-primary/90 transition-all duration-200 group">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                  </svg>
                  S'inscrire
                </button>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    :host {
      display: block;
    }

    .btn-outline {
      @apply px-4 py-2 rounded-lg border border-slate-700 text-slate-200 text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:text-primary hover:scale-105;
    }

    .btn-primary {
      @apply px-4 py-2 rounded-lg bg-primary text-black text-sm font-medium transition-all duration-200 hover:bg-primary/90 hover:scale-105;
    }

    .animate-slideDown {
      animation: slideDown 0.3s ease-out;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.7;
      }
    }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);
  protected readonly auth = inject(AuthService);
  protected readonly favorites = inject(FavoritesService);

  private routerSubscription!: Subscription;
  private clickListener!: () => void;

  get favCount() {
    return this.favorites.favs().length;
  }

  ngOnInit() {
    // Fermer le menu mobile lors de la navigation
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen.set(false);
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }

    // Retirer le listener de clic
    if (this.clickListener) {
      this.clickListener();
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation(); // Empêche la propagation du clic
    this.menuOpen.set(!this.menuOpen());

    // Ajouter/supprimer le listener de clic à l'extérieur
    if (this.menuOpen()) {
      this.addOutsideClickListener();
    } else {
      this.removeOutsideClickListener();
    }
  }

  closeMenu() {
    this.menuOpen.set(false);
    this.removeOutsideClickListener();
  }

  private addOutsideClickListener() {
    // Ajouter un délai pour éviter que le clic actuel ne ferme immédiatement
    setTimeout(() => {
      this.clickListener = () => {
        if (this.menuOpen()) {
          this.closeMenu();
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('click', this.clickListener);
      }
    }, 100);
  }

  private removeOutsideClickListener() {
    if (this.clickListener && typeof window !== 'undefined') {
      window.removeEventListener('click', this.clickListener);
      this.clickListener = undefined!;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  getUserInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
