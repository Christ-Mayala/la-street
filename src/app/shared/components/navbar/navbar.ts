import { Component, inject, signal, computed, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { filter, Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="relative">
      <header class="sticky top-0 z-[100] w-full transition-all duration-300" 
              [class.bg-black/80]="!menuOpen()" 
              [class.backdrop-blur-xl]="true"
              [class.border-b]="true"
              [class.border-white/5]="true">
        <div class="container mx-auto px-4 h-16 flex items-center justify-between">
          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-2 group">
            <div class="relative w-9 h-9 flex items-center justify-center">
              <img src="/logo.jpg" alt="La STREET" class="w-full h-full rounded-xl object-cover ring-2 ring-yellow-500/20 group-hover:ring-yellow-500/50 transition-all duration-500">
              <div class="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div class="flex flex-col -gap-1">
              <span class="text-lg font-black tracking-tighter text-white leading-none">LA STREET</span>
              <span class="text-[10px] font-bold text-yellow-500 tracking-[0.2em] leading-none opacity-80 uppercase">Professionnels</span>
            </div>
          </a>

          <!-- Desktop Navigation -->
          <nav class="hidden md:flex items-center gap-1">
            <a *ngFor="let link of mainLinks()" 
               [routerLink]="link.path" 
               routerLinkActive="!text-white bg-white/5"
               [routerLinkActiveOptions]="{exact: link.path === '/'}"
               class="px-4 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 relative group">
              {{ link.label }}
              <span class="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            </a>
          </nav>

          <!-- Right Side: Actions & User -->
          <div class="flex items-center gap-2">
            <!-- Desktop: Favorites -->
            <button [routerLink]="['/favorites']" class="relative p-2 text-slate-400 hover:text-white transition-colors group hidden sm:block">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
              <span *ngIf="favCount > 0" class="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black ring-2 ring-black">
                {{ favCount }}
              </span>
            </button>

            <!-- Divider -->
            <div class="hidden sm:block w-px h-6 bg-white/10 mx-2"></div>

            <!-- Auth Section -->
            <ng-container *ngIf="auth.user() as u; else guestActions">
              <!-- User Control (Desktop) -->
              <div class="relative hidden md:block">
                <button (click)="userMenuOpen.set(!userMenuOpen())" 
                        class="flex items-center gap-3 p-1.5 pl-3 rounded-full bg-white/5 border border-white/10 hover:border-yellow-500/30 transition-all">
                  <div class="flex flex-col items-end">
                    <span class="text-xs font-bold text-white leading-none whitespace-nowrap">{{ u.name }}</span>
                    <span *ngIf="u.isPremium" class="text-[10px] text-yellow-500 font-bold uppercase leading-none mt-1 inline-flex items-center gap-0.5">Premium <svg class="w-2.5 h-2.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.563-.954L10 0l2.949 5.956 6.563.954-4.756 4.635 1.122 6.545z"/></svg></span>
                  </div>
                  <div class="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-white/20">
                    <img *ngIf="u.avatarUrl" [src]="u.avatarUrl" alt="" class="w-full h-full object-cover">
                    <div *ngIf="!u.avatarUrl" class="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400">{{ getUserInitials(u.name) }}</div>
                  </div>
                </button>

                <!-- Dropdown Menu -->
                <div *ngIf="userMenuOpen()" 
                     class="absolute right-0 mt-3 w-56 rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                  <div class="px-4 py-2 border-b border-white/5 mb-2">
                    <p class="text-xs text-slate-500">Connecté en tant que</p>
                    <p class="text-sm font-bold text-white truncate">{{ u.email }}</p>
                  </div>
                  <a *ngIf="isAdmin(u)" routerLink="/admin" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                    Dashboard Admin
                  </a>
                  <a routerLink="/profile" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    Mon Profil
                  </a>
                  <div class="h-px bg-white/5 mx-2 my-1"></div>
                  <button (click)="logout()" class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Déconnexion
                  </button>
                </div>
              </div>
            </ng-container>

            <ng-template #guestActions>
              <div class="hidden md:flex items-center gap-2">
                <a [routerLink]="['/login']" class="px-5 py-2 text-sm font-bold text-white hover:text-yellow-500 transition-colors">Connexion</a>
                <a [routerLink]="['/register']" class="px-5 py-2 text-sm font-bold bg-yellow-500 text-black rounded-full hover:bg-yellow-400 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-yellow-500/20">S'inscrire</a>
              </div>
            </ng-template>

            <!-- Mobile: Hamburger Toggle -->
            <button (click)="toggleMenu($event)" 
                    class="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 rounded-xl transition-all hover:bg-white/5 active:scale-90"
                    [aria-expanded]="menuOpen()"
                    aria-label="Toggle menu">
              <span class="w-6 h-0.5 bg-white transition-all duration-300 transform origin-center" [class.rotate-45]="menuOpen()" [class.translate-y-2]="menuOpen()"></span>
              <span class="w-6 h-0.5 bg-white transition-opacity duration-300" [class.opacity-0]="menuOpen()"></span>
              <span class="w-6 h-0.5 bg-white transition-all duration-300 transform origin-center" [class.-rotate-45]="menuOpen()" [class.-translate-y-2]="menuOpen()"></span>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Menu Overlay -->
      <div *ngIf="menuOpen()" 
           (click)="$event.stopPropagation()"
           class="fixed inset-0 top-16 z-[999] md:hidden bg-black backdrop-blur-3xl flex flex-col animate-in fade-in duration-300">
        
        <!-- Mobile Menu Content -->
        <div class="flex-1 overflow-y-auto px-6 py-8 flex flex-col no-scrollbar">
          <!-- User Profile (Mobile) -->
          <div *ngIf="auth.user() as u" class="mb-8 p-6 rounded-3xl bg-yellow-400/5 border border-yellow-400/10 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-slate-900 border border-yellow-500/20 overflow-hidden flex items-center justify-center shadow-lg shadow-black/50">
              <img *ngIf="u.avatarUrl" [src]="u.avatarUrl" class="w-full h-full object-cover">
              <span *ngIf="!u.avatarUrl" class="text-xl font-black text-yellow-500">{{ getUserInitials(u.name) }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-lg font-bold text-white truncate leading-none uppercase tracking-tight">{{ u.name }}</h4>
              <p *ngIf="u.isPremium" class="text-xs text-yellow-500 font-bold mt-1.5 flex items-center gap-1">
                <svg class="w-3 h-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.563-.954L10 0l2.949 5.956 6.563.954-4.756 4.635 1.122 6.545z"/></svg> PRO PREMIUM
              </p>
              <p *ngIf="!u.isPremium" class="text-xs text-slate-500 mt-1.5 truncate">{{ u.email }}</p>
            </div>
          </div>

          <!-- Navigation Links (Mobile) -->
          <div class="flex flex-col gap-3">
            <a *ngFor="let link of mobileLinks()" 
               [routerLink]="link.path" 
               (click)="closeMenu()"
               class="group w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-yellow-400/10 hover:border-yellow-400/20 transition-all duration-300">
               <div class="flex items-center gap-4 text-slate-300 group-hover:text-white">
                 <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-yellow-500 group-hover:bg-yellow-500/10 transition-all shadow-inner" [innerHTML]="link.icon"></div>
                 <span class="font-bold text-lg tracking-tight">{{ link.label }}</span>
               </div>
               <svg class="w-5 h-5 text-slate-600 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
               </svg>
            </a>
          </div>

          <!-- Fill the rest -->
          <div class="flex-1 min-h-[4rem]"></div>

          <!-- Auth Actions (Mobile) -->
          <div class="mt-auto pt-8 border-t border-white/5 flex flex-col gap-4">
            <ng-container *ngIf="auth.user(); else mobileGuestActions">
              <button (click)="logout(); closeMenu()" 
                      class="group w-full py-4 rounded-2xl text-center font-bold text-red-400 bg-red-400/5 hover:bg-red-400/10 transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                Se déconnecter
              </button>
            </ng-container>
            <ng-template #mobileGuestActions>
              <div class="grid grid-cols-2 gap-4">
                <a [routerLink]="['/login']" (click)="closeMenu()" 
                   class="py-4 rounded-2xl text-center font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                   Connexion
                </a>
                <a [routerLink]="['/register']" (click)="closeMenu()" 
                   class="py-4 rounded-2xl text-center font-bold text-black bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/20">
                   S'inscrire
                </a>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export class NavbarComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  protected readonly menuOpen = signal(false);
  protected readonly userMenuOpen = signal(false);
  protected readonly auth = inject(AuthService);
  protected readonly favorites = inject(FavoritesService);
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  private routerSubscription!: Subscription;
  private clickListener!: () => void;

  mainLinks = computed(() => {
    const u = this.auth.user();
    if (!u) return [
      { label: 'Accueil', path: '/' },
      { label: 'Recherche', path: '/search' },
      { label: 'Missions', path: '/leads' },
      { label: 'À propos', path: '/about' }
    ];
    if (this.isAdmin(u)) return [
      { label: 'Admin', path: '/admin' },
      { label: 'Missions', path: '/leads' },
      { label: 'Postuler', path: '/leads/new' },
      { label: 'Profil', path: '/profile' }
    ];
    return [
      { label: 'Accueil', path: '/' },
      { label: 'Recherche', path: '/search' },
      { label: 'Missions', path: '/leads' },
      { label: 'Postuler', path: '/leads/new' },
      { label: 'Profil', path: '/profile' }
    ];
  });

  mobileLinks = computed(() => {
    const base = [
      { label: 'Accueil', path: '/', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>') },
      { label: 'Recherche', path: '/search', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>') },
      { label: 'Missions', path: '/leads', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>') },
      { label: 'Favoris', path: '/favorites', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>') },
    ];
    const u = this.auth.user();
    if (u) {
       base.push({ label: 'Publier', path: '/leads/new', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>') });
       base.push({ label: 'Mon Profil', path: '/profile', icon: this.trustIcon('<svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>') });
    }
    return base;
  });

  private trustIcon(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  isAdmin(u: any): boolean {
    return String(u?.role || '').toLowerCase() === 'admin';
  }

  get favCount() {
    return this.favorites.favs().length;
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.menuOpen.set(false);
      this.userMenuOpen.set(false);
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    this.removeOutsideClickListener();
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    const next = !this.menuOpen();
    this.menuOpen.set(next);
    
    if (next) {
      this.renderer.addClass(this.document.body, 'overflow-hidden');
      this.addOutsideClickListener();
    } else {
      this.renderer.removeClass(this.document.body, 'overflow-hidden');
      this.removeOutsideClickListener();
    }
  }

  closeMenu() {
    this.menuOpen.set(false);
    this.renderer.removeClass(this.document.body, 'overflow-hidden');
    this.removeOutsideClickListener();
  }

  private addOutsideClickListener() {
    setTimeout(() => {
      this.clickListener = () => {
        if (this.menuOpen()) this.closeMenu();
        if (this.userMenuOpen()) this.userMenuOpen.set(false);
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
    this.userMenuOpen.set(false);
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
