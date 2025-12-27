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

        <div class="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div class="card p-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h3 class="font-semibold">Professionnels</h3>
              <div class="flex gap-2">
                <select class="input-modern !py-1 !rounded-lg" [(ngModel)]="proStatusFilter" name="proStatusFilter" (change)="reloadPros()">
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvés</option>
                  <option value="rejected">Rejetés</option>
                </select>
                <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="proSearch" name="proSearch" placeholder="Rechercher..." />
              </div>
            </div>
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
                    <button class="btn-outline" (click)="openProfessional(p)">Voir</button>
                    <button *ngIf="p.approvalStatus!=='approved'" class="btn-primary" (click)="setStatus(p, 'approved')">Approuver</button>
                    <button *ngIf="p.approvalStatus!=='rejected'" class="btn-outline" (click)="setStatus(p, 'rejected')">Rejeter</button>
                    <button class="btn-outline" (click)="deleteProfessional(p)">Supprimer</button>
                  </div>
                </div>
              </div>
              <div *ngIf="pros.length===0" class="text-sm text-slate-300">Aucun professionnel.</div>
            </div>
          </div>

          <div class="card p-4">
            <div class="flex items-center justify-between gap-3">
              <h3 class="font-semibold">Utilisateurs</h3>
              <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="userSearch" name="userSearch" placeholder="Rechercher..." />
            </div>
            <div class="mt-3">
              <form class="grid grid-cols-1 md:grid-cols-4 gap-2 mb-3" (submit)="createUser($event)">
                <input [(ngModel)]="newUserName" name="newUserName" placeholder="Nom" class="rounded border px-2 py-1" required />
                <input [(ngModel)]="newUserEmail" name="newUserEmail" placeholder="Email" class="rounded border px-2 py-1" required />
                <input [(ngModel)]="newUserPassword" name="newUserPassword" placeholder="Mot de passe" type="password" class="rounded border px-2 py-1" required minlength="6" />
                <select [(ngModel)]="newUserRole" name="newUserRole" class="rounded border px-2 py-1">
                  <option value="user">User</option>
                  <option value="professional">Professionnel</option>
                  <option value="admin">Admin</option>
                </select>
                <input [(ngModel)]="newUserTelephone" name="newUserTelephone" placeholder="Téléphone (optionnel)" class="rounded border px-2 py-1 md:col-span-2" />
                <button class="btn-primary md:col-span-2" type="submit">Créer</button>
              </form>

              <div class="space-y-2">
                <div *ngFor="let u of filteredUsers; trackBy: trackByEntity" class="flex items-center justify-between p-2 border rounded">
                  <div>
                    <div class="font-medium">{{ u.name }}</div>
                    <div class="text-xs text-slate-400">{{ u.email }} · {{ u.role }}<span *ngIf="u.telephone"> · {{ u.telephone }}</span></div>
                  </div>
                  <div class="flex gap-2">
                    <button class="btn-outline" (click)="deleteUser(u)">Supprimer</button>
                  </div>
                </div>
                <div *ngIf="users.length===0" class="text-sm text-slate-300">Aucun utilisateur.</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 card p-4">
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 class="font-semibold">Signalements</h3>
            <div class="flex gap-2">
              <select class="input-modern !py-1 !rounded-lg" [(ngModel)]="reportStatusFilter" name="reportStatusFilter" (change)="reloadReports()">
                <option value="open">Ouverts</option>
                <option value="resolved">Traités</option>
              </select>
              <input class="input-modern !py-1 !rounded-lg" [(ngModel)]="reportSearch" name="reportSearch" placeholder="Rechercher..." />
              <button class="btn-outline" (click)="reloadReports()">Rafraîchir</button>
            </div>
          </div>
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


        <div *ngIf="selectedProOpen" class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-3xl bg-black/90 rounded-2xl border border-slate-800 shadow-2xl">
            <div class="flex items-center justify-between p-5 border-b border-slate-800">
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

            <div class="p-5">
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

                  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 pt-2">
                    <button type="button" class="btn-outline" (click)="closeProfessional()">Fermer</button>
                    <button *ngIf="selectedPro.approvalStatus !== 'approved'" type="button" class="btn-primary" (click)="setStatus(selectedPro, 'approved')">Approuver</button>
                    <button *ngIf="selectedPro.approvalStatus !== 'rejected'" type="button" class="btn-outline" (click)="setStatus(selectedPro, 'rejected')">Rejeter</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class AdminDashboardPage {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  selectedProOpen = false;
  selectedProLoading = false;
  selectedProError = '';
  selectedPro: any = null;
  private readonly viewedPros = new Set<string>();

  trackByEntity = (_: number, x: any) => x?._id || x?.id || x?.email || x?.name || _;
  trackByImg = (_: number, x: any) => x?.public_id || x?.url || _;

  pros: Professional[] = [];
  users: any[] = [];
  reports: any[] = [];
  private readonly decidingReports = new Set<string>();
  stats: any = { professionals: 0, pending: 0, approved: 0, rejected: 0, users: 0 };

  proStatusFilter: 'pending' | 'approved' | 'rejected' = 'pending';
  proSearch = '';
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
    const q = (this.userSearch || '').toLowerCase().trim();
    if (!q) return this.users;
    return (this.users || []).filter((u: any) =>
      String(u?.name || '').toLowerCase().includes(q) ||
      String(u?.email || '').toLowerCase().includes(q) ||
      String(u?.telephone || '').toLowerCase().includes(q) ||
      String(u?.role || '').toLowerCase().includes(q)
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

    this.api.adminStats().subscribe({
      next: (s) => (this.stats = s || this.stats),
      error: (e) => (this.error = e?.message || 'Erreur chargement stats'),
    });

    this.reloadPros();

    this.api.adminUsers().subscribe({
      next: (r) => (this.users = r.items || []),
      error: (e) => (this.error = e?.message || 'Erreur chargement utilisateurs'),
    });

    this.reloadReports();
  }

  reloadPros() {
    this.api.adminProfessionals({ approvalStatus: this.proStatusFilter }).subscribe({
      next: (r) => (this.pros = r.items || []),
      error: (e) => (this.error = e?.message || 'Erreur chargement professionnels'),
    });
  }

  reloadReports() {
    this.api.adminReports({ status: this.reportStatusFilter, limit: 80 }).subscribe({
      next: (r) => (this.reports = r.items || []),
      error: () => (this.reports = []),
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
        this.reload();
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Erreur décision signalement';
        this.error = msg;
        this.toast.error('Erreur', msg);
        this.decidingReports.delete(id);
      },
    });
  }

  setStatus(p: Professional, s: 'pending' | 'approved' | 'rejected') {
    if (!p._id) return;

    if (s === 'approved' && !this.viewedPros.has(p._id)) {
      this.error = 'Ouvrez les détails du professionnel avant d\'approuver.';
      this.openProfessional(p);
      return;
    }

    this.api.adminUpdateProfessionalStatus(p._id, s).subscribe({
      next: (updated) => {
        p.approvalStatus = updated.approvalStatus;
        if (this.selectedPro?._id === p._id) {
          this.selectedPro = { ...this.selectedPro, approvalStatus: updated.approvalStatus };
        }
        this.reload();
      },
      error: (e) => (this.error = e?.message || 'Erreur update status'),
    });
  }

  deleteProfessional(p: Professional) {
    if (!p._id) return;
    if (!confirm(`Supprimer ${p.name} ?`)) return;
    this.api.adminDeleteProfessional(p._id).subscribe({
      next: () => this.reload(),
      error: (e) => (this.error = e?.message || 'Erreur suppression'),
    });
  }

  createUser(ev: Event) {
    ev.preventDefault();
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
          this.reload();
        },
        error: (e) => (this.error = e?.message || 'Erreur création user'),
      });
  }

  deleteUser(u: any) {
    if (!u?._id) return;
    if (!confirm(`Supprimer utilisateur ${u.name} ?`)) return;
    this.api.adminDeleteUser(u._id).subscribe({
      next: () => this.reload(),
      error: (e) => (this.error = e?.message || 'Erreur suppression user'),
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
