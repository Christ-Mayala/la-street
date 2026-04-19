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
    <header #header class="fixed top-0 z-[100] w-full transition-all duration-500 border-b border-transparent group"
            [class.bg-black/40]="!isScrolled() && !menuOpen()"
            [class.bg-[#0a0a0c]/80]="isScrolled() || menuOpen()"
            [class.backdrop-blur-xl]="true"
            [class.border-white/5]="isScrolled() || menuOpen()"
            [class.py-4]="!isScrolled()"
            [class.py-3]="isScrolled()">
      
      <div class="container mx-auto px-6 flex items-center justify-between relative z-10">
        <!-- Logo Section -->
        <a routerLink="/" class="flex items-center gap-3 active:scale-95 transition-transform">
          <div class="relative w-10 h-10 overflow-hidden rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-[1px]">
            <div class="w-full h-full bg-black rounded-[10px] flex items-center justify-center overflow-hidden">
               <img src="/logo.jpg" alt="La STREET" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-yellow-400/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-xl font-black tracking-tighter text-white leading-none">LA STREET</span>
            <span class="text-[9px] font-bold text-yellow-500 tracking-[0.3em] leading-none opacity-80 uppercase mt-0.5">Premium Marketplace</span>
          </div>
        </a>

        <!-- Desktop Core Nav -->
        <nav class="hidden lg:flex items-center bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-1 py-1">
          @for (link of mainLinks(); track link.path) {
            <a [routerLink]="link.path" 
               routerLinkActive="bg-white/10 text-white !opacity-100 shadow-sm"
               [routerLinkActiveOptions]="{exact: link.path === '/'}"
               class="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-slate-400 opacity-70 hover:opacity-100 hover:text-white transition-all duration-300">
              {{ link.label }}
            </a>
          }
        </nav>

        <!-- Rights/Actions -->
        <div class="flex items-center gap-4">
          <!-- Favorites -->
          <button [routerLink]="['/favorites']" class="relative p-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/5 transition-all group hidden sm:flex">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            @if (favCount > 0) {
              <span class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-black text-black ring-2 ring-[#0a0a0c]">
                {{ favCount }}
              </span>
            }
          </button>

           <!-- User Menu -->
           @if (auth.user(); as u) {
             <div class="relative hidden sm:block">
               <button (click)="userMenuOpen.set(!userMenuOpen())" 
                       class="flex items-center gap-3 pl-3 pr-1.5 py-1.5 rounded-xl bg-white/5 border border-white/10 hover:border-yellow-500/50 hover:bg-white/10 transition-all">
                 <span class="text-xs font-bold text-white hidden md:block">{{ u.name }}</span>
                 <div class="w-8 h-8 rounded-lg overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center">
                   @if (u.avatarUrl) {
                     <img [src]="u.avatarUrl" class="w-full h-full object-cover">
                   } @else {
                     <span class="text-xs font-black text-yellow-500">{{ getUserInitials(u.name) }}</span>
                   }
                 </div>
               </button>
 
               <!-- Dropdown -->
               @if (userMenuOpen()) {
                 <div class="absolute right-0 mt-3 w-64 rounded-2xl bg-[#0a0a0c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden py-3 animate-fade-in-up">
                   <div class="px-5 py-3 mb-2 border-b border-white/5">
                     <p class="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Utilisateur</p>
                     <p class="text-sm font-bold text-white truncate mt-0.5">{{ u.email }}</p>
                   </div>
                   @if (isAdmin(u)) {
                     <a routerLink="/admin" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                       <span class="p-2 rounded-lg bg-yellow-500/10 text-yellow-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg></span>
                       Administration
                     </a>
                   }
                   <a routerLink="/profile" (click)="userMenuOpen.set(false)" class="flex items-center gap-3 px-5 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-all">
                     <span class="p-2 rounded-lg bg-white/5 text-slate-400 transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg></span>
                     Mon Espace
                   </a>
                   <div class="mx-5 my-2 border-t border-white/5"></div>
                   <button (click)="logout()" class="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-all font-medium">
                     <span class="p-2 rounded-lg bg-red-500/5 text-red-500"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013-3v1"></path></svg></span>
                     Déconnexion
                   </button>
                 </div>
               }
             </div>
           } @else {
             <div class="hidden sm:flex items-center gap-2">
               <a routerLink="/login" class="px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white/70 hover:text-white transition-colors">Login</a>
               <a routerLink="/register" class="px-6 py-2.5 text-xs font-black uppercase tracking-widest bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-95 transition-all">Rejoindre</a>
             </div>
           }
 
           <!-- Mobile Toggle -->
           <button (click)="toggleMenu($event)" 
                   class="lg:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 rounded-xl bg-white/5 border border-white/10 active:scale-90 transition-all"
                   aria-label="Menu">
             <span class="w-5 h-[2px] bg-white transition-all" [class.rotate-45]="menuOpen()" [class.translate-y-[8px]]="menuOpen()"></span>
             <span class="w-5 h-[2px] bg-white transition-all" [class.opacity-0]="menuOpen()"></span>
             <span class="w-5 h-[2px] bg-white transition-all" [class.-rotate-45]="menuOpen()" [class.-translate-y-[8px]]="menuOpen()"></span>
           </button>
         </div>
       </div>
 
      </header>

      <!-- Mobile Overlay (outside header to avoid stacking context issues) -->
      @if (menuOpen()) {
        <div class="fixed inset-0 z-[99] bg-[#0a0a0c] lg:hidden flex flex-col overflow-hidden" style="padding-top: 72px;">
          <!-- Ambient glow -->
          <div class="absolute top-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-[120px] pointer-events-none"></div>
          <div class="absolute bottom-0 right-0 w-64 h-64 bg-yellow-900/5 rounded-full blur-[120px] pointer-events-none"></div>

          <div class="flex flex-col flex-1 px-5 pt-6 overflow-y-auto no-scrollbar relative z-10">
            <!-- Nav Links -->
            <div class="flex flex-col gap-2.5">
              @for (link of mobileLinks(); track link.path) {
                <a [routerLink]="link.path"
                   (click)="closeMenu()"
                   class="group flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-yellow-400/10 hover:border-yellow-400/20 transition-all active:scale-[0.98]">
                   <div class="flex items-center gap-4">
                     <div class="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-yellow-500 group-hover:bg-yellow-500/10 transition-all" [innerHTML]="link.icon"></div>
                     <span class="font-black text-xl tracking-tighter text-white">{{ link.label }}</span>
                   </div>
                   <div class="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 group-hover:bg-yellow-400/20 group-hover:text-yellow-500 transition-all">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/></svg>
                   </div>
                </a>
              }
            </div>

            <!-- Bottom Auth Actions -->
            <div class="mt-auto grid grid-cols-2 gap-3 pt-8 pb-8 border-t border-white/5 mt-6">
               @if (auth.user(); as u) {
                 <!-- Logged in user -->
                 <div class="col-span-2 flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-2">
                   <div class="w-10 h-10 rounded-xl overflow-hidden bg-slate-900 border border-white/10 flex items-center justify-center shrink-0">
                     @if (u.avatarUrl) {
                       <img [src]="u.avatarUrl" class="w-full h-full object-cover">
                     } @else {
                       <span class="text-xs font-black text-yellow-500">{{ getUserInitials(u.name) }}</span>
                     }
                   </div>
                   <div class="min-w-0">
                     <p class="text-sm font-black text-white truncate">{{ u.name }}</p>
                     <p class="text-[10px] text-slate-500 truncate">{{ u.email }}</p>
                   </div>
                 </div>
                 <a routerLink="/profile" (click)="closeMenu()" class="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-center font-black uppercase tracking-widest text-[9px] transition-all active:scale-95">Mon Espace</a>
                 <button (click)="logout(); closeMenu()" class="py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase tracking-widest text-[9px] transition-all active:scale-95">Déconnexion</button>
               } @else {
                 <a routerLink="/login" (click)="closeMenu()" class="py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-center font-black uppercase tracking-widest text-[9px] transition-all active:scale-95">Login</a>
                 <a routerLink="/register" (click)="closeMenu()" class="py-4 rounded-2xl bg-yellow-500 text-black text-center font-black uppercase tracking-widest text-[9px] transition-all shadow-lg shadow-yellow-500/20 active:scale-95">S'inscrire</a>
               }
            </div>
          </div>
        </div>
      }
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
  protected readonly isScrolled = signal(false);
  private readonly document = inject(DOCUMENT);
  private readonly sanitizer = inject(DomSanitizer);

  private routerSubscription!: Subscription;
  private clickListener!: () => void;
  private scrollListener!: () => void;

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

    if (typeof window !== 'undefined') {
      this.scrollListener = () => {
        this.isScrolled.set(window.scrollY > 20);
      };
      window.addEventListener('scroll', this.scrollListener, { passive: true });
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.scrollListener && typeof window !== 'undefined') {
      window.removeEventListener('scroll', this.scrollListener);
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
