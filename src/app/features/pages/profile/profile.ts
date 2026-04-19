import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { Professional } from '../../../core/models/professional.model';

type Availability = 'available' | 'busy' | 'temporarily_unavailable';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30">
      <!-- Ambient Background -->
      <div class="fixed inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <!-- Header Section -->
      <section class="relative pt-32 pb-12 overflow-hidden">
        <div class="container relative z-10 px-4">
          <div class="max-w-5xl mx-auto">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
              <div class="space-y-4">
                <nav class="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-yellow-500/60 mb-2">
                  <a routerLink="/" class="hover:text-yellow-400 transition-colors">La STREET</a>
                  <span class="w-1 h-1 rounded-full bg-slate-800"></span>
                  <span class="text-slate-500">Tableau de bord</span>
                </nav>
                
                <h1 class="text-4xl md:text-5xl font-black text-white tracking-tight">
                  Mon <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Espace</span>
                </h1>
                <p class="text-lg text-slate-400 max-w-xl leading-relaxed">
                  Gérez vos informations, votre abonnement et votre visibilité sur la plateforme.
                </p>
              </div>

              <div class="flex items-center gap-4">
                @if (auth.user()?.role === 'admin') {
                  <a routerLink="/admin" class="group flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all duration-300">
                    <div class="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div class="text-left">
                      <div class="text-xs font-bold text-slate-500 uppercase tracking-wider">Administration</div>
                      <div class="text-sm font-bold text-white">Dashboard Admin</div>
                    </div>
                  </a>
                }
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <main class="container relative z-10 px-4 pb-24">
        <div class="max-w-5xl mx-auto">
          
          <!-- Not Logged In State -->
          @if (!auth.user()) {
            <div class="flex flex-col items-center justify-center min-h-[400px] border border-white/5 bg-white/[0.02] backdrop-blur-xl rounded-[40px] p-12 text-center animate-fade-in">
              <div class="w-24 h-24 rounded-full bg-yellow-400/10 flex items-center justify-center mb-8 ring-8 ring-yellow-400/5 transition-all animate-pulse">
                <svg class="w-10 h-10 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h2 class="text-3xl font-black text-white mb-4 tracking-tight">Accès Restreint</h2>
              <p class="text-slate-400 mb-10 max-w-sm mx-auto text-lg">Connectez-vous à votre compte pour accéder à vos informations personnelles et réglages.</p>
              <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <a routerLink="/login" class="flex-1 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all duration-300 transform hover:-translate-y-1 text-center">
                  Se connecter
                </a>
                <a routerLink="/register" class="flex-1 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all duration-300 text-center">
                  Créer un compte
                </a>
              </div>
            </div>
          }

          <!-- Logged In Content -->
          @if (auth.user(); as u) {
            <div class="space-y-8 animate-fade-in">
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <!-- Account Info Card - Left (Col 1-7) -->
                <div class="lg:col-span-12 xl:col-span-7 space-y-8">
                  <div class="glass-card rounded-[40px] p-8 md:p-10 border border-white/5 relative overflow-hidden">
                    <div class="flex items-center gap-4 mb-10">
                      <div class="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
                        <svg class="w-7 h-7 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <h2 class="text-2xl font-black text-white tracking-tight">Informations du compte</h2>
                        <p class="text-slate-500 text-sm font-medium">Détails personnels et avatar</p>
                      </div>
                    </div>

                    <!-- Profile Photo -->
                    <div class="flex flex-col sm:flex-row items-center gap-8 mb-10 p-6 rounded-[32px] bg-white/[0.03] border border-white/5">
                      <div class="relative group">
                        <div class="h-32 w-32 rounded-full overflow-hidden border-4 border-yellow-400/20 bg-black flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                          @if (accountPhotoUrl) {
                            <img [src]="accountPhotoUrl" alt="" class="h-full w-full object-cover" loading="lazy" decoding="async" />
                          } @else {
                            <span class="text-4xl text-yellow-500 font-black">{{ u.name.slice(0, 1) }}</span>
                          }
                        </div>
                        <label class="absolute -bottom-2 -right-2 p-3 bg-yellow-500 text-black rounded-2xl cursor-pointer hover:bg-yellow-400 transition-all shadow-xl shadow-yellow-500/20">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                          </svg>
                          <input type="file" accept="image/*" class="hidden" (change)="u.role === 'professional' ? onProImageChange($event) : onAvatarChange($event)" />
                        </label>
                      </div>
                      <div class="flex-1 text-center sm:text-left space-y-2">
                          <div class="text-xl font-bold text-white">Photo de profil</div>
                          <p class="text-slate-400 text-sm leading-relaxed">Format recommandé : JPG ou PNG. <br> Taille maximale : 10 Mo.</p>
                          @if (accountPhotoError) {
                            <div class="text-sm text-red-400 font-bold bg-red-400/10 px-3 py-1 rounded-lg inline-block mt-2">{{ accountPhotoError }}</div>
                          }
                      </div>
                    </div>

                    <!-- Form Fields -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                      <div class="space-y-3">
                        <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Nom Complet</label>
                        <div class="relative group">
                           <input
                              [(ngModel)]="name"
                              name="name"
                              class="w-full h-14 pl-6 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all group-hover:bg-white/[0.05]"
                              placeholder="Votre nom"
                            />
                        </div>
                      </div>

                      <div class="space-y-3">
                        <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Téléphone</label>
                        <div class="relative group">
                           <input
                              [(ngModel)]="telephone"
                              name="telephone"
                              class="w-full h-14 pl-6 pr-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 focus:border-yellow-400/30 transition-all group-hover:bg-white/[0.05]"
                              placeholder="+242 06 123 45 67"
                            />
                        </div>
                      </div>

                      <div class="space-y-3 md:col-span-2">
                        <label class="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Adresse Email</label>
                        <div class="relative opacity-60">
                           <input
                              [value]="u.email"
                              disabled
                              class="w-full h-14 pl-6 pr-6 bg-black/40 border border-white/5 rounded-2xl text-slate-400 font-bold cursor-not-allowed"
                            />
                           <div class="absolute right-6 top-1/2 -translate-y-1/2">
                             <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                             </svg>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-white/5">
                      <div class="flex items-center gap-3">
                        <div class="text-xs font-black uppercase tracking-widest text-slate-500">Rôle :</div>
                        <span class="px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider" [ngClass]="{
                          'bg-yellow-400/10 text-yellow-500 border border-yellow-400/20': u.role === 'professional',
                          'bg-blue-400/10 text-blue-400 border border-blue-400/20': u.role === 'user',
                          'bg-purple-400/10 text-purple-400 border border-purple-400/20': u.role === 'admin'
                        }">
                          {{ getRoleLabel(u.role) }}
                        </span>
                      </div>

                      <button
                        (click)="saveAccount()"
                        [disabled]="savingAccount()"
                        class="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-black rounded-2xl transition-all duration-300 transform active:scale-95 shadow-xl shadow-yellow-500/10"
                      >
                        @if (savingAccount()) {
                          <div class="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                        }
                        {{ savingAccount() ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                      </button>
                    </div>
                  </div>
                </div>

                <!-- Right Column - Subscription Display -->
                <div class="lg:col-span-12 xl:col-span-5 space-y-8">
                  <!-- Premium Card -->
                  @if (u.isPremium) {
                    <div class="glass-card rounded-[40px] p-8 md:p-10 border border-yellow-500/20 relative overflow-hidden group">
                      <div class="absolute top-0 right-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-yellow-400/20 transition-all duration-700"></div>
                      
                      <div class="relative z-10">
                        <div class="flex items-center gap-4 mb-10">
                          <div class="w-16 h-16 rounded-[24px] bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl shadow-yellow-500/40">
                            <svg class="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          </div>
                          <div>
                            <h3 class="text-2xl font-black text-white tracking-tight">Premium Club</h3>
                            <p class="text-yellow-500 text-xs font-black uppercase tracking-[0.2em]">{{ u.premiumPlan || 'Standard' }}</p>
                          </div>
                        </div>

                        <div class="space-y-8">
                          <div class="flex items-end justify-between">
                            <div class="space-y-1">
                              <div class="text-xs font-black uppercase tracking-widest text-slate-500">Jours Restants</div>
                              <div class="text-5xl font-black text-white leading-none">
                                {{ remainingDays }} <span class="text-lg text-slate-500 font-bold ml-1">jours</span>
                              </div>
                            </div>
                            <div class="text-right">
                              <div class="text-xs font-black uppercase tracking-widest text-slate-500 mb-1">Status</div>
                              <div class="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest">
                                <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                Actif
                              </div>
                            </div>
                          </div>

                          <div class="space-y-3">
                             <div class="flex justify-between text-xs font-bold uppercase tracking-widest">
                               <span class="text-slate-500">Progression</span>
                               <span class="text-yellow-500">{{ (remainingDays / 30 * 100).toFixed(0) }}%</span>
                             </div>
                             <div class="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[2px]">
                                <div class="h-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(234,179,8,0.3)]" 
                                     [style.width.%]="(remainingDays / 30) * 100"></div>
                             </div>
                             <div class="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-600">
                               <span>Abonnement en cours</span>
                               <span>Expire le {{ u.premiumUntil | date:'d MMM yyyy' }}</span>
                             </div>
                          </div>

                          <a routerLink="/pricing" 
                             class="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all duration-300 group/btn">
                            <span>Gérer l'abonnement</span>
                            <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  } @else {
                    <!-- Free Account Display / Upgrade CTA -->
                    <div class="glass-card rounded-[40px] p-8 border border-white/5 relative overflow-hidden">
                      <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent"></div>
                      <div class="relative z-10 text-center space-y-6">
                        <div class="w-20 h-20 mx-auto rounded-[32px] bg-white/[0.03] border border-white/5 flex items-center justify-center">
                           <svg class="w-10 h-10 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                           </svg>
                        </div>
                        <div>
                          <h3 class="text-xl font-black text-white mb-2 tracking-tight">Passez au Premium</h3>
                          <p class="text-slate-400 text-sm leading-relaxed">Débloquez une visibilité prioritaire, des badges exclusifs et bien plus encore.</p>
                        </div>
                        <a routerLink="/pricing" class="block w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black rounded-2xl transition-all shadow-xl shadow-yellow-500/10">
                          Découvrir les offres
                        </a>
                      </div>
                    </div>
                  }

                  <!-- Simple Tips -->
                  @if (u.role !== 'professional') {
                    <div class="glass-card rounded-[40px] p-8 border border-white/5 space-y-6">
                       <h3 class="text-sm font-black uppercase tracking-[0.2em] text-slate-500">Sécurité & Conseils</h3>
                       <div class="space-y-4">
                          <div class="flex gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                            <div class="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                              </svg>
                            </div>
                            <p class="text-sm text-slate-400 leading-relaxed"><strong class="text-white">Validation</strong> : Gardez votre numéro à jour pour recevoir des notifications importantes.</p>
                          </div>
                          <div class="flex gap-4 p-4 rounded-3xl bg-white/[0.02] border border-white/5">
                            <div class="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                              <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                              </svg>
                            </div>
                            <p class="text-sm text-slate-400 leading-relaxed"><strong class="text-white">Confidentialité</strong> : Ne partagez jamais vos codes d'accès avec des tiers.</p>
                          </div>
                       </div>
                    </div>
                  }
                </div>

                <!-- Professional Profile Settings Section -->
                @if (u.role === 'professional') {
                  <div class="lg:col-span-12 space-y-8 mt-12">
                    <div class="flex flex-col md:flex-row items-center justify-between gap-4 px-4">
                      <div class="flex items-center gap-4">
                        <div class="w-14 h-14 rounded-2xl bg-yellow-400/10 flex items-center justify-center">
                          <svg class="w-7 h-7 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                          </svg>
                        </div>
                        <div>
                          <h2 class="text-3xl font-black text-white tracking-tight">Profil Professionnel Lumineux</h2>
                          <div class="flex items-center gap-2 mt-2">
                            <div class="w-2.5 h-2.5 rounded-full animate-pulse" [ngClass]="{
                                'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]': availability === 'available',
                                'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]': availability === 'busy',
                                'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]': availability === 'temporarily_unavailable'
                              }"></div>
                            <span class="text-xs font-black uppercase tracking-widest" [ngClass]="{
                                'text-emerald-400': availability === 'available',
                                'text-amber-400': availability === 'busy',
                                'text-rose-400': availability === 'temporarily_unavailable'
                              }">
                              {{ availabilityLabel(availability) }}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button (click)="reloadProfessional()" [disabled]="loadingPro()" class="group p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all duration-300 disabled:opacity-40">
                        <svg class="w-6 h-6 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                        </svg>
                      </button>
                    </div>

                    <div class="glass-card rounded-[40px] p-8 md:p-12 border border-white/5 relative">
                      <!-- Error Message -->
                      @if (proError) {
                        <div class="mb-10 p-6 bg-red-400/10 border border-red-400/20 rounded-3xl animate-bounce-in">
                          <div class="flex items-start gap-4">
                            <div class="p-2 bg-red-400/20 rounded-xl">
                              <svg class="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                              </svg>
                            </div>
                            <div>
                              <h3 class="font-black text-red-400 uppercase tracking-widest text-xs mb-1">Erreur Critique</h3>
                              <p class="text-red-300/80 text-sm font-medium">{{ proError }}</p>
                            </div>
                          </div>
                        </div>
                      }

                      <!-- Loading State -->
                      @if (loadingPro()) {
                        <div class="flex flex-col items-center justify-center py-24 space-y-4">
                          <div class="relative w-16 h-16">
                             <div class="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
                             <div class="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                          </div>
                          <p class="text-xs font-black uppercase tracking-[0.3em] text-yellow-500/60 animate-pulse">Syncing data...</p>
                        </div>
                      }

                      <!-- Professional Form -->
                      @if (!loadingPro() && professional(); as p) {
                        <div class="animate-fade-in space-y-12">
                          <!-- Identity & Image Grid -->
                          <div class="grid grid-cols-1 md:grid-cols-12 gap-12">
                            <!-- Public Photo -->
                            <div class="md:col-span-4 lg:col-span-3 space-y-4">
                               <label class="text-xs font-black uppercase tracking-widest text-slate-500">Photo Public</label>
                               <div class="relative group aspect-square">
                                  <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-[40px] blur-2xl group-hover:blur-3xl transition-all duration-700"></div>
                                  <div class="relative h-full w-full rounded-[40px] overflow-hidden border-2 border-white/10 bg-black shadow-2xl">
                                     @if (proImagePreview || p.profileImage?.url) {
                                       <img [src]="proImagePreview || p.profileImage?.url" alt="" class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                     } @else {
                                       <div class="h-full w-full flex items-center justify-center bg-white/[0.02]">
                                          <span class="text-7xl font-black text-white/10 uppercase">{{ (p.name || '').slice(0, 1) }}</span>
                                       </div>
                                     }
                                     
                                     <!-- Change Button Hover -->
                                     <label class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                        <div class="w-12 h-12 rounded-2xl bg-yellow-500 text-black flex items-center justify-center transform scale-50 group-hover:scale-100 transition-all duration-500">
                                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                                          </svg>
                                        </div>
                                        <span class="text-[10px] font-black uppercase tracking-[0.2em] text-white">Changer la photo</span>
                                        <input type="file" accept="image/*" class="hidden" (change)="onProImageChange($event)" />
                                     </label>
                                  </div>
                                  @if (proImageError) {
                                    <div class="mt-4 p-3 bg-red-400/10 border border-red-400/20 rounded-2xl text-[10px] font-bold text-red-400 text-center uppercase tracking-widest">{{ proImageError }}</div>
                                  }
                               </div>
                            </div>

                            <!-- Basic Info -->
                            <div class="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-8 content-start">
                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Nom Commercial / Public</label>
                                <input [(ngModel)]="proName" [ngModelOptions]="{standalone: true}" class="w-full h-16 px-6 bg-white/[0.03] border border-white/5 rounded-[24px] text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:bg-white/[0.05] transition-all" placeholder="Nom affiché au public" />
                              </div>

                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Téléphone Public</label>
                                <input [(ngModel)]="proTelephone" [ngModelOptions]="{standalone: true}" class="w-full h-16 px-6 bg-white/[0.03] border border-white/5 rounded-[24px] text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 focus:bg-white/[0.05] transition-all" placeholder="+242 06 XXX XX XX" />
                              </div>

                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Catégorie</label>
                                <div class="relative group">
                                  <select [(ngModel)]="selectedCategoryId" [ngModelOptions]="{standalone: true}" (change)="onCategoryChange()" class="w-full h-16 pl-6 pr-12 bg-white/[0.03] border border-white/5 rounded-[24px] text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all select-custom group-hover:bg-white/[0.05]">
                                    <option value="" disabled class="bg-[#0a0a0c]">Sélect. Catégorie</option>
                                    @for (c of categories(); track c._id) {
                                      <option [value]="c._id" class="bg-[#0a0a0c]">{{ c.name }}</option>
                                    }
                                  </select>
                                  <svg class="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-hover:text-yellow-500 transition-colors pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                                  </svg>
                                </div>
                              </div>

                              <div class="sm:col-span-2 space-y-3" *ngIf="selectedCategoryId()">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Métiers Spécifiques (Plusieurs choix possibles)</label>
                                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                  @for (t of trades(); track t._id) {
                                    <button type="button" 
                                      (click)="toggleTrade(t._id)"
                                      [class]="selectedTradeIds.includes(t._id) ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500' : 'border-white/5 bg-white/[0.03] text-slate-500'"
                                      class="py-4 px-4 rounded-2xl border text-center font-black uppercase text-[9px] tracking-widest cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2">
                                      <div class="w-2 h-2 rounded-full" [class]="selectedTradeIds.includes(t._id) ? 'bg-yellow-500' : 'bg-slate-700'"></div>
                                      {{ t.name }}
                                    </button>
                                  }
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- Location & Experience -->
                          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-white/5">
                            <div class="md:col-span-4 lg:col-span-3">
                               <h4 class="text-lg font-black text-white mb-2">Localisation</h4>
                               <p class="text-sm text-slate-500 leading-relaxed">Précisez votre zone d'activité pour aider les clients proches de vous.</p>
                            </div>
                            
                            <div class="md:col-span-8 lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Ville</label>
                                <input [(ngModel)]="proVille" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all font-primary" placeholder="Ex: Brazzaville" />
                              </div>
                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Quartier</label>
                                <input [(ngModel)]="proQuartier" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all font-primary" placeholder="Ex: Poto-Poto" />
                              </div>
                              <div class="space-y-3">
                                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Années d'Expérience</label>
                                <select [(ngModel)]="experienceRange" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all">
                                  <option value="0-1" class="bg-[#0a0a0c]">0 - 1 an</option>
                                  <option value="2-5" class="bg-[#0a0a0c]">2 - 5 ans</option>
                                  <option value="5+" class="bg-[#0a0a0c]">5 ans et +</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          <!-- Description & Avail -->
                          <div class="grid grid-cols-1 md:grid-cols-12 gap-8 pt-10 border-t border-white/5">
                            <div class="md:col-span-4 lg:col-span-3">
                               <h4 class="text-lg font-black text-white mb-2">Détails Service</h4>
                               <p class="text-sm text-slate-500 leading-relaxed">Décrivez ce qui vous rend unique et vos horaires de disponibilité.</p>
                            </div>

                            <div class="md:col-span-8 lg:col-span-9 space-y-8">
                               <div class="space-y-3">
                                  <label class="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                     Description Professionnelle
                                     <span class="text-yellow-500/60">{{ proDescription.length }} / 300</span>
                                  </label>
                                  <textarea [(ngModel)]="proDescription" [ngModelOptions]="{standalone: true}" rows="4" maxlength="300" class="w-full p-6 bg-white/[0.03] border border-white/5 rounded-[32px] text-white font-medium placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all resize-none leading-relaxed" placeholder="Racontez votre parcours, vos spécialités, votre équipement..."></textarea>
                               </div>

                               <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                  <div class="space-y-3">
                                    <label class="text-xs font-black uppercase tracking-widest text-slate-500">Disponibilité Statut</label>
                                    <select [(ngModel)]="availability" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold appearance-none focus:outline-none focus:ring-2">
                                      <option value="available" class="bg-[#0a0a0c]">Disponible</option>
                                      <option value="busy" class="bg-[#0a0a0c]">Occupé actuellement</option>
                                      <option value="temporarily_unavailable" class="bg-[#0a0a0c]">Pause temporaire</option>
                                    </select>
                                  </div>
                                  <div class="space-y-3">
                                    <label class="text-xs font-black uppercase tracking-widest text-slate-500">Canal Préféré</label>
                                    <select [(ngModel)]="proPreferredContact" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold appearance-none focus:outline-none focus:ring-2">
                                      <option value="call" class="bg-[#0a0a0c]">Appel Direct</option>
                                      <option value="whatsapp" class="bg-[#0a0a0c]">WhatsApp Messagerie</option>
                                      <option value="both" class="bg-[#0a0a0c]">WhatsApp & Appel</option>
                                    </select>
                                  </div>
                                  <div class="space-y-3">
                                    <label class="text-xs font-black uppercase tracking-widest text-slate-500">Jours Ouvrables</label>
                                    <input [(ngModel)]="proDays" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all" placeholder="Lun - Sam" />
                                  </div>
                                  <div class="space-y-3">
                                    <label class="text-xs font-black uppercase tracking-widest text-slate-500">Tranche Horaire</label>
                                    <input [(ngModel)]="proHours" [ngModelOptions]="{standalone: true}" class="w-full h-14 px-6 bg-white/[0.03] border border-white/5 rounded-2xl text-white font-bold placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-yellow-400/40 transition-all" placeholder="08:00 - 18:30" />
                                  </div>
                               </div>
                            </div>
                          </div>

                          <!-- Final Actions -->
                          <div class="flex flex-col sm:flex-row items-center justify-between gap-6 pt-12 border-t border-white/5">
                            @if (p._id) {
                              <a [routerLink]="['/professional', p._id]" class="group flex items-center gap-3 text-yellow-500 font-black uppercase tracking-widest text-xs hover:text-yellow-400 transition-all">
                                 <div class="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center transition-transform group-hover:scale-110">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                                    </svg>
                                 </div>
                                 <span>Voir mon profil public</span>
                              </a>
                            }

                            <button (click)="saveProfessional()" [disabled]="savingPro()" class="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black rounded-3xl transition-all duration-300 transform hover:-translate-y-1 shadow-2xl shadow-yellow-500/20 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4">
                               @if (!savingPro()) {
                                 <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path>
                                 </svg>
                               } @else {
                                 <div class="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin"></div>
                               }
                               <span>{{ savingPro() ? 'Synchronisation...' : 'Enregistrer mon profil' }}</span>
                            </button>
                          </div>
                        </div>
                      } @else if (!loadingPro() && !professional()) {
                        <!-- Empty State -->
                        <div class="py-20 flex flex-col items-center justify-center text-center space-y-6">
                          <div class="w-24 h-24 rounded-[40px] bg-white/[0.02] border border-white/5 flex items-center justify-center">
                             <svg class="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                             </svg>
                          </div>
                          <div>
                            <h3 class="text-2xl font-black text-white mb-2">Profil non configuré</h3>
                            <p class="text-slate-500 max-w-sm mx-auto leading-relaxed">Devenez visible dès aujourd'hui en complétant votre identité professionnelle sur La STREET.</p>
                          </div>
                          <button class="px-8 py-4 bg-white hover:bg-slate-200 text-black font-black rounded-2xl transition-all duration-300">Initialiser mon profil</button>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .glass-card {
      background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .glass-card:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.03) 100%);
      border-color: rgba(255, 255, 255, 0.12);
      transform: translateY(-2px);
    }
    .animate-fade-in { animation: fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both; }
    .animate-bounce-in { animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { 
      from { opacity: 0; transform: translateY(40px); } 
      to { opacity: 1; transform: translateY(0); } 
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); }
    }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #050505; }
    ::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #eab308; }
    .font-primary { font-family: 'Inter', sans-serif; }
  `]
})
export class UserProfilePage implements OnInit {
  protected readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);

  name = '';
  telephone = '';
  avatarFile: File | null = null;
  avatarError = '';
  avatarPreview = '';
  savingAccount = signal(false);

  get remainingDays(): number {
    const u: any = this.auth.user();
    if (!u || !u.isPremium || !u.premiumUntil) return 0;
    const diff = new Date(u.premiumUntil).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  get accountPhotoUrl() {
    const u: any = this.auth.user();
    if (!u) return '';
    if (String(u.role || '').toLowerCase() === 'professional') {
      const p: any = this.professional();
      return this.proImagePreview || p?.profileImage?.url || u.avatarUrl || '';
    }
    return this.avatarPreview || u.avatarUrl || '';
  }

  get accountPhotoError() {
    const u: any = this.auth.user();
    if (String(u?.role || '').toLowerCase() === 'professional') return this.proImageError;
    return this.avatarError;
  }

  professional = signal<Professional | null>(null);
  loadingPro = signal(false);
  savingPro = signal(false);
  proError = '';

  proImageFile: File | null = null;
  proImageError = '';
  proImagePreview = '';

  categories = signal<any[]>([]);
  trades = signal<any[]>([]);
  selectedCategoryId = signal('');
  selectedTradeIds: string[] = [];
  experienceRange = signal<'0-1' | '2-5' | '5+'>('0-1');
  proVille = signal('');
  proQuartier = signal('');
  proName = signal('');
  proTelephone = signal('');

  availability: Availability = 'available';
  proDescription = '';
  proDays = '';
  proHours = '';
  proPreferredContact: 'call' | 'whatsapp' | 'both' = 'both';

  ngOnInit() {
    this.seo.setTitle('Mon profil · La STREET');
    this.seo.updateTags({
      description: 'Gérez votre compte et votre profil professionnel sur La STREET. Mettez à jour vos informations et vos disponibilités.'
    });

    const u = this.auth.user();
    if (!u) return;

    this.name = u.name || '';
    this.telephone = u.telephone || '';

    if (u.role === 'professional') {
      this.loadCategories();
      this.reloadProfessional();
    }
  }

  loadCategories() {
    this.api.categories().subscribe({
      next: (cats) => {
        this.categories.set(cats || []);
        this.updateTradesList();
      },
      error: () => this.categories.set([])
    });
  }

  onCategoryChange() {
    this.selectedTradeIds = [];
    this.updateTradesList();
  }

  toggleTrade(id: string) {
    if (this.selectedTradeIds.includes(id)) {
      this.selectedTradeIds = this.selectedTradeIds.filter(x => x !== id);
    } else {
      this.selectedTradeIds = [...this.selectedTradeIds, id];
    }
  }

  private updateTradesList() {
    const catId = this.selectedCategoryId();
    const cat = this.categories().find(c => c._id === catId);
    this.trades.set(cat?.trades || []);
  }

  getRoleLabel(role: string): string {
    switch(role) {
      case 'professional': return 'Professionnel';
      case 'admin': return 'Administrateur';
      default: return 'Utilisateur';
    }
  }

  availabilityLabel(a: Availability) {
    if (a === 'available') return 'Disponible';
    if (a === 'busy') return 'Occupé';
    return 'Indisponible temporairement';
  }

  private validateImageFile(f: File): string {
    if (!f.type.startsWith('image/')) return "Fichier invalide (image requise).";
    if (f.size > 10 * 1024 * 1024) return 'Image trop lourde (max 10MB).';
    return '';
  }

  onAvatarChange(e: any) {
    const file: File | null = e?.target?.files?.[0] || null;
    this.avatarError = '';
    this.avatarFile = null;
    this.avatarPreview = '';
    if (!file) return;
    const err = this.validateImageFile(file);
    if (err) {
      this.avatarError = err;
      return;
    }
    this.avatarFile = file;
    try { this.avatarPreview = URL.createObjectURL(file); } catch { this.avatarPreview = ''; }
  }

  saveAccount() {
    const initialUser: any = this.auth.user();
    if (!initialUser) {
      this.router.navigate(['/login']);
      return;
    }
    this.savingAccount.set(true);
    const runAccountUpdate = () => {
      const u: any = this.auth.user();
      const payload: any = this.avatarFile ? (() => {
        const fd = new FormData();
        fd.append('name', this.name);
        fd.append('telephone', this.telephone);
        fd.append('avatar', this.avatarFile as File, (this.avatarFile as File).name);
        return fd;
      })() : { name: this.name, telephone: this.telephone };

      this.api.updateMyAccount(payload).subscribe({
        next: (updated) => {
          const nextUser = { ...(u || {}), ...(updated || {}), name: updated?.name || this.name } as any;
          this.auth.setUser(nextUser);
          this.avatarFile = null;
          this.avatarPreview = '';
          this.toast.success('Profil mis à jour avec succès');
          this.savingAccount.set(false);
        },
        error: (e) => {
          this.toast.error('Erreur', e?.message || 'Impossible de sauvegarder les modifications');
          this.savingAccount.set(false);
        },
      });
    };

    if (String(initialUser.role || '').toLowerCase() === 'professional' && this.proImageFile) {
      const fd = new FormData();
      fd.append('profileImage', this.proImageFile as File, (this.proImageFile as File).name);
      this.api.updateMyProfessional(fd).subscribe({
        next: (updatedPro) => {
          this.professional.set(updatedPro);
          const u: any = this.auth.user();
          const url = (updatedPro as any)?.profileImage?.url;
          if (url) this.auth.setUser({ ...(u || {}), avatarUrl: url } as any);
          this.proImageFile = null;
          this.proImagePreview = '';
          runAccountUpdate();
        },
        error: (e) => {
          this.toast.error('Erreur', e?.message || 'Impossible de mettre à jour la photo professionnelle');
          this.savingAccount.set(false);
        },
      });
      return;
    }
    runAccountUpdate();
  }

  reloadProfessional() {
    this.proError = '';
    this.loadingPro.set(true);
    this.api.myProfessional().subscribe({
      next: (p) => {
        this.professional.set(p);
        this.availability = (p as any).availabilityStatus || 'available';
        this.proDescription = p.description || '';
        this.proDays = (p.daysAvailable || []).join(', ');
        this.proHours = p.hoursAvailable || '';
        this.proPreferredContact = (p.preferredContact || 'both') as any;
        this.proName.set(p.name || '');
        this.proTelephone.set(p.telephone || '');
        this.proVille.set(p.ville || '');
        this.proQuartier.set(p.quartier || '');
        this.experienceRange.set(p.experienceRange || '0-1');
        const catId = typeof p.categoryId === 'object' ? (p.categoryId as any)._id : p.categoryId;
        this.selectedCategoryId.set(catId || '');
        this.updateTradesList();

        const tradeIds = (p as any).tradeIds || (p.tradeId ? [p.tradeId] : []);
        this.selectedTradeIds = tradeIds.map((t: any) => typeof t === 'object' ? t._id : t).filter(Boolean);

        const u: any = this.auth.user();
        if (String(u?.role || '').toLowerCase() === 'professional' && p?.profileImage?.url) {
          this.auth.setUser({ ...(u || {}), avatarUrl: p.profileImage.url } as any);
        }
        this.loadingPro.set(false);
      },
      error: (e) => {
        this.professional.set(null);
        this.proError = e?.message || 'Erreur lors du chargement du profil professionnel';
        this.loadingPro.set(false);
      },
    });
  }

  onProImageChange(e: any) {
    const file: File | null = e?.target?.files?.[0] || null;
    this.proImageError = ''; this.proImageFile = null; this.proImagePreview = '';
    if (!file) return;
    const err = this.validateImageFile(file);
    if (err) { this.proImageError = err; return; }
    this.proImageFile = file;
    try { this.proImagePreview = URL.createObjectURL(file); } catch { this.proImagePreview = ''; }
  }

  saveProfessional() {
    const p = this.professional();
    if (!p?._id) return;
    this.savingPro.set(true);
    const payload: any = this.proImageFile ? (() => {
      const fd = new FormData();
      fd.append('availabilityStatus', this.availability);
      fd.append('description', this.proDescription || '');
      fd.append('daysAvailable', this.proDays || '');
      fd.append('hoursAvailable', this.proHours || '');
      fd.append('preferredContact', this.proPreferredContact);
      fd.append('profileImage', this.proImageFile as File, (this.proImageFile as File).name);
      fd.append('name', this.proName() || '');
      fd.append('telephone', this.proTelephone() || '');
      fd.append('ville', this.proVille() || '');
      fd.append('quartier', this.proQuartier() || '');
      fd.append('categoryId', this.selectedCategoryId() || '');
      this.selectedTradeIds.forEach(id => {
        fd.append('tradeIds', id);
      });
      if (this.selectedTradeIds.length > 0) {
        fd.append('tradeId', this.selectedTradeIds[0]);
      }
      fd.append('experienceRange', this.experienceRange());
      return fd;
    })() : {
      availabilityStatus: this.availability,
      description: this.proDescription,
      daysAvailable: this.proDays,
      hoursAvailable: this.proHours,
      preferredContact: this.proPreferredContact,
      name: this.proName(),
      telephone: this.proTelephone(),
      ville: this.proVille(),
      quartier: this.proQuartier(),
      categoryId: this.selectedCategoryId(),
      tradeIds: this.selectedTradeIds,
      tradeId: this.selectedTradeIds[0] || '',
      experienceRange: this.experienceRange(),
    };

    this.api.updateMyProfessional(payload).subscribe({
      next: (updated) => {
        this.professional.set(updated);
        const u: any = this.auth.user();
        const url = (updated as any)?.profileImage?.url;
        if (String(u?.role || '').toLowerCase() === 'professional' && url) {
          this.auth.setUser({ ...(u || {}), avatarUrl: url } as any);
        }
        this.proImageFile = null;
        this.proImagePreview = '';
        this.toast.success('Profil professionnel mis à jour avec succès');
        this.savingPro.set(false);
      },
      error: (e) => {
        this.toast.error('Erreur', e?.message || 'Impossible de sauvegarder les modifications');
        this.savingPro.set(false);
      },
    });
  }
}
