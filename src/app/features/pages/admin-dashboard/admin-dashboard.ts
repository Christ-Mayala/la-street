import { Component, inject } from '@angular/core';
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
    <section class="container py-8">
      <div class="max-w-6xl mx-auto">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold">Tableau de bord admin</h1>
          <div class="flex gap-2">
            <button class="btn-outline" (click)="reload()">Rafraîchir</button>
          </div>
        </div>

        <div *ngIf="error" class="mt-4 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ error }}</div>

        <div class="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div class="card p-4 text-center">
            <div class="text-sm text-slate-300">Professionnels</div>
            <div class="text-2xl font-bold">{{ stats.professionals || 0 }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-sm text-slate-500">En attente</div>
            <div class="text-2xl font-bold">{{ stats.pending || 0 }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-sm text-slate-500">Approuvés</div>
            <div class="text-2xl font-bold">{{ stats.approved || 0 }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-sm text-slate-500">Rejetés</div>
            <div class="text-2xl font-bold">{{ stats.rejected || 0 }}</div>
          </div>
          <div class="card p-4 text-center">
            <div class="text-sm text-slate-500">Utilisateurs</div>
            <div class="text-2xl font-bold">{{ stats.users || 0 }}</div>
          </div>
        </div>

        <div class="mt-6 overflow-x-auto">
          <div class="inline-flex gap-2 p-1 rounded-xl border border-slate-800 bg-black/20">
            <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" [class]="activeTab==='users' ? 'bg-yellow-500 text-black' : 'text-slate-200 hover:bg-slate-800/50'" (click)="activeTab='users'">Users</button>
            <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" [class]="activeTab==='pros' ? 'bg-yellow-500 text-black' : 'text-slate-200 hover:bg-slate-800/50'" (click)="activeTab='pros'">Pros</button>
            <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" [class]="activeTab==='reports' ? 'bg-yellow-500 text-black' : 'text-slate-200 hover:bg-slate-800/50'" (click)="activeTab='reports'">Reports</button>
            <button type="button" class="px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap" [class]="activeTab==='email' ? 'bg-yellow-500 text-black' : 'text-slate-200 hover:bg-slate-800/50'" (click)="activeTab='email'; ensureEmailRecipients()">Email</button>
          </div>
        </div>

        <div class="mt-4">
          <div *ngIf="activeTab==='pros'" class="card p-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 class="font-semibold">Professionnels <span *ngIf="prosLoading" class="ml-2 inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span></h3>
              <div class="flex gap-2">
                <select class="input-modern !py-1 !rounded-lg" [(ngModel)]="proStatusFilter" name="proStatusFilter" (change)="reloadPros()">
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
                <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="proSearch" name="proSearch" placeholder="Rechercher..." />
              </div>
            </div>
            <div *ngIf="prosError" class="mt-3 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ prosError }}</div>
            <div *ngIf="prosLoading" class="mt-3 text-sm text-slate-300">Chargement des professionnels...</div>
            <div class="mt-3 space-y-3">
              <div *ngFor="let p of filteredPros; trackBy: trackByEntity" class="p-3 rounded-xl border border-slate-800 bg-black/20">
                <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div class="flex items-start gap-3 min-w-0">
                    <div class="h-14 w-14 rounded-full overflow-hidden border border-yellow-400/25 bg-black/40 flex items-center justify-center shrink-0">
                      <img *ngIf="p.profileImage?.url" [src]="p.profileImage?.url" alt="" class="h-full w-full object-cover bg-black/40" loading="lazy" decoding="async" />
                      <span *ngIf="!p.profileImage?.url" class="text-yellow-300 font-bold">{{ (p.name || '?').slice(0, 1) }}</span>
                    </div>
                    <div class="min-w-0">
                      <div class="font-medium text-white clamp-2 text-anywhere">
                        {{ p.name }} <span class="text-xs text-slate-500">({{ p.approvalStatus }})</span>
                      </div>
                      <div class="text-sm text-slate-300 clamp-2 text-anywhere">
                        {{ tradeLabel(p) }} · {{ p.ville }}<span *ngIf="p.quartier"> · {{ p.quartier }}</span>
                      </div>
                      <button type="button" class="mt-2 text-sm text-primary hover:underline" (click)="openProfessional(p)">
                        Voir les infos complètes
                      </button>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-2">
                    <button class="btn-outline" (click)="openProfessional(p)" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Voir' }}</button>
                    <button *ngIf="p.approvalStatus!=='approved'" class="btn-primary" (click)="setStatus(p, 'approved')" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Approuver' }}</button>
                    <button *ngIf="p.approvalStatus!=='rejected'" class="btn-outline" (click)="setStatus(p, 'rejected')" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Rejeter' }}</button>
                    <button class="btn-outline" (click)="deleteProfessional(p)" [disabled]="isProActing(p)">{{ isProActing(p) ? '...' : 'Supprimer' }}</button>
                  </div>
                </div>
              </div>
              <div *ngIf="pros.length===0" class="text-sm text-slate-300">Aucun professionnel.</div>
            </div>
          </div>

          <div *ngIf="activeTab==='users'" class="card p-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 class="font-semibold">Utilisateurs <span *ngIf="usersLoading" class="ml-2 inline-block h-3 w-3 rounded-full border border-yellow-400/30 border-t-yellow-400 animate-spin"></span></h3>
              <div class="flex gap-2">
                <select class="input-modern !py-1 !rounded-lg" [(ngModel)]="userStatusFilter" name="userStatusFilter" (change)="reloadUsers()">
                  <option value="active">Actifs</option>
                  <option value="inactive">Désactivés</option>
                  <option value="deleted">Supprimés</option>
                  <option value="all">Tous</option>
                </select>
                <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="userSearch" name="userSearch" placeholder="Rechercher..." (input)="reloadUsers()" />
              </div>
            </div>
            <div *ngIf="usersError" class="mt-3 p-3 rounded border border-red-500/30 bg-red-500/10 text-red-200 text-sm">{{ usersError }}</div>
            <div *ngIf="usersLoading" class="mt-3 text-sm text-slate-300">Chargement des utilisateurs...</div>
            <div class="mt-3">
              <form class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3" (submit)="createUser($event)">
                <input [(ngModel)]="newUserName" name="newUserName" placeholder="Nom" class="input-modern !py-2 !rounded-lg" required />
                <input [(ngModel)]="newUserEmail" name="newUserEmail" placeholder="Email" class="input-modern !py-2 !rounded-lg" required />
                <input [(ngModel)]="newUserPassword" name="newUserPassword" placeholder="Mot de passe" type="password" class="input-modern !py-2 !rounded-lg" required minlength="6" />
                <select [(ngModel)]="newUserRole" name="newUserRole" class="input-modern !py-2 !rounded-lg">
                  <option value="user">User</option>
                  <option value="professional">Professionnel</option>
                  <option value="admin">Admin</option>
                </select>
                <input [(ngModel)]="newUserTelephone" name="newUserTelephone" placeholder="Téléphone (optionnel)" class="input-modern !py-2 !rounded-lg md:col-span-2" />
                <button class="btn-primary md:col-span-2" type="submit" [disabled]="createUserLoading">{{ createUserLoading ? 'Création...' : 'Créer' }}</button>
              </form>

              <div class="space-y-2">
                <div *ngFor="let u of filteredUsers; trackBy: trackByEntity" class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div class="font-medium">{{ u.name }}</div>
                    <div class="text-xs text-slate-400">{{ u.email }} · {{ u.role }}<span *ngIf="u.telephone"> · {{ u.telephone }}</span></div>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button class="btn-outline" type="button" (click)="prefillEmail(u)" [disabled]="isUserActing(u)">{{ isUserActing(u) ? '...' : 'Email' }}</button>
                    <button *ngIf="(u.status||'') !== 'inactive' && !(u.deleted===true || u.status==='deleted')" class="btn-outline" type="button" (click)="setUserStatus(u, 'inactive')" [disabled]="isUserActing(u)">{{ isUserActing(u) ? '...' : 'Désactiver' }}</button>
                    <button *ngIf="(u.status||'') === 'inactive'" class="btn-outline" type="button" (click)="setUserStatus(u, 'active')" [disabled]="isUserActing(u)">{{ isUserActing(u) ? '...' : 'Activer' }}</button>
                    <button *ngIf="(u.deleted===true || u.status==='deleted')" class="btn-outline" type="button" (click)="restoreUser(u)" [disabled]="isUserActing(u)">{{ isUserActing(u) ? '...' : 'Restaurer' }}</button>
                    <button *ngIf="!(u.deleted===true || u.status==='deleted')" class="btn-outline" type="button" (click)="deleteUser(u)" [disabled]="isUserActing(u)">{{ isUserActing(u) ? '...' : 'Supprimer' }}</button>
                  </div>
                </div>
                <div *ngIf="users.length===0" class="text-sm text-slate-300">Aucun utilisateur.</div>
              </div>

              <div class="mt-4 p-3 rounded-xl border border-slate-800 bg-black/20 text-sm text-slate-300">
                Onglet <span class="text-yellow-300 font-semibold">Email</span> pour envoyer des messages (individuel ou broadcast).
              </div>
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

        <!-- Boutons normaux sur desktop -->
        <div class="hidden md:block">
          <div *ngIf="selectedProOpen" class="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" (click)="closeProfessional()"></div>
        </div>
    </section>
  `,
  styles: [`
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
export class AdminDashboardPage {
  // Dashboard admin: gestion pros, utilisateurs et signalements.
  // Objectif: actions cohérentes (suppression -> disparition immédiate) + messages d'erreur lisibles.
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  activeTab: 'users' | 'pros' | 'reports' | 'email' = 'users';

  selectedProOpen = false;
  selectedProLoading = false;
  selectedProError = '';
  selectedPro: any = null;
  private readonly viewedPros = new Set<string>();

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
    return this.users;
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

    this.reloadStats();
    this.reloadPros();
    this.reloadUsers();
    this.reloadReports();
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

  reloadUsers() {
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

  closeProfessional() {
    this.selectedProOpen = false;
    this.selectedProLoading = false;
    this.selectedProError = '';
    this.selectedPro = null;
  }
}
