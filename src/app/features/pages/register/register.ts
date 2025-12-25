import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

type Category = { _id: string; name: string; trades: { _id: string; name: string }[] };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-20 left-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-20 right-1/4 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute top-1/3 right-1/3 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-16">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
            <span class="text-sm font-medium text-yellow-300">Rejoignez La STREET</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Créez votre <span class="text-yellow-400">compte</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300 max-w-2xl mx-auto">
            Rejoignez notre communauté de professionnels et clients en République du Congo
          </p>
        </div>
      </div>
    </section>

    <!-- Registration Form -->
    <main class="container py-12 md:py-16">
      <div class="max-w-3xl mx-auto">
        <!-- Progress Bar -->
        <div class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <div class="w-8 h-1 bg-yellow-400 rounded-full"></div>
              <h2 class="text-xl font-bold text-white">Étape {{ step }}/5</h2>
            </div>
            <span class="text-sm font-semibold text-yellow-400">{{ progress }}% complété</span>
          </div>

          <div class="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-500" [style.width.%]="progress"></div>
          </div>
        </div>

        <!-- Form Card -->
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8">
          <!-- Global Error -->
          <div *ngIf="globalError" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="font-semibold text-red-300">Erreur</h3>
                <p class="text-red-200 text-sm mt-1">{{ globalError }}</p>
              </div>
            </div>
          </div>

          <!-- Multi-step Form -->
          <form #form="ngForm" (ngSubmit)="onNextOrSubmit()" class="space-y-8">
            <!-- Step 1: Account Type & Basic Info -->
            <div *ngIf="step === 1" class="space-y-8">
              <!-- Account Type Selection -->
              <div>
                <h3 class="text-lg font-bold text-white mb-4 flex items-center gap-3">
                  <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                    <span class="text-yellow-400 font-bold text-sm">1</span>
                  </div>
                  Type de compte
                </h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    class="relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                    [class]="role === 'client'
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-transparent'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/30'"
                    (click)="role = 'client'"
                  >
                    <div class="flex flex-col items-center text-center gap-4">
                      <div class="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                      <div>
                        <div class="font-bold text-lg text-white">Je cherche un professionnel</div>
                        <div class="text-sm text-slate-400 mt-1">Client</div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] group"
                    [class]="role === 'professional'
                      ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-transparent'
                      : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/30'"
                    (click)="role = 'professional'"
                  >
                    <div class="flex flex-col items-center text-center gap-4">
                      <div class="w-12 h-12 rounded-full bg-yellow-400/10 flex items-center justify-center">
                        <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                      <div>
                        <div class="font-bold text-lg text-white">Je suis un professionnel</div>
                        <div class="text-sm text-slate-400 mt-1">Service provider</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Basic Information -->
              <div>
                <h3 class="text-lg font-bold text-white mb-6">Informations personnelles</h3>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Name -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Nom complet <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                      <input
                        [(ngModel)]="name"
                        name="name"
                        required
                        minlength="2"
                        placeholder="Ex: Jean Malonga"
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Phone -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Téléphone <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                      <input
                        [(ngModel)]="telephone"
                        name="telephone"
                        required
                        placeholder="+242 06 123 45 67"
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Email -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Email <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                      </svg>
                      <input
                        [(ngModel)]="email"
                        name="email"
                        required
                        type="email"
                        placeholder="exemple@email.com"
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      />
                    </div>
                  </div>

                  <!-- Password -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Mot de passe <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <input
                        [(ngModel)]="password"
                        name="password"
                        required
                        minlength="6"
                        [type]="showPassword ? 'text' : 'password'"
                        placeholder="••••••••"
                        class="w-full pl-12 pr-12 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      />
                      <button
                        type="button"
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-slate-400 hover:text-white transition-colors duration-200"
                        (click)="showPassword = !showPassword"
                        [attr.aria-label]="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
                      >
                        <svg *ngIf="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        <svg *ngIf="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                <!-- WhatsApp Checkbox -->
                <div class="mt-6">
                  <label class="flex items-center gap-3 p-4 rounded-lg border border-slate-800 bg-black/40 hover:bg-black/60 transition-colors duration-200 cursor-pointer">
                    <input type="checkbox" [(ngModel)]="hasWhatsapp" name="hasWhatsapp" class="w-5 h-5 rounded border-slate-600 bg-black/60 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0" />
                    <div>
                      <div class="font-medium text-white">J'ai WhatsApp sur ce numéro</div>
                      <div class="text-sm text-slate-400 mt-1">Facilitez la communication avec vos clients</div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Step 2: Location -->
            <div *ngIf="step === 2" class="space-y-8">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span class="text-yellow-400 font-bold text-sm">2</span>
                </div>
                Localisation
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Country -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">
                    Pays <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <input
                      [(ngModel)]="pays"
                      name="pays"
                      required
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      readonly
                    />
                  </div>
                </div>

                <!-- City -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">
                    Ville <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <select
                      [(ngModel)]="ville"
                      name="ville"
                      required
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                    >
                      <option value="" disabled selected>Sélectionner une ville</option>
                      <option *ngFor="let v of villes" [value]="v">{{ v }}</option>
                    </select>
                    <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>

                <!-- Neighborhood -->
                <div class="md:col-span-2 space-y-2">
                  <label class="block text-sm font-medium text-slate-300">Quartier (optionnel)</label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <input
                      [(ngModel)]="quartier"
                      name="quartier"
                      placeholder="Ex: Poto-Poto, Bacongo..."
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 3: Professional Details (only for professionals) -->
            <div *ngIf="step === 3" class="space-y-8">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span class="text-yellow-400 font-bold text-sm">3</span>
                </div>
                Informations professionnelles
              </h3>

              <div *ngIf="role !== 'professional'" class="p-6 rounded-xl bg-black/40 border border-slate-800 text-center">
                <svg class="w-12 h-12 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-slate-300">Cette étape concerne uniquement les professionnels.</p>
                <p class="text-sm text-slate-400 mt-2">Cliquez sur "Suivant" pour continuer.</p>
              </div>

              <div *ngIf="role === 'professional'" class="space-y-6">
                <!-- Category & Trade -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Category -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Catégorie <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                      </svg>
                      <select
                        [(ngModel)]="categoryId"
                        name="categoryId"
                        required
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                        (change)="onCategoryChange()"
                      >
                        <option value="" disabled selected>Sélectionner une catégorie</option>
                        <option *ngFor="let c of categories" [value]="c._id">{{ c.name }}</option>
                      </select>
                      <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Trade -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Métier <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      <select
                        [(ngModel)]="tradeId"
                        name="tradeId"
                        required
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="" disabled selected>Sélectionner un métier</option>
                        <option *ngFor="let t of selectedTrades" [value]="t._id">{{ t.name }}</option>
                      </select>
                      <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Experience & Contact -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Experience -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Années d'expérience <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <select
                        [(ngModel)]="experienceRange"
                        name="experienceRange"
                        required
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="0-1">0–1 an</option>
                        <option value="2-5">2–5 ans</option>
                        <option value="5+">5 ans et plus</option>
                      </select>
                      <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>

                  <!-- Contact Preference -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-slate-300">
                      Contact préféré <span class="text-red-400">*</span>
                    </label>
                    <div class="relative">
                      <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                      </svg>
                      <select
                        [(ngModel)]="preferredContact"
                        name="preferredContact"
                        required
                        class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="call">Appel téléphonique</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="both">Appel et WhatsApp</option>
                      </select>
                      <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Description -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">
                    Description courte (max 300 caractères)
                    <span class="float-right text-xs text-slate-500">{{ description.length }}/300</span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                    </svg>
                    <textarea
                      [(ngModel)]="description"
                      name="description"
                      rows="4"
                      maxlength="300"
                      placeholder="Décrivez votre expertise, vos spécialités..."
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 4: Availability (only for professionals) -->
            <div *ngIf="step === 4" class="space-y-8">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span class="text-yellow-400 font-bold text-sm">4</span>
                </div>
                Disponibilités
              </h3>

              <div *ngIf="role !== 'professional'" class="p-6 rounded-xl bg-black/40 border border-slate-800 text-center">
                <svg class="w-12 h-12 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <p class="text-slate-300">Cette étape concerne uniquement les professionnels.</p>
                <p class="text-sm text-slate-400 mt-2">Cliquez sur "Suivant" pour continuer.</p>
              </div>

              <div *ngIf="role === 'professional'" class="space-y-6">
                <!-- Available Days -->
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-slate-300">
                    Jours disponibles <span class="text-red-400">*</span>
                  </label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <label *ngFor="let d of days"
                           class="relative flex items-center justify-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02]"
                           [class]="daysAvailable.includes(d)
                        ? 'border-yellow-400 bg-gradient-to-br from-yellow-400/10 to-transparent'
                        : 'border-slate-700 hover:border-slate-600 hover:bg-slate-900/30'"
                    >
                      <input
                        type="checkbox"
                        [checked]="daysAvailable.includes(d)"
                        (change)="toggleDay(d, $event)"
                        class="sr-only"
                      />
                      <span class="font-medium text-white">{{ d }}</span>
                    </label>
                  </div>
                </div>

                <!-- Working Hours -->
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">
                    Horaires de travail
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <input
                      [(ngModel)]="hoursAvailable"
                      name="hoursAvailable"
                      placeholder="Ex: 08h00–18h00, 09h00–17h00..."
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Step 5: Photos & Terms -->
            <div *ngIf="step === 5" class="space-y-8">
              <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <div class="w-6 h-6 rounded-full bg-yellow-400/20 flex items-center justify-center">
                  <span class="text-yellow-400 font-bold text-sm">5</span>
                </div>
                Finalisation
              </h3>

              <!-- Terms -->
              <div class="space-y-4">
                <label class="flex items-start gap-4 p-5 rounded-xl border border-slate-800 bg-black/40 hover:bg-black/60 transition-colors duration-200 cursor-pointer">
                  <input
                    type="checkbox"
                    [(ngModel)]="acceptRules"
                    name="acceptRules"
                    class="w-5 h-5 mt-1 rounded border-slate-600 bg-black/60 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-0 flex-shrink-0"
                  />
                  <div>
                    <div class="font-bold text-white">J'accepte les conditions d'utilisation</div>
                    <div class="text-sm text-slate-400 mt-2">
                      En cochant cette case, je certifie que les informations fournies sont exactes et j'accepte les
                      <a href="/terms" class="text-yellow-300 hover:text-yellow-400 hover:underline">conditions d'utilisation</a>
                      et la
                      <a href="/privacy" class="text-yellow-300 hover:text-yellow-400 hover:underline">politique de confidentialité</a>
                      de La STREET.
                    </div>
                  </div>
                </label>
              </div>

              <!-- Photos (for professionals only) -->
              <div *ngIf="role === 'professional'">
                <div class="space-y-4">
                  <label class="block text-sm font-medium text-slate-300">
                    Photos (maximum 2) <span class="text-red-400">*</span>
                    <span class="text-sm font-normal text-slate-500"> • Votre photo de profil est obligatoire</span>
                  </label>

                  <!-- File Upload Area -->
                  <div
                    class="relative border-2 border-dashed border-slate-700 rounded-xl p-8 text-center transition-all duration-300 hover:border-yellow-400/50 hover:bg-black/40 group cursor-pointer"
                    (click)="fileInput.click()"
                  >
                    <input
                      #fileInput
                      type="file"
                      accept="image/*"
                      multiple
                      (change)="onPhotosChange($event)"
                      class="hidden"
                    />
                    <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-400/10 to-yellow-600/10 border-2 border-yellow-400/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <p class="text-lg font-medium text-white">Ajoutez vos photos</p>
                    <p class="text-sm text-slate-400 mt-2">Glissez-déposez ou cliquez pour sélectionner des images</p>
                    <p class="text-xs text-slate-500 mt-1">JPG, PNG (Max 10MB par image)</p>
                  </div>

                  <!-- File Error -->
                  <div *ngIf="fileError" class="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <div class="flex items-center gap-2 text-red-300">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <span class="text-sm">{{ fileError }}</span>
                    </div>
                  </div>

                  <!-- Image Previews -->
                  <div *ngIf="profileImageFile || realizationFiles.length" class="mt-6">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <!-- Profile Image -->
                      <div *ngIf="profileImageFile" class="relative group">
                        <div class="aspect-square rounded-xl overflow-hidden border-2 border-yellow-400/30 bg-black/40">
                          <img [src]="previewUrl(profileImageFile)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div class="absolute top-2 left-2 px-2 py-1 bg-yellow-400/90 rounded text-xs font-semibold text-black">
                          Profil
                        </div>
                      </div>

                      <!-- Realization Images -->
                      <div *ngFor="let f of realizationFiles; let i = index" class="relative group">
                        <div class="aspect-square rounded-xl overflow-hidden border-2 border-slate-700 bg-black/40">
                          <img [src]="previewUrl(f)" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                        <div class="absolute top-2 left-2 px-2 py-1 bg-slate-800/90 rounded text-xs font-semibold text-white">
                          Réalisation {{ i + 1 }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Buttons -->
              <div class="pt-6">
                <div class="flex flex-col sm:flex-row gap-4">
                  <button
                    type="button"
                    (click)="prev()"
                    class="px-8 py-3.5 bg-black/40 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                    </svg>
                    Retour
                  </button>

                  <button
                    type="submit"
                    [disabled]="!acceptRules || isLoading || (role === 'professional' && !profileImageFile)"
                    class="flex-1 px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <div *ngIf="isLoading" class="spinner-small mr-2"></div>
                    <svg *ngIf="!isLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    {{ isLoading ? 'Création en cours...' : 'Créer mon compte' }}
                  </button>
                </div>

                <!-- Login Link -->
                <div class="mt-8 pt-6 border-t border-slate-800 text-center">
                  <p class="text-slate-400">
                    Vous avez déjà un compte ?
                    <a routerLink="/login" class="text-yellow-300 hover:text-yellow-400 hover:underline font-semibold ml-1">
                      Connectez-vous ici
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <!-- Navigation for steps 1-4 -->
            <div *ngIf="step !== 5" class="pt-6">
              <div class="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  (click)="prev()"
                  [disabled]="step === 1"
                  class="px-8 py-3.5 bg-black/40 border border-slate-700 text-slate-300 font-semibold rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                  </svg>
                  Retour
                </button>

                <button
                  type="submit"
                  class="flex-1 px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
                >
                  <span>{{ step === 4 ? 'Vérifier et continuer' : 'Suivant' }}</span>
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </form>
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

    .spinner-small {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterPage {
  showPassword = false;

  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  step = 1;
  role: 'client' | 'professional' = 'client';

  name = '';
  email = '';
  password = '';
  telephone = '';
  hasWhatsapp = false;

  pays = 'République du Congo';
  ville = '';
  quartier = '';

  categories: Category[] = [];
  categoryId = '';
  tradeId = '';
  selectedTrades: { _id: string; name: string }[] = [];

  experienceRange: '0-1' | '2-5' | '5+' = '0-1';
  preferredContact: 'call' | 'whatsapp' | 'both' = 'both';
  description = '';

  days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  daysAvailable: string[] = [];
  hoursAvailable = '';

  acceptRules = false;
  villes = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso'];

  profileImageFile: File | null = null;
  realizationFiles: File[] = [];
  fileError = '';
  globalError = '';
  isLoading = false;

  get progress() {
    return (this.step / 5) * 100;
  }

  constructor() {
    this.seo.setTitle('Inscription · La STREET');
    this.seo.updateTags({
      description: 'Rejoignez La STREET, la plateforme qui connecte les professionnels et clients en République du Congo. Inscrivez-vous gratuitement.'
    });

    this.loadCategories();
  }

  loadCategories() {
    try {
      this.api.categories().subscribe({
        next: (list) => {
          this.categories = (list || []) as Category[];
        },
        error: (e) => {
          console.error('Erreur chargement catégories:', e);
          this.categories = [];
        },
      });
    } catch (error) {
      console.error('Exception chargement catégories:', error);
      this.categories = [];
    }
  }

  onCategoryChange() {
    const c = this.categories.find((x) => x._id === this.categoryId);
    this.selectedTrades = c?.trades || [];
    this.tradeId = '';
  }

  toggleDay(d: string, e: any) {
    const checked = !!e?.target?.checked;
    if (checked) {
      if (!this.daysAvailable.includes(d)) {
        this.daysAvailable = [...this.daysAvailable, d];
      }
    } else {
      this.daysAvailable = this.daysAvailable.filter((x) => x !== d);
    }
  }

  private validateImageFile(f: File): string {
    if (!f.type.startsWith('image/')) {
      return `Le fichier ${f.name} n'est pas une image.`;
    }
    if (f.size > 10 * 1024 * 1024) {
      return `L'image ${f.name} dépasse 10MB.`;
    }
    return '';
  }

  onPhotosChange(e: any) {
    const files: FileList | null = e.target?.files || null;
    this.fileError = '';
    this.profileImageFile = null;
    this.realizationFiles = [];

    if (!files || files.length === 0) return;

    if (files.length > 2) {
      this.fileError = 'Vous ne pouvez sélectionner que 2 photos maximum.';
      return;
    }

    const arr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const err = this.validateImageFile(f);
      if (err) {
        this.fileError = err;
        return;
      }
      arr.push(f);
    }

    this.profileImageFile = arr[0] || null;
    this.realizationFiles = arr.slice(1, 2);
  }

  previewUrl(f: File) {
    try {
      return URL.createObjectURL(f);
    } catch {
      return '';
    }
  }

  prev() {
    if (this.step > 1) this.step--;
  }

  async onNextOrSubmit() {
    this.globalError = '';

    if (this.step < 5) {
      this.step++;
      return;
    }

    if (!this.acceptRules) {
      this.globalError = 'Vous devez accepter les conditions d\'utilisation.';
      return;
    }

    if (this.role === 'professional') {
      if (!this.categoryId || !this.tradeId) {
        this.globalError = 'Veuillez sélectionner une catégorie et un métier.';
        return;
      }
      if (!this.ville) {
        this.globalError = 'Veuillez sélectionner une ville.';
        return;
      }
      if (!this.profileImageFile) {
        this.globalError = 'Veuillez ajouter votre photo de profil.';
        return;
      }
    }

    this.isLoading = true;

    try {
      // 1. Créer le compte utilisateur
      await this.auth.register({
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role === 'professional' ? 'professional' : 'user',
        telephone: this.telephone,
      });

      // 2. Si professionnel, créer le profil professionnel
      if (this.role === 'professional') {
        if (!this.profileImageFile) {
          throw new Error('Photo de profil requise');
        }

        const fd = new FormData();
        fd.append('name', this.name);
        fd.append('telephone', this.telephone);
        fd.append('whatsapp', String(this.hasWhatsapp));
        fd.append('pays', this.pays);
        fd.append('ville', this.ville);
        fd.append('quartier', this.quartier || '');
        fd.append('categoryId', this.categoryId);
        fd.append('tradeId', this.tradeId);
        fd.append('experienceRange', this.experienceRange);
        fd.append('preferredContact', this.preferredContact);
        fd.append('description', this.description || '');
        fd.append('hoursAvailable', this.hoursAvailable || '');

        // Ajouter les jours disponibles
        this.daysAvailable.forEach(d => {
          fd.append('daysAvailable', d);
        });

        // Ajouter les photos
        fd.append('profileImage', this.profileImageFile, this.profileImageFile.name);
        this.realizationFiles.forEach((f, index) => {
          fd.append('images', f, f.name);
        });

        // Envoyer la requête pour créer le profil professionnel
        await new Promise<void>((resolve, reject) => {
          this.api.createProfessional(fd).subscribe({
            next: () => resolve(),
            error: (err) => {
              console.error('Erreur création profil professionnel:', err);
              reject(err);
            }
          });
        });
      }

      // 3. Connecter l'utilisateur après inscription réussie
      await this.auth.login(this.email, this.password);

      this.toast.success('Bienvenue !', 'Votre compte a été créé avec succès.');
      this.router.navigate(['/profile']);

    } catch (error: any) {
      console.error('Erreur inscription:', error);

      // Gestion des erreurs spécifiques
      if (error?.message?.includes('duplicate') || error?.error?.message?.includes('duplicate')) {
        this.globalError = 'Cet email est déjà utilisé. Veuillez utiliser une autre adresse email.';
      } else if (error?.message?.includes('email')) {
        this.globalError = 'Adresse email invalide ou déjà utilisée.';
      } else {
        this.globalError = error?.message || 'Une erreur est survenue lors de la création du compte.';
      }

      this.toast.error('Erreur', this.globalError);
    } finally {
      this.isLoading = false;
    }
  }

  private validateCurrentStep(): boolean {
    switch (this.step) {
      case 1:
        if (!this.name || this.name.length < 2) {
          this.globalError = 'Veuillez entrer un nom complet valide (min. 2 caractères).';
          return false;
        }
        if (!this.email || !this.isValidEmail(this.email)) {
          this.globalError = 'Veuillez entrer une adresse email valide.';
          return false;
        }
        if (!this.password || this.password.length < 6) {
          this.globalError = 'Le mot de passe doit contenir au moins 6 caractères.';
          return false;
        }
        if (!this.telephone) {
          this.globalError = 'Veuillez entrer un numéro de téléphone.';
          return false;
        }
        break;

      case 2:
        if (!this.ville) {
          this.globalError = 'Veuillez sélectionner une ville.';
          return false;
        }
        break;

      case 3:
        if (this.role === 'professional') {
          if (!this.categoryId) {
            this.globalError = 'Veuillez sélectionner une catégorie.';
            return false;
          }
          if (!this.tradeId) {
            this.globalError = 'Veuillez sélectionner un métier.';
            return false;
          }
        }
        break;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
