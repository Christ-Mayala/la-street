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
    <div class="fixed top-16 left-0 right-0 bottom-0 flex flex-col md:flex-row bg-[#050505] w-full overflow-hidden z-[50]">
      <!-- Sidebar Navigation: Premium Glassmorphism -->
      <aside class="w-full md:w-72 flex-shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-2xl p-6 flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar relative">
        <div class="hidden md:block mb-8 px-2">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <svg class="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </div>
            <div>
              <h2 class="text-xl font-black text-white tracking-tighter uppercase">Espace <span class="text-yellow-500">Admin</span></h2>
              <p class="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5 opacity-60">Supervision Centrale</p>
            </div>
          </div>
        </div>
        
        <nav class="flex flex-row md:flex-col gap-3 flex-1">
          <button (click)="activeTab='users'" [class]="activeTab==='users' ? 'active-nav-item' : 'nav-item'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span class="hidden md:inline">Utilisateurs</span>
          </button>
          
          <button (click)="activeTab='pros'" [class]="activeTab==='pros' ? 'active-nav-item' : 'nav-item'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="hidden md:inline">Professionnels</span>
          </button>
          
          <button (click)="activeTab='payments'; reloadPayments()" [class]="activeTab==='payments' ? 'active-nav-item' : 'nav-item'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="hidden md:inline">Paiements</span>
          </button>

          <button (click)="activeTab='reports'" [class]="activeTab==='reports' ? 'active-nav-item' : 'nav-item'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            <span class="hidden md:inline">Signalements</span>
          </button>

          <button (click)="activeTab='email'; ensureEmailRecipients()" [class]="activeTab==='email' ? 'active-nav-item' : 'nav-item'">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            <span class="hidden md:inline">E-Mailing</span>
          </button>
        </nav>

        <div class="hidden md:block mt-auto pt-6 border-t border-white/5 font-mono text-[9px] text-slate-600 tracking-tighter uppercase whitespace-nowrap overflow-hidden">
          LA STREET v3.5.0 • CORE_STREET_SYSTEM
        </div>
      </aside>

      <!-- Main Workspace -->
      <main class="flex-1 min-w-0 w-full bg-[#050505] overflow-y-auto px-4 py-8 md:px-12 md:py-10 relative no-scrollbar flex flex-col">
        <div class="max-w-7xl mx-auto w-full">
          <!-- Main Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h1 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                {{ activeTab === 'users' ? 'Utilisateurs' : 
                   activeTab === 'pros' ? 'Professionnels' : 
                   activeTab === 'payments' ? 'Paiements' : 
                   activeTab === 'reports' ? 'Signalements' : 'E-Mailing' }}
              </h1>
              <div class="flex items-center gap-2">
                <div class="h-1 w-8 bg-yellow-500"></div>
                <p class="text-sm font-bold text-slate-400 uppercase tracking-widest">{{ activeTab === 'users' ? 'Gestion de la base utilisateur' : 'Surveillance et modération' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <button *ngIf="activeTab==='users' || activeTab==='pros'" (click)="exportData(activeTab)"
                class="px-5 py-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-black uppercase tracking-wider hover:bg-emerald-500 hover:text-black transition-all flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Exporter (.csv)
              </button>
              <button (click)="reload()"
                class="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              </button>
            </div>
          </div>
          
          <div *ngIf="error" class="mb-8 p-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-200 text-xs font-black uppercase tracking-widest flex items-center gap-3 animate-bounce-in">
             <svg class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg> 
             System Error: {{ error }}
          </div>

          <!-- Content Sections -->
          <div class="space-y-10">
            
            <!-- PAYMENTS TAB -->
            <div *ngIf="activeTab==='payments'" class="animate-in fade-in slide-in-from-bottom-5 duration-500">
              <div class="glass-card overflow-hidden">
                <div class="p-6 border-b border-white/5 flex items-center justify-between">
                  <h3 class="text-sm font-black text-white uppercase tracking-widest">Demandes d'abonnement</h3>
                  <div class="flex items-center gap-3">
                    <span *ngIf="paymentsLoading" class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                    <span class="text-[10px] text-slate-500 uppercase font-bold">{{ payments.length }} en attente</span>
                  </div>
                </div>
                <div class="overflow-x-auto">
                  <table class="w-full text-left">
                    <thead class="bg-white/[0.02] text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                      <tr>
                        <th class="p-6">Client</th>
                        <th class="p-6">Plan</th>
                        <th class="p-6">Montant</th>
                        <th class="p-6">Identifiants</th>
                        <th class="p-6">Statut</th>
                        <th class="p-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-white/5">
                      <tr *ngFor="let p of payments" class="hover:bg-white/[0.01] transition-colors group">
                        <td class="p-6">
                          <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover:text-white transition-colors">
                              {{ (p.userId?.name || '?')[0].toUpperCase() }}
                            </div>
                            <div class="min-w-0">
                              <div class="text-sm font-bold text-white truncate">{{ p.userId?.name }}</div>
                              <div class="text-xs text-slate-500 truncate">{{ p.userId?.email }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="p-6">
                          <span class="px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider"
                            [class.bg-yellow-500/10]="p.plan === 'premium'" [class.text-yellow-500]="p.plan === 'premium'"
                            [class.bg-slate-800]="p.plan !== 'premium'" [class.text-slate-400]="p.plan !== 'premium'">
                            {{ p.plan }}
                          </span>
                        </td>
                        <td class="p-6">
                          <div class="text-sm font-black text-white">{{ p.amount | number }} <span class="text-[10px] text-slate-500">FCFA</span></div>
                        </td>
                        <td class="p-6">
                          <div class="flex flex-col gap-1.5">
                            <div *ngIf="p.transactionCode" class="w-max px-2 py-0.5 rounded bg-black border border-white/5 text-[10px] font-mono text-emerald-400">
                              TX_{{ p.transactionCode }}
                            </div>
                            <button *ngIf="p.proofImage" (click)="selectedProofImage = p.proofImage"
                              class="text-[10px] font-black uppercase text-yellow-500 hover:text-white transition-colors flex items-center gap-1">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                              Media Proof
                            </button>
                          </div>
                        </td>
                        <td class="p-6">
                          <div class="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                            [class.text-yellow-500]="p.status === 'pending'"
                            [class.text-emerald-500]="p.status === 'approved'"
                            [class.text-rose-500]="p.status === 'rejected'">
                            <span class="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {{ p.status }}
                          </div>
                        </td>
                        <td class="p-6 text-right">
                          <div class="flex justify-end gap-2" *ngIf="p.status === 'pending'">
                            <button (click)="handlePayment(p, 'approved')" [disabled]="isPaymentActing(p)" 
                              class="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-black transition-all flex items-center justify-center">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                            <button (click)="handlePayment(p, 'rejected')" [disabled]="isPaymentActing(p)"
                              class="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div *ngIf="payments.length === 0" class="p-12 text-center text-slate-600 text-xs font-black uppercase tracking-widest">DB_EMPTY: No requests found.</div>
              </div>
            </div>

            <!-- PROFESSIONALS TAB -->
            <div *ngIf="activeTab==='pros'" class="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-6">
              <!-- Advanced Filter Bar -->
              <div class="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div class="flex items-center gap-6 w-full md:w-auto">
                   <div class="flex flex-col">
                      <label class="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Statut Approbation</label>
                      <select class="admin-select" [(ngModel)]="proStatusFilter" name="proStatusFilter" (change)="reloadPros()">
                        <option value="pending">En attente (Pending)</option>
                        <option value="approved">Approuvés (Active)</option>
                        <option value="rejected">Rejetés (Blocked)</option>
                      </select>
                   </div>
                </div>
                <div class="relative w-full md:w-96">
                  <input class="admin-input-search pr-12" [(ngModel)]="proSearch" name="proSearch" placeholder="RECHERHER_UN_PRO..." />
                  <div class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
                </div>
              </div>

              <!-- Pros Grid/List -->
              <div class="grid grid-cols-1 gap-4">
                <div *ngFor="let p of paginatedPros; trackBy: trackByEntity" class="glass-card hover:border-yellow-500/30 transition-all group p-5">
                  <div class="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div class="flex items-center gap-5 w-full">
                      <div class="relative flex-shrink-0">
                        <div class="w-16 h-16 rounded-2xl bg-black border border-white/5 overflow-hidden">
                          <img *ngIf="p.profileImage?.url" [src]="p.profileImage?.url" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                          <div *ngIf="!p.profileImage?.url" class="w-full h-full flex items-center justify-center text-2xl font-black text-slate-800 uppercase">
                            {{ p.name[0] }}
                          </div>
                        </div>
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-black border border-white/10 flex items-center justify-center">
                           <div class="w-2 h-2 rounded-full" [class.bg-emerald-500]="p.approvalStatus==='approved'" [class.bg-yellow-500]="p.approvalStatus==='pending'" [class.bg-rose-500]="p.approvalStatus==='rejected'"></div>
                        </div>
                      </div>
                      <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="text-lg font-black text-white uppercase tracking-tighter truncate">{{ p.name }}</h4>
                          <span *ngIf="p.isPremium" class="px-2 py-0.5 rounded text-[8px] font-black bg-yellow-400 text-black uppercase tracking-widest">PREMIUM</span>
                        </div>
                        <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ tradeLabel(p) }} • {{ p.ville }} • {{ p.quartier || 'QUARTIER_NON_RÉF' }}</p>
                        <button (click)="openProfessional(p)" class="mt-2 text-[10px] font-black text-yellow-500 flex items-center gap-1 hover:text-white transition-colors tracking-widest uppercase">
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                          Voir la fiche_full
                        </button>
                      </div>
                    </div>

                    <div class="flex items-center gap-2 w-full md:w-auto">
                      <button *ngIf="p.approvalStatus!=='approved'" (click)="setStatus(p, 'approved')" [disabled]="isProActing(p)" class="admin-btn-emerald flex-1 md:flex-none py-2.5 px-6">Approuver</button>
                      <button *ngIf="p.approvalStatus!=='rejected'" (click)="setStatus(p, 'rejected')" [disabled]="isProActing(p)" class="admin-btn-rose flex-1 md:flex-none py-2.5 px-6">Rejeter</button>
                      <button (click)="deleteProfessional(p)" [disabled]="isProActing(p)" class="w-12 h-11 rounded-xl bg-white/5 border border-white/5 text-white hover:bg-rose-500 hover:border-rose-500 transition-all flex items-center justify-center">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
                
                <div *ngIf="pros.length===0" class="p-20 text-center glass-card">
                  <p class="text-xs font-black text-slate-600 uppercase tracking-[0.3em]">PRO_DATABASE: NO_RESULTS_FOUND</p>
                </div>

                <!-- Pagination PRO -->
                <div *ngIf="totalPagesPros > 1" class="flex items-center justify-center gap-4 pt-10">
                  <button (click)="currentPagePros = currentPagePros - 1" [disabled]="currentPagePros === 1" class="admin-pagination-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <span class="text-[10px] font-black text-white uppercase tracking-widest">Page {{ currentPagePros }} SC_OFF {{ totalPagesPros }}</span>
                  <button (click)="currentPagePros = currentPagePros + 1" [disabled]="currentPagePros === totalPagesPros" class="admin-pagination-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- USERS TAB -->
            <div *ngIf="activeTab==='users'" class="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-8">
              
              <!-- Fast Creation Panel -->
              <div class="glass-card overflow-hidden border-emerald-500/20 shadow-lg shadow-emerald-500/5">
                <div class="px-6 py-4 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center gap-3">
                  <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <h3 class="text-xs font-black text-emerald-400 uppercase tracking-widest">Déploiement Compte Rapide</h3>
                </div>
                <div class="p-8">
                  <form class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4" (submit)="createUser($event)">
                    <div class="flex flex-col gap-1.5 md:col-span-2">
                       <input [(ngModel)]="newUserName" name="newUserName" placeholder="Nom Complet" class="admin-input-dark" required />
                    </div>
                    <div class="flex flex-col gap-1.5 md:col-span-2">
                       <input [(ngModel)]="newUserEmail" name="newUserEmail" placeholder="Email Address" type="email" class="admin-input-dark" required />
                    </div>
                    <div class="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
                       <input [(ngModel)]="newUserPassword" name="newUserPassword" placeholder="Auto Pass" type="password" class="admin-input-dark" required minlength="6" />
                    </div>
                    <div class="flex flex-col gap-1.5 md:col-span-2 lg:col-span-1">
                      <select [(ngModel)]="newUserRole" name="newUserRole" class="admin-select-dark">
                        <option value="user">Utilisateur</option>
                        <option value="professional">Pros</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <div class="md:col-span-4 lg:col-span-6 flex justify-end mt-2">
                      <button class="px-8 py-3 rounded-xl bg-emerald-500 text-black font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all disabled:opacity-50" type="submit" [disabled]="createUserLoading">
                        {{ createUserLoading ? 'EXÉCUTION...' : 'CRÉER_LE_COMPTE' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Filter & Search User -->
              <div class="flex flex-col md:flex-row items-center gap-4">
                 <select class="admin-select-dark min-w-[180px]" [(ngModel)]="userStatusFilter" name="userStatusFilter" (change)="reloadUsers()">
                    <option value="active">Actifs (Active)</option>
                    <option value="inactive">Désactivés (Hold)</option>
                    <option value="deleted">Supprimés (Bin)</option>
                    <option value="all">Tous (AllDB)</option>
                  </select>
                  <div class="relative flex-1">
                    <input class="admin-input-search-dark pl-12" [(ngModel)]="userSearch" name="userSearch" placeholder="SCAN_USER_BY_NAME_EMAIL..." (input)="reloadUsers()" />
                    <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                  </div>
              </div>

              <!-- User Table -->
              <div class="glass-card overflow-hidden">
                <table class="w-full text-left">
                  <thead class="bg-white/5 text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <tr>
                      <th class="p-6">Identité & Statut</th>
                      <th class="p-6">Email / Tel</th>
                      <th class="p-6">Subscription</th>
                      <th class="p-6 text-right">Contrôle Système</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-white/5">
                    <tr *ngFor="let u of paginatedUsers; trackBy: trackByEntity" class="hover:bg-white/[0.02] transition-colors group">
                      <td class="p-6">
                        <div class="flex items-center gap-4">
                          <div class="w-12 h-12 rounded-xl bg-black border border-white/5 flex items-center justify-center font-black text-slate-700 group-hover:text-yellow-500 transition-colors uppercase shadow-inner">
                            {{ (u.name || '?')[0] }}
                          </div>
                          <div>
                            <div class="flex items-center gap-2 mb-0.5">
                              <span class="text-sm font-bold text-white">{{ u.name }}</span>
                              <span *ngIf="u.role === 'admin'" class="px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 text-[8px] font-black uppercase">Admin</span>
                              <span *ngIf="u.role === 'professional'" class="px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-500 text-[8px] font-black uppercase">Pro</span>
                            </div>
                            <div class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              ID: {{ u._id.slice(-8) }} • {{ u.status || 'ACTIVE' }}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td class="p-6">
                        <div class="text-sm font-medium text-slate-300">{{ u.email }}</div>
                        <div class="text-[10px] font-mono text-slate-600 mt-1">{{ u.telephone || 'TEL_N/A' }}</div>
                      </td>
                      <td class="p-6">
                        <div *ngIf="u.isPremium" class="w-max px-2 py-1 rounded-lg bg-yellow-400 text-black text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-yellow-500/20">
                           <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                           PREMIUM_ACTIVE
                        </div>
                        <div *ngIf="!u.isPremium" class="text-[10px] text-slate-600 font-black uppercase">Standard_Base</div>
                      </td>
                      <td class="p-6 text-right">
                        <div class="flex justify-end gap-2 items-center opacity-40 group-hover:opacity-100 transition-opacity">
                          <button (click)="grantPremium(u)" [disabled]="isUserActing(u)" class="admin-action-btn border-yellow-500/20 text-yellow-500 hover:bg-yellow-500 hover:text-black" title="Grant Premium">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z"></path></svg>
                          </button>
                          <button (click)="prefillEmail(u)" [disabled]="isUserActing(u)" class="admin-action-btn border-white/10 text-white hover:bg-white/20" title="Send Email">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                          </button>
                          
                          <button *ngIf="(u.status||'') !== 'inactive' && !(u.deleted===true || u.status==='deleted')" (click)="setUserStatus(u, 'inactive')" [disabled]="isUserActing(u)" class="admin-action-btn border-orange-500/20 text-orange-500 hover:bg-orange-500" title="Deactivate">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m-9-4h18c1.11 0 2-.89 2-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3c0 1.11.89 2 2 2z"></path></svg>
                          </button>
                          <button *ngIf="(u.status||'') === 'inactive'" (click)="setUserStatus(u, 'active')" [disabled]="isUserActing(u)" class="admin-action-btn border-emerald-500/20 text-emerald-500 hover:bg-emerald-500" title="Activate">
                            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                          </button>
                          
                          <button *ngIf="!(u.deleted===true || u.status==='deleted')" (click)="deleteUser(u)" [disabled]="isUserActing(u)" class="admin-action-btn border-rose-500/20 text-rose-500 hover:bg-rose-500" title="Hard Delete">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                          <button *ngIf="(u.deleted===true || u.status==='deleted')" (click)="restoreUser(u)" [disabled]="isUserActing(u)" class="admin-action-btn border-slate-500/20 text-slate-400 hover:bg-white hover:text-black" title="System Restore">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div *ngIf="users.length === 0" class="p-20 text-center text-slate-600 text-xs font-black uppercase tracking-widest">USER_NULL: Scan complete, no targets found.</div>

                <!-- Pagination Users -->
                <div *ngIf="totalPagesUsers > 1" class="p-6 border-t border-white/5 flex items-center justify-center gap-4">
                  <button (click)="currentPageUsers = currentPageUsers - 1" [disabled]="currentPageUsers === 1" class="admin-pagination-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
                  <span class="text-[10px] font-black text-white uppercase tracking-widest">PAGE_{{ currentPageUsers }} / {{ totalPagesUsers }}</span>
                  <button (click)="currentPageUsers = currentPageUsers + 1" [disabled]="currentPageUsers === totalPagesUsers" class="admin-pagination-btn">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- REPORTS TAB -->
            <div *ngIf="activeTab==='reports'" class="animate-in fade-in slide-in-from-bottom-5 duration-500 space-y-4">
              <div class="flex items-center justify-between mb-4">
                 <div class="flex items-center gap-4">
                   <select class="admin-select-dark" [(ngModel)]="reportStatusFilter" name="reportStatusFilter" (change)="reloadReports()">
                      <option value="open">Ouverts (Incoming)</option>
                      <option value="resolved">Traités (Resolved)</option>
                    </select>
                 </div>
                 <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Incident Logs</div>
              </div>
              
              <div class="grid grid-cols-1 gap-4">
                <div *ngFor="let r of filteredReports; trackBy: trackByEntity" class="glass-card p-6 border-l-4" 
                    [class.border-l-yellow-500]="r.status==='open'" [class.border-l-slate-800]="r.status!=='open'">
                  <div class="flex flex-col md:flex-row justify-between gap-6">
                    <div class="space-y-4 flex-1">
                      <div class="flex items-center gap-3">
                         <div class="px-2 py-1 rounded bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest">Violation Report</div>
                         <span class="text-[10px] text-slate-500 font-mono">{{ r.createdAt | date:'dd/MM/yy HH:mm' }}</span>
                      </div>
                      <h4 class="text-xl font-black text-white uppercase tracking-tighter">{{ r.reason }}</h4>
                      
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div class="space-y-1">
                          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Reporter Source</p>
                          <p class="text-xs font-bold text-white">{{ r.reporter?.name || 'PRIVATE_SRC' }}</p>
                          <p class="text-[10px] text-slate-500">{{ r.reporter?.email || 'OFFLINE' }}</p>
                        </div>
                        <div class="space-y-1">
                          <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest">Target Identity</p>
                          <p class="text-xs font-bold text-yellow-500">{{ r.targetUser?.name || 'TARGET_UNK' }}</p>
                          <p class="text-[10px] text-slate-500">{{ r.targetUser?.email || 'N/A' }} <span class="text-slate-600">({{ r.targetUser?.role }})</span></p>
                        </div>
                      </div>

                      <div *ngIf="r.targetProfessional" class="mt-4">
                        <a class="inline-flex items-center gap-2 text-xs font-black text-yellow-500 hover:text-white transition-all uppercase tracking-widest" [routerLink]="['/professional', r.targetProfessional._id]">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          Link_Profile: {{ r.targetProfessional.name }}
                        </a>
                      </div>

                      <div *ngIf="r.message" class="text-sm text-slate-400 font-medium italic border-l-2 border-white/10 pl-4 py-1">"{{ r.message }}"</div>
                    </div>

                    <div class="flex md:flex-col gap-2 justify-end">
                      <button (click)="decide(r, 'keep')" [disabled]="r.status!=='open' || isDeciding(r)" class="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-xs font-black uppercase text-white hover:bg-white/10 transition-all">Reject Claim</button>
                      <button (click)="decide(r, 'delete')" [disabled]="r.status!=='open' || isDeciding(r)" class="px-6 py-3 rounded-xl bg-rose-500 text-black text-xs font-black uppercase hover:bg-rose-400 transition-all">Purge Target</button>
                    </div>
                  </div>
                </div>
                <div *ngIf="reports.length===0" class="p-20 text-center glass-card">
                  <p class="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">SECURITY: ALL_INCIDENTS_RESOLVED</p>
                 </div>
              </div>
            </div>

            <!-- EMAIL TAB -->
            <div *ngIf="activeTab==='email'" class="animate-in fade-in slide-in-from-bottom-5 duration-500 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Individual Email -->
              <div class="glass-card flex flex-col h-full border-white/5">
                <div class="p-6 border-b border-white/5 bg-white/[0.01]">
                   <h3 class="text-sm font-black text-white uppercase tracking-widest">Individual Transmissions</h3>
                   <p class="text-[10px] text-slate-500 uppercase font-bold mt-1">Targeted direct communication</p>
                </div>
                <div class="p-8 space-y-6 flex-1">
                  <form class="space-y-5" (submit)="sendUserEmail($event)">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Recipient_Node</label>
                      <select [(ngModel)]="emailUserId" name="emailUserId" class="admin-select-dark w-full" required>
                        <option value="" disabled>SELECT_ACTIVE_TARGET</option>
                        <option *ngFor="let u of emailRecipients; trackBy: trackByEntity" [value]="u._id">{{ u.name }} [{{ u.email }}]</option>
                      </select>
                      <div *ngIf="emailRecipientsLoading" class="text-[9px] text-yellow-500 font-black animate-pulse uppercase px-1">Scanning directory...</div>
                    </div>
                    
                    <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Subject_Line</label>
                       <input [(ngModel)]="emailSubject" name="emailSubject" placeholder="SUBJECT_INPUT..." class="admin-input-dark w-full" required minlength="3" />
                    </div>

                    <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Msg_Payload</label>
                       <textarea [(ngModel)]="emailMessage" name="emailMessage" placeholder="COMPOSE_MESSAGE..." class="admin-textarea-dark w-full" rows="10" required minlength="3"></textarea>
                    </div>

                    <button class="w-full py-4 rounded-xl bg-yellow-500 text-black font-black uppercase text-xs tracking-[0.2em] shadow-lg shadow-yellow-500/10 hover:shadow-yellow-500/20 hover:scale-[1.01] transition-all disabled:opacity-50" type="submit" [disabled]="emailSending">
                      {{ emailSending ? 'TRANSMITTING...' : 'EXEC_SEND_CMD' }}
                    </button>
                  </form>
                </div>
              </div>

              <!-- Broadcast -->
              <div class="glass-card flex flex-col h-full border-yellow-500/10">
                <div class="p-6 border-b border-white/5 bg-yellow-500/5">
                   <h3 class="text-sm font-black text-yellow-400 uppercase tracking-widest">Mass_Broadcast_Control</h3>
                   <p class="text-[10px] text-yellow-500/50 uppercase font-bold mt-1">Multi-Node deployment</p>
                </div>
                <div class="p-8 space-y-6 flex-1 bg-yellow-500/[0.01]">
                  <form class="space-y-5" (submit)="broadcastEmail($event)">
                    <div class="space-y-2">
                      <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Target_Audience_Batch</label>
                      <select [(ngModel)]="broadcastAudience" name="broadcastAudience" class="admin-select-dark w-full border-yellow-500/20" required>
                        <option value="users">ALL_STANDARD_USERS</option>
                        <option value="professionals">ALL_REGISTERED_PROS</option>
                      </select>
                    </div>
                    
                    <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Broadcast_Title</label>
                       <input [(ngModel)]="broadcastSubject" name="broadcastSubject" placeholder="GLOBAL_SUBJECT..." class="admin-input-dark w-full border-yellow-500/20" required minlength="3" />
                    </div>

                    <div class="space-y-2">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Global_Payload</label>
                       <textarea [(ngModel)]="broadcastMessage" name="broadcastMessage" placeholder="MASS_CONTENT_INIT..." class="admin-textarea-dark w-full border-yellow-500/20" rows="10" required minlength="3"></textarea>
                    </div>

                    <div class="p-4 rounded-xl bg-orange-500/5 border border-orange-500/20">
                       <p class="text-[10px] font-bold text-orange-400 leading-relaxed uppercase tracking-widest">
                         [WARNING] THIS ACTION WILL TRIGGER AUTO-EMAILS FROM "LA STREET" CORE SYSTEM TO ALL NODES IN SELECTED BATCH. DATA_COST: SCALE_LINEAR.
                       </p>
                    </div>

                    <button class="w-full py-4 rounded-xl bg-white text-black font-black uppercase text-xs tracking-[0.2em] hover:bg-yellow-500 transition-all disabled:opacity-50" type="submit" [disabled]="broadcastSending">
                      {{ broadcastSending ? 'GLOBAL_SYNC_IN_PROGRESS...' : 'INIT_BROADCAST_CMD' }}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- MODALS: PREMIUM IMMERSIVE DESIGN -->
      
      <!-- Professional Details Modal -->
      <div *ngIf="selectedProOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
        <div class="absolute inset-0 bg-black/95 backdrop-blur-xl" (click)="closeProfessional()"></div>
        
        <div class="relative w-full max-w-5xl bg-[#0a0a0a] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-full animate-in zoom-in-95 duration-500">
          <!-- Close Fixed -->
          <button (click)="closeProfessional()" class="absolute top-6 right-8 z-[110] w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all">
             <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>

          <div class="flex-1 overflow-y-auto no-scrollbar">
            <!-- Modal Header / Hero -->
            <div class="relative h-64 md:h-80 w-full bg-gradient-to-br from-slate-900 via-black to-slate-900 border-b border-white/5 overflow-hidden">
               <div class="absolute inset-0 flex items-center justify-center opacity-10 blur-3xl">
                  <div class="w-full h-full bg-yellow-500 rounded-full scale-150 transform"></div>
               </div>
               
               <div class="relative h-full flex items-end p-8 md:p-12">
                  <div class="flex flex-col md:flex-row items-center md:items-end gap-8 w-full">
                    <div class="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-black border-4 border-white/10 shadow-2xl overflow-hidden flex-shrink-0">
                      <img *ngIf="selectedPro.profileImage?.url" [src]="selectedPro.profileImage?.url" class="w-full h-full object-cover" />
                      <div *ngIf="!selectedPro.profileImage?.url" class="w-full h-full flex items-center justify-center text-5xl font-black text-slate-800">{{ selectedPro.name[0] }}</div>
                    </div>
                    <div class="flex-1 text-center md:text-left">
                       <h2 class="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">{{ selectedPro.name }}</h2>
                       <div class="flex flex-wrap items-center justify-center md:justify-start gap-3">
                          <span class="px-3 py-1 rounded-full bg-yellow-500 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-yellow-500/20">{{ tradeLabel(selectedPro) }}</span>
                          <span class="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest">{{ selectedPro.approvalStatus }}</span>
                          <span *ngIf="selectedPro.isPremium" class="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 text-black text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">PREMIUM_ACCOUNT</span>
                       </div>
                    </div>
                  </div>
               </div>
            </div>

            <div class="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <!-- Main Details -->
               <div class="lg:col-span-2 space-y-10">
                  <div class="space-y-4">
                     <h4 class="text-xs font-black text-yellow-500 uppercase tracking-[0.3em]">PRO_BIO / DESCRIPTION</h4>
                     <p class="text-slate-300 text-lg font-medium leading-relaxed">{{ selectedPro.description || 'NOT_PROVIDED: Profile lacks biological data.' }}</p>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div class="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Localisation</span>
                        <p class="text-white font-bold">{{ selectedPro.ville }} • {{ selectedPro.quartier || 'QUARTIER_NON_SPÉC' }}</p>
                     </div>
                     <div class="p-6 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1">
                        <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Connect_Point</span>
                        <p class="text-white font-bold">{{ selectedPro.telephone || 'SECURE_HIDDEN' }}</p>
                        <p *ngIf="selectedPro.whatsapp" class="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Whatsapp: Active</p>
                     </div>
                  </div>

                  <div class="space-y-6" *ngIf="selectedPro.images?.length">
                    <h4 class="text-xs font-black text-yellow-500 uppercase tracking-[0.3em]">VISUAL_PORTFOLIO</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div *ngFor="let img of selectedPro.images" class="aspect-square rounded-2xl bg-black border border-white/5 overflow-hidden group cursor-pointer hover:border-yellow-500/50 transition-all">
                        <img [src]="img.url" class="w-full h-full object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 hover:scale-110" />
                      </div>
                    </div>
                  </div>
               </div>

               <!-- Control Sidebar Modal -->
               <div class="space-y-8">
                  <div class="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10 space-y-6">
                    <h4 class="text-xs font-black text-white uppercase tracking-[0.2em] text-center">SYSTEM_OVERRIDE</h4>
                    
                    <div class="flex flex-col gap-3">
                      <button *ngIf="selectedPro.approvalStatus !== 'approved'" (click)="setStatus(selectedPro, 'approved')"
                        class="w-full py-4 rounded-2xl bg-emerald-500 text-black font-black uppercase text-xs tracking-widest hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/10">
                        ACTIVATE_NODE
                      </button>
                      <button *ngIf="selectedPro.approvalStatus !== 'rejected'" (click)="setStatus(selectedPro, 'rejected')"
                        class="w-full py-4 rounded-2xl bg-white/10 border border-white/10 text-white font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all">
                        BLOCK_TERMINATE
                      </button>
                      <button (click)="deleteProfessional(selectedPro)"
                        class="w-full py-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black uppercase text-xs tracking-widest hover:bg-rose-500 hover:text-white transition-all">
                        PURGE_DB_RECORD
                      </button>
                    </div>

                    <div class="pt-6 border-t border-white/5">
                       <p class="text-[9px] text-slate-500 text-center leading-relaxed">WARNING: Administrative actions are logged. Modifications to nodal status affect global search availability and revenue stream.</p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Proof Modal -->
      <div *ngIf="selectedProofImage" class="fixed inset-0 z-[200] flex items-center justify-center p-4 backdrop-blur-3xl animate-in fade-in duration-300">
        <div class="absolute inset-0 bg-black/90" (click)="selectedProofImage = null"></div>
        <div class="relative max-w-4xl w-full max-h-[85vh] flex flex-col items-center animate-in zoom-in-95 duration-500">
          <button (click)="selectedProofImage = null" class="absolute -top-16 right-0 text-white flex items-center gap-3 font-black uppercase tracking-widest hover:text-yellow-500 transition-colors">
            Exit_View <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          <div class="w-full h-full p-1 bg-gradient-to-br from-yellow-500/50 to-emerald-500/50 rounded-3xl shadow-2xl overflow-hidden">
            <img [src]="selectedProofImage" class="w-full h-full object-contain bg-black rounded-[1.5rem]" alt="Admin Proof Viewer">
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #050505; color: #fff; font-family: 'Inter', sans-serif; }
    
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    /* Nav Styles */
    .nav-item {
      @apply flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-500 font-black uppercase tracking-widest text-[11px] transition-all hover:bg-white/5 hover:text-white;
    }
    .active-nav-item {
      @apply flex items-center gap-4 px-5 py-4 rounded-2xl bg-yellow-500 text-black font-black uppercase tracking-widest text-[11px] shadow-xl shadow-yellow-500/20 transform scale-[1.02];
    }

    /* Cards & Components */
    .glass-card {
      @apply bg-white/[0.03] border border-white/5 backdrop-blur-xl rounded-[2rem] shadow-2xl;
    }

    /* Inputs & Selects */
    .admin-input-search {
      @apply w-full bg-white/[0.03] border border-white/5 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-600 focus:outline-none focus:border-yellow-500/50 transition-all;
    }
    .admin-input-search-dark {
      @apply w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all;
    }
    .admin-select {
      @apply bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2 text-white font-black uppercase text-[10px] tracking-widest outline-none focus:border-yellow-500/50 transition-all;
    }
    .admin-select-dark {
      @apply bg-black border border-white/10 rounded-xl px-4 py-3 text-white font-black uppercase text-[10px] tracking-widest outline-none focus:border-yellow-500/50 transition-all;
    }
    .admin-input-dark {
      @apply w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white font-bold placeholder:text-slate-700 focus:outline-none focus:border-emerald-500/50 transition-all;
    }
    .admin-textarea-dark {
      @apply w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-white font-medium placeholder:text-slate-700 focus:outline-none focus:border-yellow-500/50 transition-all resize-none;
    }

    /* Buttons */
    .admin-btn-emerald {
      @apply bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-emerald-500 hover:text-black transition-all shadow-lg shadow-emerald-500/5;
    }
    .admin-btn-rose {
      @apply bg-rose-500/10 border border-rose-500/20 text-rose-500 font-black uppercase text-[10px] tracking-widest rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/5;
    }
    .admin-action-btn {
      @apply h-9 w-9 rounded-xl border flex items-center justify-center transition-all;
    }
    .admin-pagination-btn {
      @apply w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all disabled:opacity-20;
    }

    /* Animations */
    .animate-bounce-in {
      animation: bounceIn 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
    }
    @keyframes bounceIn {
      0% { opacity: 0; transform: scale(0.3); }
      50% { opacity: 1; transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); }
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
