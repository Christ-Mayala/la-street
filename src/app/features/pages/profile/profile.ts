import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-12">
        <div class="max-w-4xl mx-auto">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-4">
                <span class="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                <span class="text-sm font-medium text-yellow-300">Espace personnel</span>
              </div>
              <h1 class="text-3xl md:text-4xl font-bold text-white">Mon profil</h1>
              <p class="mt-2 text-slate-300">
                Gérez vos informations personnelles et votre activité sur La STREET
              </p>
            </div>

            <a
              *ngIf="auth.user()?.role === 'admin'"
              routerLink="/admin"
              class="inline-flex items-center gap-2 px-5 py-2.5 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              Dashboard admin
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container py-10">
      <div class="max-w-4xl mx-auto">
        <!-- Not Logged In State -->
        <div *ngIf="!auth.user()" class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-8 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-yellow-400/10 flex items-center justify-center">
            <svg class="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h2 class="text-xl font-bold text-white mb-2">Accès à votre profil</h2>
          <p class="text-slate-300 mb-6">Connectez-vous pour accéder à votre espace personnel</p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <a routerLink="/login" class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200">
              Se connecter
            </a>
            <a routerLink="/register" class="px-6 py-3 bg-black/40 border border-slate-700 text-slate-300 font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200">
              Créer un compte
            </a>
          </div>
        </div>

        <!-- Logged In Content -->
        <div *ngIf="auth.user() as u" class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Account Info Card -->
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Informations du compte</h2>
            </div>

            <div class="p-4 rounded-xl bg-black/20 border border-slate-800 mb-6">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full overflow-hidden border border-yellow-400/30 bg-black/40 flex items-center justify-center">
                  <img *ngIf="avatarPreview || u.avatarUrl" [src]="avatarPreview || (u.avatarUrl || '')" alt="" class="h-full w-full object-contain bg-black/40" />
                  <span *ngIf="!(avatarPreview || u.avatarUrl)" class="text-yellow-300 font-bold">{{ u.name?.slice(0, 1) }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="text-sm font-medium text-white">Photo de profil</div>
                  <div class="text-sm text-slate-400">PNG/JPG · 10MB</div>
                  <div *ngIf="avatarError" class="text-xs text-red-300 mt-1">{{ avatarError }}</div>
                </div>
                <label class="px-4 py-2 bg-black/40 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 cursor-pointer">
                  Changer
                  <input type="file" accept="image/*" class="hidden" (change)="onAvatarChange($event)" />
                </label>
              </div>
            </div>

            <div class="space-y-6">
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
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="Votre nom"
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
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    placeholder="+242 06 123 45 67"
                  />
                </div>
              </div>

              <!-- Email (readonly) -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Email</label>
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                  </svg>
                  <input
                    [value]="u.email"
                    disabled
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/60 text-slate-300 cursor-not-allowed"
                  />
                </div>
              </div>

              <!-- Role -->
              <div class="flex items-center justify-between pt-4 border-t border-slate-800">
                <div>
                  <div class="text-sm text-slate-400">Type de compte</div>
                  <div class="text-white font-medium">
                    <span class="px-3 py-1 rounded-full text-sm" [ngClass]="{
                      'bg-yellow-400/20 text-yellow-300': u.role === 'professional',
                      'bg-blue-400/20 text-blue-300': u.role === 'user',
                      'bg-purple-400/20 text-purple-300': u.role === 'admin'
                    }">
                      {{ getRoleLabel(u.role) }}
                    </span>
                  </div>
                </div>
                <button
                  (click)="saveAccount()"
                  [disabled]="savingAccount()"
                  class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <div *ngIf="savingAccount()" class="spinner-small"></div>
                  <svg *ngIf="!savingAccount()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ savingAccount() ? 'Enregistrement...' : 'Enregistrer' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Professional Profile Card -->
          <div *ngIf="u.role === 'professional'" class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Profil professionnel</h2>
                  <div class="flex items-center gap-2 mt-1">
                    <div
                      class="w-2 h-2 rounded-full animate-pulse"
                      [ngClass]="{
                        'bg-emerald-500': availability === 'available',
                        'bg-amber-500': availability === 'busy',
                        'bg-rose-500': availability === 'temporarily_unavailable'
                      }"
                    ></div>
                    <span class="text-sm" [ngClass]="{
                      'text-emerald-300': availability === 'available',
                      'text-amber-300': availability === 'busy',
                      'text-rose-300': availability === 'temporarily_unavailable'
                    }">
                      {{ availabilityLabel(availability) }}
                    </span>
                  </div>
                </div>
              </div>
              <button
                (click)="reloadProfessional()"
                [disabled]="loadingPro()"
                class="p-2 rounded-lg bg-black/40 border border-slate-700 text-slate-300 hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Rafraîchir"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
              </button>
            </div>

            <!-- Error Message -->
            <div *ngIf="proError" class="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="font-semibold text-red-300">Erreur de chargement</h3>
                  <p class="text-red-200 text-sm mt-1">{{ proError }}</p>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div *ngIf="loadingPro()" class="flex justify-center py-8">
              <div class="spinner"></div>
            </div>

            <!-- Professional Form -->
            <div *ngIf="!loadingPro() && professional() as p" class="space-y-6">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Photo de profil</label>
                <div class="p-4 rounded-xl bg-black/20 border border-slate-800">
                  <div class="flex items-center gap-4">
                    <div class="h-20 w-20 rounded-full overflow-hidden border border-yellow-400/30 bg-black/40 flex items-center justify-center">
                      <img *ngIf="proImagePreview || p.profileImage?.url" [src]="proImagePreview || (p.profileImage?.url || '')" alt="" class="h-full w-full object-contain bg-black/40" />
                      <span *ngIf="!(proImagePreview || p.profileImage?.url)" class="text-yellow-300 font-bold">{{ (p.name || '').slice(0, 1) }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="text-sm text-slate-400">Changer la photo du profil public</div>
                      <div *ngIf="proImageError" class="text-xs text-red-300 mt-1">{{ proImageError }}</div>
                    </div>
                    <label class="px-4 py-2 bg-black/40 border border-slate-700 text-slate-200 text-sm font-medium rounded-lg hover:bg-black/60 hover:border-slate-600 hover:text-white transition-all duration-200 cursor-pointer">
                      Choisir
                      <input type="file" accept="image/*" class="hidden" (change)="onProImageChange($event)" />
                    </label>
                  </div>
                </div>
              </div>

              <!-- Availability -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Statut de disponibilité</label>
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <select
                    [(ngModel)]="availability"
                    name="availability"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 appearance-none"
                  >
                    <option value="available">Disponible</option>
                    <option value="busy">Occupé</option>
                    <option value="temporarily_unavailable">Indisponible temporairement</option>
                  </select>
                  <svg class="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </div>

              <!-- Description -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">
                  Description
                  <span class="float-right text-xs text-slate-500">{{ proDescription.length }}/300</span>
                </label>
                <div class="relative">
                  <svg class="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <textarea
                    [(ngModel)]="proDescription"
                    name="proDescription"
                    rows="4"
                    maxlength="300"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Décrivez vos services, votre expertise..."
                  ></textarea>
                </div>
              </div>

              <!-- Availability Details -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">Jours disponibles</label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <input
                      [(ngModel)]="proDays"
                      name="proDays"
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      placeholder="Lun, Mar, Mer..."
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label class="block text-sm font-medium text-slate-300">Horaires</label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <input
                      [(ngModel)]="proHours"
                      name="proHours"
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                      placeholder="08:00 - 18:00"
                    />
                  </div>
                </div>
              </div>

              <!-- Contact Preference -->
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-300">Contact préféré</label>
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                  <select
                    [(ngModel)]="proPreferredContact"
                    name="proPreferredContact"
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

              <!-- Actions -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-800">
                <a
                  *ngIf="p._id"
                  [routerLink]="['/professional', p._id]"
                  class="inline-flex items-center gap-2 text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                  </svg>
                  Voir mon profil public
                </a>
                <button
                  (click)="saveProfessional()"
                  [disabled]="savingPro()"
                  class="px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <div *ngIf="savingPro()" class="spinner-small"></div>
                  <svg *ngIf="!savingPro()" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  {{ savingPro() ? 'Enregistrement...' : 'Enregistrer les modifications' }}
                </button>
              </div>
            </div>

            <!-- No Professional Profile -->
            <div *ngIf="!loadingPro() && !professional()" class="text-center py-8">
              <svg class="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <h3 class="text-lg font-semibold text-white mb-2">Aucun profil professionnel</h3>
              <p class="text-slate-400">Créez votre profil professionnel pour apparaître dans les recherches</p>
            </div>
          </div>

          <!-- Tips for Non-Professionals -->
          <div *ngIf="u.role !== 'professional'" class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 lg:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-yellow-400/10 flex items-center justify-center">
                <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h2 class="text-xl font-bold text-white">Conseils pour optimiser votre expérience</h2>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-400/5 to-transparent border border-yellow-400/10">
                <div class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-white mb-2">Numéro valide</h3>
                <p class="text-sm text-slate-300">Utilisez un numéro valide pour faciliter la communication avec les professionnels.</p>
              </div>

              <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-400/5 to-transparent border border-yellow-400/10">
                <div class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-white mb-2">Règles communautaires</h3>
                <p class="text-sm text-slate-300">Respectez nos règles pour garantir une expérience positive pour tous les utilisateurs.</p>
              </div>

              <div class="p-4 rounded-xl bg-gradient-to-br from-yellow-400/5 to-transparent border border-yellow-400/10">
                <div class="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center mb-3">
                  <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                  </svg>
                </div>
                <h3 class="font-semibold text-white mb-2">Signalement</h3>
                <p class="text-sm text-slate-300">Signalez tout comportement inapproprié via le bouton "Signaler" sur les profils.</p>
              </div>
            </div>
          </div>
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

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid rgba(234, 179, 8, 0.2);
      border-radius: 50%;
      border-top-color: #eab308;
      animation: spin 1s ease-in-out infinite;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
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
export class ProfilePage implements OnInit {
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

  professional = signal<Professional | null>(null);
  loadingPro = signal(false);
  savingPro = signal(false);
  proError = '';

  proImageFile: File | null = null;
  proImageError = '';
  proImagePreview = '';

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
    if (!u) {
      return;
    }

    this.name = u.name || '';
    this.telephone = u.telephone || '';

    if (u.role === 'professional') {
      this.reloadProfessional();
    }
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
    try {
      this.avatarPreview = URL.createObjectURL(file);
    } catch {
      this.avatarPreview = '';
    }
  }

  saveAccount() {
    const u = this.auth.user();
    if (!u) {
      this.router.navigate(['/login']);
      return;
    }

    this.savingAccount.set(true);

    const payload: any = this.avatarFile ? (() => {
      const fd = new FormData();
      fd.append('name', this.name);
      fd.append('telephone', this.telephone);
      fd.append('avatar', this.avatarFile as File, (this.avatarFile as File).name);
      return fd;
    })() : { name: this.name, telephone: this.telephone };

    this.api.updateMyAccount(payload).subscribe({
      next: (updated) => {
        this.auth.setUser({
          ...u,
          ...(updated || {}),
          name: updated?.name || this.name,
          ...(updated?.telephone !== undefined ? { telephone: updated.telephone } : {})
        } as any);
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
    this.proImageError = '';
    this.proImageFile = null;
    this.proImagePreview = '';

    if (!file) return;

    const err = this.validateImageFile(file);
    if (err) {
      this.proImageError = err;
      return;
    }

    this.proImageFile = file;
    try {
      this.proImagePreview = URL.createObjectURL(file);
    } catch {
      this.proImagePreview = '';
    }
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
      return fd;
    })() : {
      availabilityStatus: this.availability,
      description: this.proDescription,
      daysAvailable: this.proDays,
      hoursAvailable: this.proHours,
      preferredContact: this.proPreferredContact,
    };

    this.api.updateMyProfessional(payload).subscribe({
      next: (updated) => {
        this.professional.set(updated);
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
