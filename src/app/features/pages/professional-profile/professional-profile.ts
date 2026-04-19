import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#0a0a0c] selection:bg-yellow-500/30">
      
      <!-- IMMERSIVE COVER SECTION -->
      <section class="relative h-auto min-h-[50vh] md:h-[55vh] overflow-hidden pt-20 md:pt-0">
        <!-- Abstract Background -->
        <div class="absolute inset-0 z-0">
          <img *ngIf="avatarUrl" [src]="avatarUrl" class="w-full h-full object-cover blur-3xl opacity-20 scale-125 transition-transform duration-700" alt="Background Blur">
          <div *ngIf="!avatarUrl" class="w-full h-full bg-gradient-to-br from-yellow-500/10 to-slate-900"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent"></div>
        </div>

        <div class="container mx-auto px-6 pt-6 pb-10 md:h-full flex flex-col justify-end relative z-10">
          <!-- Mobile: Avatar centré en haut, infos en dessus -->
          <div class="flex flex-col items-center md:flex-row md:items-end gap-6 md:gap-8">
            <!-- Avatar Frame -->
            <div class="relative group shrink-0">
              <div class="absolute inset-0 bg-yellow-500 rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
              <div class="relative w-28 h-28 md:w-44 md:h-44 rounded-full border-4 border-[#0a0a0c] bg-slate-900 overflow-hidden shadow-2xl">
                <img *ngIf="avatarUrl" [src]="avatarUrl" alt="{{ pro?.name }}" class="w-full h-full object-cover">
                <div *ngIf="!avatarUrl" class="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-400 to-yellow-600 text-black text-3xl md:text-4xl font-black">
                  {{ initials }}
                </div>
              </div>
              <div class="absolute -bottom-2 -right-2 p-2.5 bg-[#0a0a0c] rounded-full border border-white/10 shadow-xl">
                 <div class="w-3.5 h-3.5 md:w-4 md:h-4 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                      [ngClass]="{
                        'bg-emerald-500': pro?.availabilityStatus === 'available',
                        'bg-amber-500': pro?.availabilityStatus === 'busy',
                        'bg-rose-500': pro?.availabilityStatus === 'temporarily_unavailable'
                      }"></div>
              </div>
            </div>

            <!-- Profile Meta -->
            <div class="flex-1 text-center md:text-left space-y-3 md:space-y-4">
              <!-- Badges -->
              <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 md:gap-3">
                <span class="px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-black uppercase tracking-widest">
                  Profil Certifié
                </span>
                <div class="flex items-center gap-1.5 bg-white/5 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <svg class="w-3.5 h-3.5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                  <span class="text-xs font-black text-white">{{ (pro?.rating ?? 0) | number:'1.1-1' }}</span>
                </div>
                <!-- Mobile Actions Inline -->
                <div class="flex lg:hidden items-center gap-2">
                  <button (click)="toggleFavorite()" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                    <svg class="w-4 h-4" [class.fill-current]="isFavorite()" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                  </button>
                  <button (click)="shareProfile()" class="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                  </button>
                </div>
              </div>
              
              <!-- Name -->
              <h1 class="text-3xl md:text-6xl font-black text-white tracking-tighter leading-tight">{{ pro?.name }}</h1>
              
              <!-- Trade & Location -->
              <div class="flex flex-col sm:flex-row items-center md:items-start gap-2 md:gap-4 text-slate-400 font-bold uppercase text-xs tracking-widest">
                <span class="flex items-center gap-2 text-yellow-500">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  {{ tradeLabel }}
                </span>
                <span class="hidden sm:block w-1 h-1 rounded-full bg-slate-600"></span>
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                  {{ pro?.ville }} <span *ngIf="pro?.quartier">· {{ pro?.quartier }}</span>
                </span>
              </div>
            </div>

            <!-- Top Actions (Desktop only) -->
            <div class="hidden lg:flex items-center gap-3">
               <button (click)="toggleFavorite()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-red-500 transition-all group active:scale-90 shadow-xl shadow-black/40">
                 <svg class="w-6 h-6" [class.fill-current]="isFavorite()" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
               </button>
               <button (click)="shareProfile()" class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-yellow-500 hover:text-black transition-all active:scale-90 shadow-xl shadow-black/40">
                 <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
               </button>
            </div>
          </div>
        </div>
      </section>

      <!-- MAIN CONTENT GRID -->
      <main class="container mx-auto px-6 py-12">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          <!-- LEFT: Details -->
          <div class="lg:col-span-2 space-y-12 animate-fade-in-up">
            
            <!-- About Card -->
            <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/5 rounded-[3rem] p-8 md:p-12">
              <div class="flex items-center gap-4 mb-8">
                <div class="w-1.5 h-10 bg-yellow-500 rounded-full"></div>
                <h3 class="text-2xl font-black text-white tracking-widest uppercase italic">L'Excellence du Service</h3>
              </div>
              <div class="prose prose-invert max-w-none">
                <p class="text-slate-400 text-lg leading-relaxed font-medium">
                  {{ pro?.description || "Ce professionnel n'a pas encore complété sa présentation détaillée. Cependant, ses qualifications ont été vérifiées par notre équipe." }}
                </p>
              </div>

              <!-- Tags / Skills Placeholder -->
              <div class="mt-12 flex flex-wrap gap-3">
                <span class="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">Professionnalisme</span>
                <span class="px-4 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-[10px] font-black uppercase tracking-widest text-yellow-500">Vérifié</span>
                <span class="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[9px] font-bold text-slate-500">{{ getExperienceLabel(pro?.experienceRange ?? '') }}</span>
              </div>
            </div>

            <!-- Photos Grid -->
            @if (pro?.images?.length) {
              <div class="space-y-8">
                <div class="flex items-center justify-between px-4">
                  <h3 class="text-lg font-black text-white uppercase tracking-widest">Galerie de Réalisations</h3>
                  <div class="h-px flex-1 mx-8 bg-white/5"></div>
                </div>
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  @for (img of pro?.images; track img.url) {
                    <div (click)="viewImage(img.url)" class="aspect-square rounded-[2rem] overflow-hidden group cursor-pointer border border-white/10 relative">
                       <img [src]="img.url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Portfolio Image">
                       <div class="absolute inset-0 bg-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Ratings Section -->
            <div class="bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 overflow-hidden relative">
              <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-[80px]"></div>
              
              <div class="flex flex-col md:flex-row gap-12 relative z-10">
                <div class="flex flex-col items-center justify-center p-8 bg-black/40 border border-white/5 rounded-[2.5rem] min-w-[200px]">
                   <span class="text-6xl font-black text-white tracking-tighter mb-2">{{ (pro?.rating ?? 0) | number:'1.1-1' }}</span>
                   <div class="flex text-yellow-500 mb-4">
                     <svg *ngFor="let s of stars" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                   </div>
                   <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{{ pro?.ratingCount || 0 }} AVIS COLLECTÉS</span>
                </div>

                <div class="flex-1 space-y-8">
                  <h3 class="text-xl font-black text-white uppercase tracking-widest">Partager votre Expérience</h3>
                  <p class="text-slate-400 font-medium">Contribuez à la communauté en notant ce partenaire selon la qualité du travail et le professionnalisme.</p>
                  
                  <div class="flex items-center gap-2">
                    <button *ngFor="let s of stars; let i = index" 
                      (click)="rate(i+1)" 
                      class="w-12 h-12 flex items-center justify-center rounded-2xl border transition-all active:scale-90"
                      [class]="(i+1) <= myRating ? 'bg-yellow-500 border-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-white/5 border-white/10 text-slate-500 hover:text-yellow-500 hover:border-yellow-500/40'">
                      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                    </button>
                    @if (ratingLoading) {
                      <div class="ml-4 w-6 h-6 border-2 border-white/10 border-t-yellow-500 rounded-full animate-spin"></div>
                    }
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- RIGHT: Sticky Contact Card -->
          <div class="lg:col-span-1">
            <div class="sticky top-32 space-y-8 animate-fade-in-up delay-100">
              
              <!-- CONTACT CARD -->
              <div class="bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 shadow-2xl relative overflow-hidden group">
                 <div class="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 
                 <h3 class="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-8">Informations de Contact</h3>

                 <div class="space-y-6 mb-12">
                   <!-- Availability Info -->
                   <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                       <svg class="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                     </div>
                     <div>
                       <span class="block text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Disponibilité</span>
                       <span class="text-white font-bold">{{ pro?.hoursAvailable || "Consultation sur RDV" }}</span>
                       <div class="mt-2 flex flex-wrap gap-1">
                         <span *ngFor="let day of pro?.daysAvailable" class="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-bold rounded-lg border border-yellow-500/20 uppercase tracking-tighter">{{ day }}</span>
                       </div>
                     </div>
                   </div>

                   <!-- Preferred Reach -->
                   <div class="flex items-start gap-4">
                     <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-500">
                       <svg class="w-5 h-5 font-bold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                     </div>
                     <div>
                       <span class="block text-[10px] font-black text-slate-600 uppercase tracking-widest leading-none mb-2">Canal Préféré</span>
                       <span class="text-white font-bold">{{ preferredContactLabel(pro?.preferredContact) }}</span>
                     </div>
                   </div>
                 </div>

                 <!-- BUTTONS -->
                 <div class="space-y-3">
                   <button *ngIf="canCall()" (click)="call()" 
                           class="w-full py-5 bg-yellow-500 text-black text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-yellow-400 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-yellow-500/10">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                      Appeler Maintenant
                   </button>
                   <button *ngIf="canWhatsapp()" (click)="whatsapp()" 
                           class="w-full py-5 bg-emerald-500 text-white text-sm font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-400 hover:scale-[1.02] flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl shadow-emerald-500/10">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.548 4.125 1.514 5.865L.212 23.505a.5.5 0 00.787.42l4.787-3.144A11.926 11.926 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/></svg>
                      Contacter sur WhatsApp
                   </button>
                 </div>

                 <!-- Login Lock Overlay -->
                 @if (!auth.isAuthenticated()) {
                   <div class="mt-8 p-6 rounded-2xl bg-black/60 border border-white/5 backdrop-blur-sm">
                      <p class="text-xs font-bold text-slate-400 mb-4 leading-relaxed">Veuillez vous authentifier pour accéder aux cordonnées complètes et à la messagerie.</p>
                      <a routerLink="/login" class="block w-full text-center py-3 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors">Se Connecter</a>
                   </div>
                 }
              </div>

              <!-- Report & Security -->
              <div class="px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
                 <button (click)="openReport()" class="text-[10px] font-black text-slate-600 uppercase tracking-widest hover:text-red-500 transition-colors">Signaler un abus</button>
                 <div class="flex items-center gap-2">
                   <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                   <span class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Paiement Sécurisé Main à Main</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- REPORT MODAL (Premium Overlay) -->
      <div *ngIf="reportOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fade-in">
        <div class="w-full max-w-xl bg-[#0a0a0c] border border-white/10 rounded-[3rem] p-10 shadow-2xl animate-slide-up relative overflow-hidden">
          <div class="absolute -top-20 -left-20 w-40 h-40 bg-red-500/10 rounded-full blur-[80px]"></div>
          
          <div class="flex items-center justify-between mb-10 relative z-10">
            <h3 class="text-3xl font-black text-white tracking-tighter italic">Signalement</h3>
            <button (click)="closeReport()" class="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>

          <div class="space-y-6 relative z-10">
            <p class="text-slate-400 font-medium text-sm leading-relaxed">Aidez-nous à maintenir l'excellence sur La STREET. Si ce profil ne respecte pas nos standards, veuillez spécifier le motif.</p>
            
            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Motif d'alerte</label>
              <select [(ngModel)]="reportReason" class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-red-500/50 appearance-none">
                <option value="FAUX_PROFIL">Profil Non Authentique</option>
                <option value="ARNAQUE">Tentative d'Arnaque</option>
                <option value="COMPORTEMENT_DEPLACE">Comportement Incivique</option>
                <option value="AUTRE">Autre Raison</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2">Description</label>
              <textarea [(ngModel)]="reportMessage" rows="3" placeholder="Veuillez détailler..." class="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white font-bold focus:ring-2 focus:ring-red-500/50 resize-none"></textarea>
            </div>

            <div class="flex gap-4 pt-4">
              <button (click)="closeReport()" class="flex-1 py-4 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-white/10">Annuler</button>
              <button (click)="submitReport()" [disabled]="reportLoading" class="flex-[2] py-4 bg-red-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl hover:bg-red-400 shadow-xl shadow-red-500/10">
                {{ reportLoading ? 'Traitement...' : 'Soumettre le Dossier' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- IMAGE VIEWER (Premium) -->
      <div *ngIf="viewingImage" (click)="viewingImage = ''" class="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-fade-in group">
        <button class="absolute top-10 right-10 text-white/50 hover:text-white transition-colors group-hover:scale-110">
          <svg class="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        <img [src]="viewingImage" (click)="$event.stopPropagation()" class="max-w-full max-h-[85vh] object-contain rounded-[3rem] shadow-2xl border border-white/10" alt="Full Preview">
        <span class="mt-8 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Aperçu Haute Définition</span>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.4s ease-out both; }
    .animate-fade-in-up { animation: fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) both; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideUp { from { transform: translateY(100px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
    ::-webkit-scrollbar-thumb:hover { background: rgba(234,179,8,0.5); }
  `]
})
export class ProProfilePage implements OnInit {
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
    const trades = this.pro?.tradeIds || [];
    if (Array.isArray(trades) && trades.length > 0) {
      return trades.map(t => typeof t === 'object' ? t.name : t).join(' · ');
    }
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
      this.toast.info('Veuillez vous connecter pour voir le numéro et appeler');
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
      this.toast.info('Veuillez vous connecter pour contacter ce professionnel via WhatsApp');
      return;
    }

    const tel = this.pro?.telephone || '';
    if (!tel) {
      this.toast.warning('Numéro de téléphone non disponible');
      return;
    }
    
    const user = this.auth.user() as any;
    const userName = user?.name || 'Un client';
    const userCity = user?.ville || '';
    
    const clean = tel.replace(/\s+/g, '').replace(/^\+/, '');
    
    let messageText = `Bonjour ${this.pro?.name},\n\n`;
    messageText += `Je suis *${userName}* ${userCity ? 'de ' + userCity : ''}, et j'ai trouvé votre profil sur *La STREET*.\n\n`;
    messageText += `Je souhaiterais vous contacter concernant vos services de *${this.tradeLabel}*.\n\n`;
    messageText += `Seriez-vous disponible pour en discuter ?\n\n`;
    messageText += `_Envoyé via La STREET · Talents du Congo_`;

    const message = encodeURIComponent(messageText);
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
