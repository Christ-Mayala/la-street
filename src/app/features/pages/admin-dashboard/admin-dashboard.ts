import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
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
              <div *ngFor="let p of filteredPros" class="flex items-center justify-between p-3 border rounded">
                <div>
                  <div class="font-medium">{{ p.name }} <span class="text-xs text-slate-500">({{ p.approvalStatus }})</span></div>
                  <div class="text-sm text-slate-300">{{ tradeLabel(p) }} · {{ p.ville }}<span *ngIf="p.quartier"> · {{ p.quartier }}</span></div>
                </div>
                <div class="flex gap-2">
                  <button *ngIf="p.approvalStatus!=='approved'" class="btn-primary" (click)="setStatus(p, 'approved')">Approuver</button>
                  <button *ngIf="p.approvalStatus!=='rejected'" class="btn-outline" (click)="setStatus(p, 'rejected')">Rejeter</button>
                  <button class="btn-outline" (click)="deleteProfessional(p)">Supprimer</button>
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
                <div *ngFor="let u of filteredUsers" class="flex items-center justify-between p-2 border rounded">
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
            <div *ngFor="let r of filteredReports" class="p-3 border rounded">
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
                <button class="btn-outline" (click)="decide(r, 'keep')" [disabled]="r.status!=='open'">Garder</button>
                <button class="btn-primary" (click)="decide(r, 'delete')" [disabled]="r.status!=='open'">Supprimer user</button>
              </div>
            </div>
            <div *ngIf="reports.length===0" class="text-sm text-slate-300">Aucun signalement.</div>
          </div>
        </div>

      </div>
    </section>
  `,
})
export class AdminDashboardPage {
  private readonly api = inject(ApiService);
  private readonly seo = inject(SeoService);

  pros: Professional[] = [];
  users: any[] = [];
  reports: any[] = [];
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

  decide(r: any, decision: 'keep' | 'delete') {
    if (!r?._id) return;
    if (!confirm(`${decision === 'delete' ? 'Supprimer' : 'Garder'} l'utilisateur signalé ?`)) return;

    const note = prompt('Note (optionnel)') || '';
    this.api.adminReportDecision(r._id, { decision, note: note || undefined }).subscribe({
      next: () => this.reload(),
      error: (e) => (this.error = e?.message || 'Erreur décision signalement'),
    });
  }

  setStatus(p: Professional, s: 'pending' | 'approved' | 'rejected') {
    if (!p._id) return;
    this.api.adminUpdateProfessionalStatus(p._id, s).subscribe({
      next: (updated) => {
        p.approvalStatus = updated.approvalStatus;
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
}
