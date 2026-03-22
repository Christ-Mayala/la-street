import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';
import { Professional } from '../../../core/models/professional.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="fixed top-16 left-0 right-0 bottom-0 flex flex-col md:flex-row bg-black w-full overflow-hidden z-[50]">
      <!-- Sidebar Navigation -->
      <aside class="w-full md:w-64 flex-shrink-0 border-r border-slate-800 bg-slate-900/40 backdrop-blur-xl p-4 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
        <div class="hidden md:block mb-6 px-2 mt-2">
          <h2 class="text-xl font-extrabold text-white tracking-tight">Espace <span class="text-yellow-500">Admin</span></h2>
          <p class="text-xs text-slate-500 mt-1">Supervision globale de La STREET</p>
        </div>
        
        <button [class]="activeTab==='users' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800/50'" class="px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all whitespace-nowrap" (click)="activeTab='users'">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> Utilisateurs
        </button>
        
        <button [class]="activeTab==='pros' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800/50'" class="px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all whitespace-nowrap" (click)="activeTab='pros'">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> Professionnels
        </button>
        
        <button [class]="activeTab==='payments' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800/50'" class="px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all whitespace-nowrap" (click)="activeTab='payments'; reloadPayments()">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> Paiements
        </button>

        <button [class]="activeTab==='reports' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800/50'" class="px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all whitespace-nowrap" (click)="activeTab='reports'">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg> Signalements
        </button>

        <button [class]="activeTab==='email' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'text-slate-300 hover:bg-slate-800/50'" class="px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-semibold transition-all whitespace-nowrap" (click)="activeTab='email'; ensureEmailRecipients()">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg> E-Mailing
        </button>

        <div class="hidden md:block flex-grow"></div>
        
        <!-- Action Globale Sidebar -->
        <button *ngIf="activeTab==='users' || activeTab==='pros'" class="hidden md:flex px-4 py-3 rounded-xl items-center gap-3 text-sm font-semibold text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400/20 border border-emerald-400/20 transition-all mt-6 whitespace-nowrap" (click)="exportData(activeTab)">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exporter (CSV)
        </button>
      </aside>

      <!-- Main Workspace -->
      <main class="flex-1 min-w-0 w-full bg-black overflow-y-auto px-2 py-6 md:p-8 relative no-scrollbar flex flex-col">
        <div class="max-w-7xl mx-auto w-full">
          <!-- Main Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Tableau de bord</h1>
              <p class="text-sm text-slate-400 mt-1">Gérez vos utilisateurs, professionnels et configurations.</p>
            </div>
            <div class="flex items-center gap-3">
              <button *ngIf="(activeTab==='users' || activeTab==='pros')" class="md:hidden px-3 py-2 rounded-lg text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20" (click)="exportData(activeTab)">
                Exporter
              </button>
              <button class="px-4 py-2 border border-slate-700 bg-slate-800/50 hover:bg-slate-700 rounded-lg text-sm text-white font-medium flex items-center gap-2 transition-all" (click)="reload()">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg> Actualiser
              </button>
            </div>
          </div>
          
          <div *ngIf="error" class="mb-6 flex items-center gap-3 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm font-medium">
             <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> {{ error }}
          </div>

        <div class="mt-4">
          <!-- Onglet Paiements -->
          <div *ngIf="activeTab==='payments'" class="card p-4 animate-in fade-in duration-300">
            <div class="flex items-center justify-between mb-4">
              <h3 class="font-semibold flex items-center gap-2">
                Demandes de paiement
                <span *ngIf="paymentsLoading" class="inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span>
              </h3>
              <button class="text-sm text-yellow-500 hover:underline" (click)="reloadPayments()">Actualiser</button>
            </div>

            <div *ngIf="paymentsError" class="p-3 mb-4 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ paymentsError }}</div>

            <div class="overflow-x-auto border border-slate-800 rounded-xl bg-black/40">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th class="p-4 font-normal">Utilisateur</th>
                    <th class="p-4 font-normal">Plan / Mission</th>
                    <th class="p-4 font-normal">Montant</th>
                    <th class="p-4 font-normal">Preuve</th>
                    <th class="p-4 font-normal">Statut</th>
                    <th class="p-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/50">
                  <tr *ngFor="let p of payments" [class.bg-yellow-500/5]="p.status === 'pending'">
                    <td class="p-4">
                      <div class="font-medium text-white">{{ p.userId?.name }}</div>
                      <div class="text-xs text-slate-500">{{ p.userId?.email }}</div>
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" 
                        [class.bg-yellow-500/20]="p.plan === 'premium'"
                        [class.text-yellow-500]="p.plan === 'premium'"
                        [class.bg-slate-800]="p.plan !== 'premium'"
                        [class.text-slate-400]="p.plan !== 'premium'">
                        {{ p.plan }}
                      </span>
                      <div *ngIf="p.leadId" class="text-[10px] text-slate-500 mt-1 italic">Mission: {{ p.leadId._id }}</div>
                    </td>
                    <td class="p-4 font-mono font-bold">{{ p.amount }} FCFA</td>
                    <td class="p-4">
                      <div class="flex flex-col gap-1">
                        <div *ngIf="p.transactionCode" class="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono w-max">
                          {{ p.transactionCode }}
                        </div>
                        <button *ngIf="p.proofImage" 
                          (click)="selectedProofImage = p.proofImage"
                          class="text-xs text-yellow-500 hover:text-yellow-400 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          Voir capture
                        </button>
                      </div>
                    </td>
                    <td class="p-4 text-xs">
                      <span [class]="p.status === 'pending' ? 'text-yellow-500' : (p.status === 'approved' ? 'text-green-500' : 'text-red-500')">
                        {{ p.status }}
                      </span>
                    </td>
                    <td class="p-4 text-right">
                      <div class="flex justify-end gap-2" *ngIf="p.status === 'pending'">
                        <button (click)="handlePayment(p, 'approved')" [disabled]="isPaymentActing(p)" class="px-2 py-1 bg-green-500/20 text-green-500 border border-green-500/30 rounded text-xs font-bold hover:bg-green-500 hover:text-white transition-colors">V</button>
                        <button (click)="handlePayment(p, 'rejected')" [disabled]="isPaymentActing(p)" class="px-2 py-1 bg-red-500/20 text-red-500 border border-red-500/30 rounded text-xs font-bold hover:bg-red-500 hover:text-white transition-colors">X</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div *ngIf="payments.length === 0" class="p-8 text-center text-slate-500">Aucune demande trouvée.</div>
            </div>
          </div>
        <div *ngIf="activeTab==='pros'" class="card p-0 overflow-hidden">
          <div class="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md p-4 border-b border-slate-800">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 class="font-semibold text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                Professionnels 
                <span *ngIf="prosLoading" class="inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span>
              </h3>
              <div class="flex gap-2">
                <select class="input-modern !py-1 !rounded-lg text-sm" [(ngModel)]="proStatusFilter" name="proStatusFilter" (change)="reloadPros()">
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
                <input class="input-modern !py-1 !rounded-lg text-sm" [(ngModel)]="proSearch" name="proSearch" placeholder="Rechercher..." />
              </div>
            </div>
          </div>
          <div class="p-4 pt-0">
            <div *ngIf="prosError" class="mt-3 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ prosError }}</div>
            <div *ngIf="prosLoading" class="mt-3 text-sm text-slate-300">Chargement des professionnels...</div>
            <div class="mt-3 space-y-3">
              <div *ngFor="let p of paginatedPros; trackBy: trackByEntity" class="p-3 rounded-xl border border-slate-800 bg-black/20 group hover:border-slate-700/80 transition-all">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div class="flex items-start gap-4 min-w-0">
                    <div class="h-14 w-14 rounded-full overflow-hidden border border-yellow-400/25 bg-black/40 flex items-center justify-center shrink-0 shadow-inner">
                      <img *ngIf="p.profileImage?.url" [src]="p.profileImage?.url" alt="" class="h-full w-full object-cover bg-black/40" loading="lazy" decoding="async" />
                      <span *ngIf="!p.profileImage?.url" class="text-yellow-300 font-bold text-xl">{{ (p.name || '?').slice(0, 1).toUpperCase() }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-white clamp-2 text-anywhere text-base flex items-center gap-2">
                        {{ p.name }}
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase" [class]="p.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (p.approvalStatus === 'rejected' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20')">
                          {{ p.approvalStatus }}
                        </span>
                      </div>
                      <div class="text-sm text-slate-400 clamp-2 text-anywhere mt-1">
                        {{ tradeLabel(p) }} · {{ p.ville }}<span *ngIf="p.quartier"> · {{ p.quartier }}</span>
                      </div>
                      <button type="button" class="mt-2 text-xs text-yellow-500 hover:underline flex items-center gap-1" (click)="openProfessional(p)">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                        Fiche complète
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2 md:opacity-80 md:group-hover:opacity-100 transition-opacity">
                    <button class="px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors text-xs font-medium" (click)="openProfessional(p)" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Voir' }}</button>
                    <button *ngIf="p.approvalStatus!=='approved'" class="px-3 py-1.5 rounded-lg text-emerald-400 bg-emerald-400/10 hover:bg-emerald-400 hover:text-white border border-emerald-400/20 transition-colors text-xs font-bold" (click)="setStatus(p, 'approved')" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Approuver' }}</button>
                    <button *ngIf="p.approvalStatus!=='rejected'" class="px-3 py-1.5 rounded-lg text-rose-400 bg-rose-400/10 hover:bg-rose-400 hover:text-white border border-rose-400/20 transition-colors text-xs font-bold" (click)="setStatus(p, 'rejected')" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Rejeter' }}</button>
                    <button class="px-3 py-1.5 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors text-xs font-medium" (click)="deleteProfessional(p)" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Supprimer' }}</button>
                  </div>
                </div>
              </div>
              <div *ngIf="pros.length===0" class="p-8 text-center text-slate-500 border border-slate-800 rounded-xl bg-black/20">Aucun professionnel.</div>
              
              <!-- Pagination Pros -->
              <div *ngIf="totalPagesPros > 1" class="mt-6 flex items-center justify-center gap-4">
                <button (click)="currentPagePros = currentPagePros - 1" [disabled]="currentPagePros === 1" class="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                </button>
                <div class="text-sm font-medium text-slate-400">Page <span class="text-white">{{ currentPagePros }}</span> sur {{ totalPagesPros }}</div>
                <button (click)="currentPagePros = currentPagePros + 1" [disabled]="currentPagePros === totalPagesPros" class="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab==='users'" class="card p-0 overflow-hidden">
          <div class="sticky top-0 z-10 bg-slate-900/95 backdrop-blur-md p-4 border-b border-slate-800">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 class="font-semibold text-white flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                Utilisateurs 
                <span *ngIf="usersLoading" class="inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span>
              </h3>
              <div class="flex gap-2">
                <select class="input-modern !py-1 !rounded-lg text-sm" [(ngModel)]="userStatusFilter" name="userStatusFilter" (change)="reloadUsers()">
                  <option value="active">Actifs</option>
                  <option value="inactive">Désactivés</option>
                  <option value="deleted">Supprimés</option>
                  <option value="all">Tous</option>
                </select>
                <input class="input-modern !py-1 !rounded-lg text-sm" [(ngModel)]="userSearch" name="userSearch" placeholder="Rechercher..." (input)="reloadUsers()" />
              </div>
            </div>
          </div>
          <div class="p-4 pt-0">
            <div *ngIf="usersError" class="mt-3 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ usersError }}</div>
            <div *ngIf="usersLoading" class="mt-3 text-sm text-slate-300">Chargement des utilisateurs...</div>
            <div class="mt-4">
              <!-- Formulaire Création Rapide -->
              <div class="p-4 rounded-xl border border-slate-800 bg-slate-900/30 mb-6">
                <div class="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <svg class="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> 
                  Création Rapide
                </div>
                <form class="grid grid-cols-1 md:grid-cols-5 gap-3" (submit)="createUser($event)">
                  <input [(ngModel)]="newUserName" name="newUserName" placeholder="Nom" class="input-modern !py-2 !rounded-lg" required />
                  <input [(ngModel)]="newUserEmail" name="newUserEmail" placeholder="Email" class="input-modern !py-2 !rounded-lg" required />
                  <input [(ngModel)]="newUserPassword" name="newUserPassword" placeholder="Mot de passe" type="password" class="input-modern !py-2 !rounded-lg" required minlength="6" />
                  <select [(ngModel)]="newUserRole" name="newUserRole" class="input-modern !py-2 !rounded-lg">
                    <option value="user">Utilisateur Standard</option>
                    <option value="professional">Professionnel</option>
                    <option value="admin">Administrateur</option>
                  </select>
                  <div class="flex gap-2">
                    <input [(ngModel)]="newUserTelephone" name="newUserTelephone" placeholder="Téléphone" class="input-modern !py-2 !rounded-lg flex-1" />
                    <button class="btn-primary whitespace-nowrap" type="submit" [disabled]="createUserLoading">{{ createUserLoading ? '...' : 'Créer' }}</button>
                  </div>
                </form>
              </div>

              <!-- Liste des utilisateurs -->
              <div class="space-y-3">
                <div *ngFor="let u of paginatedUsers; trackBy: trackByEntity" class="flex flex-col md:flex-row md:items-center justify-between p-4 border border-slate-800 bg-black/40 rounded-xl hover:border-slate-700/80 transition-all gap-4 group">
                  <div class="flex items-center gap-4 min-w-0">
                    <div class="h-12 w-12 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center font-bold text-slate-300 border border-slate-700/50 shadow-inner shrink-0">
                      {{ (u.name || '?').slice(0, 1).toUpperCase() }}
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-white flex items-center flex-wrap gap-2 text-base">
                        <span class="truncate">{{ u.name }}</span>
                        <span *ngIf="u.role === 'admin'" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-500/10 text-red-400 border border-red-500/20">Admin</span>
                        <span *ngIf="u.role === 'professional'" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-400 border border-blue-500/20">Pro</span>
                        <span *ngIf="u.isPremium" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-yellow-500/10 text-yellow-500 border border-yellow-500/30 flex items-center gap-1">
                          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          Premium
                        </span>
                      </div>
                      <div class="text-sm text-slate-400 mt-1 truncate">{{ u.email }}<span *ngIf="u.telephone"> · {{ u.telephone }}</span></div>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap items-center gap-2 md:opacity-80 md:group-hover:opacity-100 transition-opacity">
                    <button class="px-3 py-1.5 rounded-lg border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-black text-xs font-semibold transition-colors flex items-center gap-1.5" type="button" (click)="grantPremium(u)" [disabled]="isUserActing(u)">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                      {{ isUserActing(u) ? '...' : (u.isPremium ? '+ Jours' : 'Offrir Premium') }}
                    </button>
                    <button class="px-3 py-1.5 rounded-lg text-slate-300 bg-slate-800/50 hover:bg-slate-700 border border-slate-700 transition-colors text-xs font-medium" type="button" (click)="prefillEmail(u)" [disabled]="isUserActing(u)">Email</button>
                    
                    <button *ngIf="(u.status||'') !== 'inactive' && !(u.deleted===true || u.status==='deleted')" class="px-3 py-1.5 rounded-lg text-orange-400 bg-orange-400/10 hover:bg-orange-400 hover:text-white border border-orange-400/20 transition-colors text-xs font-medium" type="button" (click)="setUserStatus(u, 'inactive')" [disabled]="isUserActing(u)">Désactiver</button>
                    <button *ngIf="(u.status||'') === 'inactive'" class="px-3 py-1.5 rounded-lg text-green-400 bg-green-400/10 hover:bg-green-400 hover:text-white border border-green-400/20 transition-colors text-xs font-medium" type="button" (click)="setUserStatus(u, 'active')" [disabled]="isUserActing(u)">Activer</button>
                    
                    <button *ngIf="(u.deleted===true || u.status==='deleted')" class="px-3 py-1.5 rounded-lg text-slate-400 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors text-xs font-medium" type="button" (click)="restoreUser(u)" [disabled]="isUserActing(u)">Restaurer</button>
                    <button *ngIf="!(u.deleted===true || u.status==='deleted')" class="px-3 py-1.5 rounded-lg text-red-500 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors text-xs font-medium" type="button" (click)="deleteUser(u)" [disabled]="isUserActing(u)">Supprimer</button>
                  </div>
                </div>
                <div *ngIf="users.length===0" class="p-8 text-center text-slate-500 border border-slate-800 rounded-xl bg-black/20">Aucun utilisateur trouvé.</div>

                <!-- Pagination Users -->
                <div *ngIf="totalPagesUsers > 1" class="mt-6 flex items-center justify-center gap-4">
                  <button (click)="currentPageUsers = currentPageUsers - 1" [disabled]="currentPageUsers === 1" class="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <div class="text-sm font-medium text-slate-400">Page <span class="text-white">{{ currentPageUsers }}</span> sur {{ totalPagesUsers }}</div>
                  <button (click)="currentPageUsers = currentPageUsers + 1" [disabled]="currentPageUsers === totalPagesUsers" class="p-2 rounded-lg border border-slate-800 bg-slate-900/50 text-slate-400 disabled:opacity-30 hover:bg-slate-800 transition-all">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>

              <div class="mt-4 p-3 rounded-xl border border-slate-800 bg-black/20 text-sm text-slate-300">
                Onglet <span class="text-yellow-300 font-semibold">Email</span> pour envoyer des messages (individuel ou broadcast).
              </div>
            </div>
          </div>
        </div>

        <div *ngIf="activeTab==='reports'" class="card p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 class="font-semibold">Signalements <span *ngIf="reportsLoading" class="ml-2 inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span></h3>
            <div class="flex gap-2">
              <select class="input-modern !py-1 !rounded-lg" [(ngModel)]="reportStatusFilter" name="reportStatusFilter" (change)="reloadReports()">
                <option value="open">Ouverts</option>
                <option value="resolved">Traités</option>
              </select>
              <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="reportSearch" name="reportSearch" placeholder="Rechercher..." />
              <button class="btn-outline" (click)="reloadReports()" [disabled]="reportsLoading">{{ reportsLoading ? '...' : 'Rafraîchir' }}</button>
            </div>
          </div>
          <div *ngIf="reportsError" class="mb-3 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ reportsError }}</div>
          <div *ngIf="reportsLoading" class="text-sm text-slate-300">Chargement des signalements...</div>
          <div class="mt-3 space-y-2">
            <div *ngFor="let r of filteredReports; trackBy: trackByEntity" class="p-3 border rounded">
              <div class="text-sm text-slate-200">
                <span class="font-medium">{{ r.reason }}</span>
                <span class="text-xs text-slate-400"> · {{ r.createdAt | date:'short' }}</span>
                <span class="ml-2 text-xs" [class.text-amber-300]="r.status==='open'" [class.text-slate-400]="r.status!=='open'">{{ r.status }}</span>
              </div>
              <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                <div>
                  <span class="text-slate-400">Reporter:</span> <span class="font-semibold">{{ r.reporter?.name || '—' }}</span> · {{ r.reporter?.email || '—' }}
                </div>
                <div>
                  <span class="text-slate-400">Cible:</span> <span class="font-semibold">{{ r.targetUser?.name || '—' }}</span> · {{ r.targetUser?.email || '—' }}
                  <span class="text-slate-500" *ngIf="r.targetUser?.role"> ({{ r.targetUser.role }})</span>
                </div>
              </div>
              <div class="mt-2" *ngIf="r.targetProfessional">
                <a class="text-sm text-primary hover:underline" [routerLink]="['/professional', r.targetProfessional._id]">Voir le profil signalé: {{ r.targetProfessional.name }}</a>
              </div>
              <div *ngIf="r.message" class="mt-2 text-sm text-slate-300">{{ r.message }}</div>
              <div class="mt-3 flex gap-2">
                <button type="button" class="btn-outline" (click)="decide(r, 'keep')" [disabled]="r.status!=='open' || isDeciding(r)">
                  {{ isDeciding(r) ? '...' : 'Garder' }}
                </button>
                <button type="button" class="btn-primary" (click)="decide(r, 'delete')" [disabled]="r.status!=='open' || isDeciding(r)">
                  {{ isDeciding(r) ? '...' : 'Supprimer user' }}
                </button>
              </div>
            </div>
            <div *ngIf="reports.length===0" class="text-sm text-slate-300">Aucun signalement.</div>
          </div>
        </div>

        <div *ngIf="activeTab==='email'" class="card p-4">
          <div class="flex items-center justify-between gap-3">
            <h3 class="font-semibold">Email <span *ngIf="emailSending || broadcastSending" class="ml-2 inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span></h3>
          </div>

          <div class="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="p-3 rounded-xl border border-slate-800 bg-black/20">
              <div class="font-semibold mb-2">Email individuel</div>
              <form class="grid grid-cols-1 gap-2" (submit)="sendUserEmail($event)">
                <select [(ngModel)]="emailUserId" name="emailUserId" class="input-modern !py-2 !rounded-lg" required>
                  <option value="" disabled>Sélectionner un utilisateur</option>
                  <option *ngFor="let u of emailRecipients; trackBy: trackByEntity" [value]="u._id">{{ u.name }} · {{ u.email }}</option>
                </select>
                <div *ngIf="emailRecipientsLoading" class="text-xs text-slate-400">Chargement des destinataires...</div>
                <input [(ngModel)]="emailSubject" name="emailSubject" placeholder="Sujet" class="input-modern !py-2 !rounded-lg" required minlength="3" />
                <textarea [(ngModel)]="emailMessage" name="emailMessage" placeholder="Message" class="input-modern !py-2 !rounded-lg" rows="5" required minlength="3"></textarea>
                <button class="btn-primary" type="submit" [disabled]="emailSending">{{ emailSending ? 'Envoi...' : 'Envoyer' }}</button>
              </form>
            </div>

            <div class="p-3 rounded-xl border border-slate-800 bg-black/20">
              <div class="font-semibold mb-2">Broadcast</div>
              <form class="grid grid-cols-1 gap-2" (submit)="broadcastEmail($event)">
                <select [(ngModel)]="broadcastAudience" name="broadcastAudience" class="input-modern !py-2 !rounded-lg" required>
                  <option value="users">Tous les utilisateurs</option>
                  <option value="professionals">Tous les professionnels</option>
                </select>
                <input [(ngModel)]="broadcastSubject" name="broadcastSubject" placeholder="Sujet" class="input-modern !py-2 !rounded-lg" required minlength="3" />
                <textarea [(ngModel)]="broadcastMessage" name="broadcastMessage" placeholder="Message" class="input-modern !py-2 !rounded-lg" rows="5" required minlength="3"></textarea>
                <button class="btn-primary" type="submit" [disabled]="broadcastSending">{{ broadcastSending ? 'Envoi...' : 'Envoyer à tous' }}</button>
              </form>
              <div class="text-xs text-slate-400 mt-2">Envoi en lot. Utilise la config email DRY (FROM_NAME = La STREET).</div>
            </div>
          </div>
        </div>

        <!-- Modal optimisé pour mobile et desktop -->
        <div *ngIf="selectedProOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div class="w-full max-w-3xl bg-black/90 rounded-2xl border border-slate-800 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div class="sticky top-0 z-10 bg-black/90 p-5 border-b border-slate-800">
              <div class="flex items-center justify-between">
                <div class="min-w-0">
                  <div class="text-lg font-semibold text-white truncate">Détails professionnel</div>
                  <div class="text-sm text-slate-400 truncate">{{ selectedPro?.name || '—' }}</div>
                </div>
                <button type="button" class="p-2 rounded-lg hover:bg-slate-800/50 transition-colors" (click)="closeProfessional()">
                  <svg class="w-5 h-5 text-slate-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>

            <div class="p-5 pb-8">
              <div *ngIf="selectedProLoading" class="py-12 flex justify-center">
                <div class="h-10 w-10 rounded-full border-2 border-yellow-400/20 border-t-yellow-400 animate-spin"></div>
              </div>

              <div *ngIf="selectedProError" class="mb-4 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ selectedProError }}</div>

              <div *ngIf="!selectedProLoading && selectedPro" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1">
                  <div class="aspect-square rounded-2xl overflow-hidden border border-slate-800 bg-black/40 flex items-center justify-center">
                    <img *ngIf="selectedPro.profileImage?.url" [src]="selectedPro.profileImage?.url" alt="" class="w-full h-full object-cover bg-black/40" loading="lazy" decoding="async" />
                    <div *ngIf="!selectedPro.profileImage?.url" class="text-yellow-300 font-bold text-3xl">{{ (selectedPro.name || '?').slice(0, 1) }}</div>
                  </div>

                  <div class="mt-4 flex flex-wrap gap-2">
                    <span class="badge" [ngClass]="selectedPro.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' : (selectedPro.approvalStatus === 'rejected' ? 'bg-rose-500/10 text-rose-300 border-rose-500/25' : 'bg-amber-500/10 text-amber-300 border-amber-500/25')">
                      {{ selectedPro.approvalStatus || 'pending' }}
                    </span>
                    <span class="badge" [ngClass]="selectedPro.availabilityStatus === 'available' ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25' : (selectedPro.availabilityStatus === 'busy' ? 'bg-amber-500/10 text-amber-300 border-amber-500/25' : 'bg-slate-500/10 text-slate-300 border-slate-500/25')">
                      {{ selectedPro.availabilityStatus || '—' }}
                    </span>
                  </div>
                </div>

                <div class="md:col-span-2 space-y-4 min-w-0">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div class="p-4 rounded-xl border border-slate-800 bg-black/20">
                      <div class="text-xs text-slate-500">Nom</div>
                      <div class="text-white font-medium clamp-2 text-anywhere">{{ selectedPro.name }}</div>
                    </div>
                    <div class="p-4 rounded-xl border border-slate-800 bg-black/20">
                      <div class="text-xs text-slate-500">Téléphone</div>
                      <div class="text-white font-medium">{{ selectedPro.telephone || '—' }}</div>
                      <div class="text-xs text-slate-400" *ngIf="selectedPro.whatsapp">WhatsApp disponible</div>
                    </div>
                    <div class="p-4 rounded-xl border border-slate-800 bg-black/20">
                      <div class="text-xs text-slate-500">Métier</div>
                      <div class="text-white font-medium clamp-2 text-anywhere">{{ tradeLabel(selectedPro) }}</div>
                    </div>
                    <div class="p-4 rounded-xl border border-slate-800 bg-black/20">
                      <div class="text-xs text-slate-500">Localisation</div>
                      <div class="text-white font-medium clamp-2 text-anywhere">{{ selectedPro.ville }}<span *ngIf="selectedPro.quartier"> · {{ selectedPro.quartier }}</span></div>
                    </div>
                  </div>

                  <div class="p-4 rounded-xl border border-slate-800 bg-black/20" *ngIf="selectedPro.description">
                    <div class="text-xs text-slate-500">Description</div>
                    <div class="text-slate-200 whitespace-pre-wrap text-anywhere">{{ selectedPro.description }}</div>
                  </div>

                  <div class="p-4 rounded-xl border border-slate-800 bg-black/20">
                    <div class="text-xs text-slate-500">Disponibilités</div>
                    <div class="text-slate-200">
                      <span *ngIf="(selectedPro.daysAvailable || []).length">{{ (selectedPro.daysAvailable || []).join(', ') }}</span>
                      <span *ngIf="!(selectedPro.daysAvailable || []).length">—</span>
                      <span *ngIf="selectedPro.hoursAvailable"> · {{ selectedPro.hoursAvailable }}</span>
                    </div>
                    <div class="text-xs text-slate-400" *ngIf="selectedPro.preferredContact">Contact préféré: {{ selectedPro.preferredContact }}</div>
                  </div>

                  <div class="p-4 rounded-xl border border-slate-800 bg-black/20" *ngIf="selectedPro.images?.length">
                    <div class="text-xs text-slate-500 mb-3">Autres photos</div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div *ngFor="let img of selectedPro.images; trackBy: trackByImg" class="aspect-square rounded-xl overflow-hidden border border-slate-800 bg-black/40">
                        <img [src]="img.url" alt="" class="w-full h-full object-cover bg-black/40" loading="lazy" decoding="async" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Boutons fixés en bas sur mobile -->
            <div class="sticky bottom-0 left-0 right-0 bg-black/90 border-t border-slate-800 p-4 md:hidden">
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2">
                <button type="button" class="btn-outline w-full" (click)="closeProfessional()">Fermer</button>
                <div class="flex gap-2">
                  <button *ngIf="selectedPro.approvalStatus !== 'approved'" type="button" class="btn-primary flex-1" (click)="setStatus(selectedPro, 'approved')">Approuver</button>
                  <button *ngIf="selectedPro.approvalStatus !== 'rejected'" type="button" class="btn-outline flex-1" (click)="setStatus(selectedPro, 'rejected')">Rejeter</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal de preuve d'image -->
        <div *ngIf="selectedProofImage" class="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4" (click)="selectedProofImage = null">
          <div class="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center">
            <button (click)="selectedProofImage = null" class="absolute -top-12 right-0 text-white hover:text-yellow-500 flex items-center gap-2 font-bold transition-colors">
              Fermer <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <img [src]="selectedProofImage" class="w-full h-full object-contain rounded-xl shadow-2xl border border-white/10" alt="Preuve de paiement">
          </div>
        </div>

        <!-- Boutons normaux sur desktop -->
        <div class="hidden md:block">
          <div *ngIf="selectedProOpen" class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" (click)="closeProfessional()"></div>
        </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      background: black;
    }

    /* Le container principal est maintenant en fixed top-16 (height de la navbar) */
    /* Cela permet d'outrepasser le layout du app.html qui pourrait être gênant */

    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    /* Styles pour le modal mobile */
    @media (max-width: 767px) {
      .modal-mobile-fullscreen {
        height: 100vh;
        width: 100vw;
        margin: 0;
        border-radius: 0;
      }

      .modal-content-mobile {
        max-height: calc(100vh - 100px);
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }

      .modal-mobile-buttons {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(128, 128, 128, 0.3);
      }

      /* Styles pour les cartes */
      .card {
        background: rgba(0, 0, 0, 0.3);
        border: 1px solid rgba(128, 128, 128, 0.3);
        backdrop-filter: blur(5px);
      }

      /* Styles pour les boutons */
      .btn-primary {
        background: #f59e0b;
        color: #000;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: none;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn-outline {
        background: transparent;
        color: #f59e0b;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        border: 1px solid #f59e0b;
        font-weight: 500;
        transition: all 0.2s;
      }

      .btn-primary:hover, .btn-outline:hover {
        transform: translateY(-1px);
      }

      /* Style pour les badges */
      .badge {
        padding: 0.25rem 0.75rem;
        border-radius: 0.5rem;
        font-size: 0.75rem;
        border-width: 1px;
      }
    }

    /* Styles pour desktop */
    @media (min-width: 768px) {
      .modal-desktop {
        max-width: 80vw;
        max-height: 90vh;
        margin: 2rem auto;
        border-radius: 1rem;
      }

      .card {
        background: rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(128, 128, 128, 0.2);
        backdrop-filter: blur(8px);
      }
    }

    /* Styles communs */
    .input-modern {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(128, 128, 128, 0.3);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      transition: all 0.2s;
    }

    .input-modern:focus {
      outline: none;
      border-color: #f59e0b;
      box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2);
    }

    /* Clamp text */
    .clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .text-anywhere {
      word-break: break-word;
    }
  `]
})
export class AdminDashboardPage implements OnInit, OnDestroy {
  // Dashboard admin: gestion pros, utilisateurs et signalements.
  // Objectif: actions cohérentes (suppression -> disparition immédiate) + messages d'erreur lisibles.
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  activeTab: 'users' | 'pros' | 'reports' | 'email' | 'payments' = 'users';

  ngOnInit() {
    document.body.classList.add('admin-page-active');
  }

  ngOnDestroy() {
    document.body.classList.remove('admin-page-active');
  }

  selectedProOpen = false;
  selectedProLoading = false;
  selectedProError = '';
  selectedPro: any = null;
  private readonly viewedPros = new Set<string>();

  // Payment management
  payments: any[] = [];
  paymentsLoading = false;
  paymentsError = '';
  actingPayments = new Set<string>();
  selectedProofImage: string | null = null;

  trackByEntity = (_: number, x: any) => x?._id || x?.id || x?.email || x?.name || _;
  trackByImg = (_: number, x: any) => x?.public_id || x?.url || _;

  statsLoading = false;
  prosLoading = false;
  usersLoading = false;
  reportsLoading = false;

  statsError = '';
  prosError = '';
  usersError = '';
  reportsError = '';

  private readonly actingPros = new Set<string>();
  private readonly actingUsers = new Set<string>();
  private readonly decidingReports = new Set<string>();

  pros: Professional[] = [];
  users: any[] = [];
  reports: any[] = [];
  stats: any = { professionals: 0, pending: 0, approved: 0, rejected: 0, users: 0 };

  proStatusFilter: 'pending' | 'approved' | 'rejected' = 'pending';
  proSearch = '';
  userStatusFilter: 'active' | 'inactive' | 'deleted' | 'all' = 'active';
  userSearch = '';
  reportStatusFilter: 'open' | 'resolved' = 'open';
  reportSearch = '';

  // Pagination
  currentPageUsers = 1;
  currentPagePros = 1;
  pageSize = 5;

  get paginatedUsers() {
    const start = (this.currentPageUsers - 1) * this.pageSize;
    return this.filteredUsers.slice(start, start + this.pageSize);
  }

  get paginatedPros() {
    const start = (this.currentPagePros - 1) * this.pageSize;
    return this.filteredPros.slice(start, start + this.pageSize);
  }

  get totalPagesUsers() { return Math.ceil(this.filteredUsers.length / this.pageSize); }
  get totalPagesPros() { return Math.ceil(this.filteredPros.length / this.pageSize); }

  get filteredPros() {
    const q = (this.proSearch || '').toLowerCase().trim();
    if (!q) return this.pros;
    return (this.pros || []).filter((p: any) =>
      String(p?.name || '').toLowerCase().includes(q) ||
      String(p?.telephone || '').toLowerCase().includes(q) ||
      String(p?.ville || '').toLowerCase().includes(q) ||
      String(p?.quartier || '').toLowerCase().includes(q)
    );
  }

  get filteredUsers() {
    const q = (this.userSearch || '').toLowerCase().trim();
    if (!q) return this.users;
    return (this.users || []).filter((u: any) =>
      String(u?.name || '').toLowerCase().includes(q) ||
      String(u?.email || '').toLowerCase().includes(q) ||
      String(u?.telephone || '').toLowerCase().includes(q)
    );
  }
  get filteredReports() {
    const q = (this.reportSearch || '').toLowerCase().trim();
    if (!q) return this.reports;
    return (this.reports || []).filter((r: any) =>
      String(r?.reason || '').toLowerCase().includes(q) ||
      String(r?.reporter?.email || '').toLowerCase().includes(q) ||
      String(r?.targetUser?.email || '').toLowerCase().includes(q) ||
      String(r?.targetUser?.name || '').toLowerCase().includes(q) ||
      String(r?.targetProfessional?.name || '').toLowerCase().includes(q)
    );
  }

  newUserName = '';
  newUserEmail = '';
  newUserPassword = '';
  newUserTelephone = '';
  newUserRole: 'user' | 'professional' | 'admin' = 'user';

  emailRecipients: any[] = [];
  emailRecipientsLoading = false;

  emailUserId = '';
  emailSubject = '';
  emailMessage = '';
  emailSending = false;

  broadcastAudience: 'users' | 'professionals' = 'users';
  broadcastSubject = '';
  broadcastMessage = '';
  broadcastSending = false;

  createUserLoading = false;

  error = '';

  constructor() {
    this.seo.setTitle('Admin · La STREET');
    this.seo.updateTags({ description: "Espace d'administration." });
    this.reload();
  }

  tradeLabel(p: any) {
    const t = p?.tradeId;
    if (t && typeof t === 'object') return t.name || 'Métier';
    return 'Métier';
  }

  reload() {
    this.error = '';
    this.statsError = '';
    this.prosError = '';
    this.usersError = '';
    this.reportsError = '';
    this.paymentsError = '';

    this.reloadStats();
    this.reloadPros();
    this.reloadUsers();
    this.reloadReports();
    this.reloadPayments();
  }

  reloadStats() {
    this.statsLoading = true;
    this.statsError = '';

    this.api.adminStats().subscribe({
      next: (s) => {
        this.stats = s || this.stats;
        this.statsLoading = false;
      },
      error: (e) => {
        this.statsError = e?.message || 'Erreur chargement stats';
        this.statsLoading = false;
      },
    });
  }

  reloadPayments() {
    this.paymentsLoading = true;
    this.paymentsError = '';
    this.api.adminSubscriptionRequests().subscribe({
      next: (res) => {
        this.payments = res || [];
        this.paymentsLoading = false;
      },
      error: (err) => {
        this.paymentsError = err.message || 'Erreur chargement paiements';
        this.paymentsLoading = false;
      }
    });
  }

  handlePayment(req: any, status: 'approved' | 'rejected') {
    const id = req._id;
    if (this.actingPayments.has(id)) return;
    
    const note = prompt(`Note admin pour ce paiement (${status === 'approved' ? 'Validation' : 'Motif du rejet'}) :`, '');
    if (note === null) return;

    this.actingPayments.add(id);
    this.api.adminHandleSubscription(id, status, note).subscribe({
      next: () => {
        this.toast.success('Paiement', status === 'approved' ? 'Approuvé' : 'Rejeté');
        this.actingPayments.delete(id);
        this.reloadPayments();
        this.reloadStats();
      },
      error: (err) => {
        this.toast.error('Erreur', err.message || 'Action échouée');
        this.actingPayments.delete(id);
      }
    });
  }

  isPaymentActing(req: any) {
    return this.actingPayments.has(req._id);
  }

  reloadUsers() {
    this.currentPageUsers = 1;
    this.usersLoading = true;
    this.usersError = '';

    this.api.adminUsers({ status: this.userStatusFilter, search: this.userSearch || undefined, limit: 100 }).subscribe({
      next: (r) => {
        this.users = r.items || [];
        this.usersLoading = false;
      },
      error: (e) => {
        this.usersError = e?.message || 'Erreur chargement utilisateurs';
        this.usersLoading = false;
      },
    });
  }

  reloadPros() {
    this.currentPagePros = 1;
    this.prosLoading = true;
    this.prosError = '';

    this.api.adminProfessionals({ approvalStatus: this.proStatusFilter }).subscribe({
      next: (r) => {
        this.pros = r.items || [];
        this.prosLoading = false;
      },
      error: (e) => {
        this.prosError = e?.message || 'Erreur chargement professionnels';
        this.prosLoading = false;
      },
    });
  }

  reloadReports() {
    this.reportsLoading = true;
    this.reportsError = '';

    this.api.adminReports({ status: this.reportStatusFilter, limit: 80 }).subscribe({
      next: (r) => {
        this.reports = r.items || [];
        this.reportsLoading = false;
      },
      error: (e) => {
        this.reportsError = e?.message || 'Erreur chargement signalements';
        this.reports = [];
        this.reportsLoading = false;
      },
    });
  }

  isDeciding(r: any): boolean {
    const id = String(r?._id || '');
    if (!id) return false;
    return this.decidingReports.has(id);
  }

  decide(r: any, decision: 'keep' | 'delete') {
    const id = String(r?._id || '');
    if (!id) return;
    if (this.decidingReports.has(id)) return;

    this.decidingReports.add(id);

    this.api.adminReportDecision(id, { decision }).subscribe({
      next: () => {
        this.toast.success('Signalement', 'Traité');
        this.decidingReports.delete(id);
        this.reloadReports();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Erreur décision signalement';
        this.reportsError = msg;
        this.toast.error('Erreur', msg);
        this.decidingReports.delete(id);
      },
    });
  }

  isProActing(p: any): boolean {
    const id = String(p?._id || '').trim();
    if (!id) return false;
    return this.actingPros.has(id);
  }

  isUserActing(u: any): boolean {
    const id = String(u?._id || '').trim();
    if (!id) return false;
    return this.actingUsers.has(id);
  }

  setStatus(p: Professional, s: 'pending' | 'approved' | 'rejected') {
    if (!p._id) return;

    const id = String(p._id);
    if (this.actingPros.has(id)) return;

    if (s === 'approved' && !this.viewedPros.has(p._id)) {
      this.prosError = "Ouvrez les détails du professionnel avant d'approuver.";
      this.openProfessional(p);
      return;
    }

    this.actingPros.add(id);

    this.api.adminUpdateProfessionalStatus(p._id, s).subscribe({
      next: (updated) => {
        p.approvalStatus = updated.approvalStatus;
        if (this.selectedPro?._id === p._id) {
          this.selectedPro = { ...this.selectedPro, approvalStatus: updated.approvalStatus };
        }
        this.actingPros.delete(id);
        this.reloadPros();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.message || 'Impossible de mettre à jour le statut.';
        this.prosError = msg;
        this.toast.error('Erreur', msg);
        this.actingPros.delete(id);
      },
    });
  }

  deleteProfessional(p: Professional) {
    if (!p._id) return;
    if (!confirm(`Supprimer ${p.name} ?`)) return;

    const id = String(p._id);
    if (this.actingPros.has(id)) return;

    this.actingPros.add(id);

    this.api.adminDeleteProfessional(id).subscribe({
      next: () => {
        this.pros = (this.pros || []).filter((x: any) => String(x?._id) !== id);
        if (this.selectedPro?._id === id) this.closeProfessional();
        this.toast.success('Suppression', 'Professionnel supprimé');
        this.actingPros.delete(id);
        this.reloadPros();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.message || 'Impossible de supprimer le professionnel.';
        this.prosError = msg;
        this.toast.error('Erreur', msg);
        this.actingPros.delete(id);
      },
    });
  }

  createUser(ev: Event) {
    ev.preventDefault();

    if (this.createUserLoading) return;

    this.usersError = '';
    this.createUserLoading = true;

    this.api
      .adminCreateUser({
        name: this.newUserName,
        email: this.newUserEmail,
        password: this.newUserPassword,
        role: this.newUserRole,
        telephone: this.newUserTelephone || undefined,
      })
      .subscribe({
        next: () => {
          this.newUserName = '';
          this.newUserEmail = '';
          this.newUserPassword = '';
          this.newUserTelephone = '';
          this.newUserRole = 'user';
          this.toast.success('Utilisateur', 'Compte créé');
          this.createUserLoading = false;
          this.reloadUsers();
          this.reloadStats();
        },
        error: (e) => {
          const msg = e?.message || 'Impossible de créer le compte.';
          this.usersError = msg;
          this.toast.error('Erreur', msg);
          this.createUserLoading = false;
        },
      });
  }

  deleteUser(u: any) {
    if (!u?._id) return;
    if (!confirm(`Supprimer utilisateur ${u.name} ?`)) return;

    const id = String(u._id);
    if (this.actingUsers.has(id)) return;

    this.actingUsers.add(id);

    this.api.adminDeleteUser(id).subscribe({
      next: () => {
        this.users = (this.users || []).filter((x: any) => String(x?._id) !== id);
        this.toast.success('Suppression', 'Utilisateur supprimé');
        this.actingUsers.delete(id);
        this.reloadUsers();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.message || 'Impossible de supprimer le compte.';
        this.usersError = msg;
        this.toast.error('Erreur', msg);
        this.actingUsers.delete(id);
      },
    });
  }

  setUserStatus(u: any, status: 'active' | 'inactive') {
    const id = String(u?._id || '').trim();
    if (!id) return;
    if (this.actingUsers.has(id)) return;

    this.actingUsers.add(id);

    this.api.adminUpdateUserStatus(id, { status }).subscribe({
      next: () => {
        this.toast.success('Utilisateur', status === 'active' ? 'Compte activé' : 'Compte désactivé');
        this.actingUsers.delete(id);
        this.reloadUsers();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.message || 'Impossible de mettre à jour le statut.';
        this.usersError = msg;
        this.toast.error('Erreur', msg);
        this.actingUsers.delete(id);
      },
    });
  }

  restoreUser(u: any) {
    const id = String(u?._id || '').trim();
    if (!id) return;
    if (this.actingUsers.has(id)) return;

    this.actingUsers.add(id);

    this.api.adminUpdateUserStatus(id, { status: 'active', restore: true }).subscribe({
      next: () => {
        this.toast.success('Utilisateur', 'Compte restauré');
        this.actingUsers.delete(id);
        this.reloadUsers();
        this.reloadStats();
      },
      error: (e) => {
        const msg = e?.message || 'Impossible de restaurer le compte.';
        this.usersError = msg;
        this.toast.error('Erreur', msg);
        this.actingUsers.delete(id);
      },
    });
  }

  ensureEmailRecipients() {
    if (this.emailRecipientsLoading) return;
    if ((this.emailRecipients || []).length) return;
    this.reloadEmailRecipients();
  }

  reloadEmailRecipients() {
    this.emailRecipientsLoading = true;

    this.api.adminUsers({ status: 'active', limit: 200 }).subscribe({
      next: (r) => {
        this.emailRecipients = r.items || [];
        this.emailRecipientsLoading = false;
      },
      error: () => {
        this.emailRecipients = [];
        this.emailRecipientsLoading = false;
      },
    });
  }

  prefillEmail(u: any) {
    const id = String(u?._id || '').trim();
    if (!id) return;

    this.activeTab = 'email';
    this.ensureEmailRecipients();

    this.emailUserId = id;
    if (!this.emailSubject) this.emailSubject = 'Information La STREET';
  }

  // Envoi d'un email à un utilisateur (via API admin).
  sendUserEmail(ev: Event) {
    ev.preventDefault();

    if (this.emailSending) return;

    const userId = String(this.emailUserId || '').trim();
    const subject = String(this.emailSubject || '').trim();
    const message = String(this.emailMessage || '').trim();

    if (!userId || subject.length < 3 || message.length < 3) {
      this.toast.error('Erreur', 'Veuillez remplir le destinataire, le sujet et le message.');
      return;
    }

    this.usersError = '';
    this.emailSending = true;

    this.api.adminSendUserEmail(userId, { subject, message }).subscribe({
      next: () => {
        this.toast.success('Email', 'Email envoyé');
        this.emailSubject = '';
        this.emailMessage = '';
        this.emailSending = false;
      },
      error: (e) => {
        const msg = e?.message || "Impossible d'envoyer l'email.";
        this.usersError = msg;
        this.toast.error('Erreur', msg);
        this.emailSending = false;
      },
    });
  }

  broadcastEmail(ev: Event) {
    ev.preventDefault();

    if (this.broadcastSending) return;

    const audience = this.broadcastAudience;
    const subject = String(this.broadcastSubject || '').trim();
    const message = String(this.broadcastMessage || '').trim();

    if (!audience || subject.length < 3 || message.length < 3) {
      this.toast.error('Erreur', 'Veuillez remplir le public, le sujet et le message.');
      return;
    }

    if (!confirm(`Envoyer un email à tous les ${audience === 'professionals' ? 'professionnels' : 'utilisateurs'} ?`)) {
      return;
    }

    this.broadcastSending = true;

    this.api.adminBroadcastEmail({ audience, subject, message }).subscribe({
      next: (r) => {
        this.toast.success('Broadcast', `Envoyés: ${r?.sent || 0}/${r?.attempted || 0}`);
        this.broadcastSubject = '';
        this.broadcastMessage = '';
        this.broadcastSending = false;
      },
      error: (e) => {
        const msg = e?.message || "Impossible d'envoyer le broadcast.";
        this.usersError = msg;
        this.toast.error('Erreur', msg);
        this.broadcastSending = false;
      },
    });
  }

  openProfessional(p: any) {
    const id = p?._id;
    if (!id) return;

    this.selectedProOpen = true;
    this.selectedProLoading = true;
    this.selectedProError = '';
    this.selectedPro = p;
    this.viewedPros.add(id);

    this.api.adminProfessionalById(id).subscribe({
      next: (full) => {
        this.selectedPro = full;
        this.selectedProLoading = false;
      },
      error: (e) => {
        this.selectedProError = e?.message || 'Erreur chargement détails professionnel';
        this.selectedProLoading = false;
      },
    });
  }

  grantPremium(u: any) {
    const daysStr = prompt(`Combien de jours Premium souhaitez-vous offrir à ${u.name} ?`, '7');
    if (!daysStr) return;
    
    const days = parseInt(daysStr, 10);
    if (isNaN(days) || days <= 0) {
      this.toast.error('Erreur', 'Nombre de jours invalide.');
      return;
    }

    if (!confirm(`Confirmez-vous l'octroi de ${days} jours Premium à ${u.name} ?`)) return;

    this.actingUsers.add(u._id);
    this.api.adminGrantPremium(u._id, { days }).subscribe({
      next: (res) => {
        const expDate = new Date(res.newExpiration).toLocaleDateString('fr-FR');
        this.toast.success('Premium Accordé', `L'accès Premium est valable jusqu'au ${expDate}.`);
        this.actingUsers.delete(u._id);
        this.reloadUsers();
        if (this.activeTab === 'pros') this.reloadPros();
      },
      error: (e) => {
        this.toast.error('Erreur', e?.message || "Impossible d'accorder le Premium");
        this.actingUsers.delete(u._id);
      }
    });
  }

  closeProfessional() {
    this.selectedProOpen = false;
    this.selectedProLoading = false;
    this.selectedProError = '';
    this.selectedPro = null;
  }

  exportData(type: 'users' | 'pros') {
    const data = type === 'users' ? this.users : this.pros; // On exporte tout, pas juste le filtré/paginé ? Généralement l'admin veut tout.
    if (!data || !data.length) {
      this.toast.error('Erreur', 'Aucune donnée à exporter');
      return;
    }
    
    let csvContent = '';
    
    if (type === 'users') {
      csvContent = 'ID,Nom,Email,Telephone,Role,Status,Premium,Premium Expire,Date Creation\n';
      data.forEach((u: any) => {
        const createdAt = u.createdAt ? new Date(u.createdAt).toLocaleDateString('fr-FR') : '';
        const premiumUntil = u.premiumUntil ? new Date(u.premiumUntil).toLocaleDateString('fr-FR') : '';
        csvContent += `"${u._id}","${(u.name || '').replace(/"/g, '""')}","${(u.email || '').replace(/"/g, '""')}","${u.telephone || ''}","${u.role || ''}","${u.status || ''}","${u.isPremium ? 'Oui' : 'Non'}","${premiumUntil}","${createdAt}"\n`;
      });
    } else {
      csvContent = 'ID,Nom,Email Createur,Telephone,Metier,Ville,Quartier,Status,Premium,Inscrit Le\n';
      data.forEach((p: any) => {
        const createdAt = p.createdAt ? new Date(p.createdAt).toLocaleDateString('fr-FR') : '';
        csvContent += `"${p._id}","${(p.name || '').replace(/"/g, '""')}","${(p.createdBy?.email || '').replace(/"/g, '""')}","${p.telephone || ''}","${(this.tradeLabel(p)).replace(/"/g, '""')}","${(p.ville || '').replace(/"/g, '""')}","${(p.quartier || '').replace(/"/g, '""')}","${p.approvalStatus || ''}","${p.isPremium ? 'Oui' : 'Non'}","${createdAt}"\n`;
      });
    }

    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `lastreet_${type}_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
