import { Component, Input, inject, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Professional } from '../../../core/models/professional.model';
import { AuthService } from '../../../core/services/auth.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-professional-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './professional-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfessionalCardComponent {
  statusBadgeClass(s: any) {
    if (s === 'available') return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/25';
    if (s === 'busy') return 'bg-amber-500/10 text-amber-300 border-amber-500/25';
    if (s === 'temporarily_unavailable') return 'bg-rose-500/10 text-rose-300 border-rose-500/25';
    return 'bg-slate-500/10 text-slate-300 border-slate-500/25';
  }

  availabilityLabel(s: any) {
    if (s === 'available') return 'Disponible';
    if (s === 'busy') return 'Occupé';
    if (s === 'temporarily_unavailable') return 'Indispo.';
    return '—';
  }

  @Input({ required: true }) pro!: Professional;

  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly toast = inject(ToastService);
  protected readonly favorites = inject(FavoritesService);
  private readonly cdr = inject(ChangeDetectorRef);

  ratingLoading = false;
  myRating = 0;
  @Input() highlight!: boolean;

  initials() {
    return (this.pro.name || '')
      .split(' ')
      .filter(Boolean)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }

  avatarUrl() {
    const url = this.pro.profileImage?.url || '';
    if (url.includes('cloudinary.com')) {
      return url.replace('/upload/', '/upload/w_200,h_200,c_fill,g_face,f_auto,q_auto/');
    }
    return url;
  }

  tradeLabel() {
    const trades = this.pro.tradeIds || [];
    if (Array.isArray(trades) && trades.length > 0) {
      return trades.map(t => typeof t === 'object' ? t.name : t).join(' · ');
    }
    const t: any = this.pro.tradeId;
    if (t && typeof t === 'object') return t.name || 'Métier';
    return 'Métier';
  }

  stars() {
    return Array(5).fill(0);
  }

  displayRating() {
    return this.myRating || Math.round((this.pro?.rating as any) ?? 0);
  }

  getRatingCount(): number {
    return (this.pro as any).ratingCount || 0;
  }

  rate(v: number) {
    if (!this.pro?._id) return;
    if (!this.auth.isAuthenticated()) {
      this.toast.info('Connexion requise');
      this.router.navigate(['/login']);
      return;
    }

    this.myRating = v;
    this.ratingLoading = true;

    this.api.rateProfessional(this.pro._id, v).subscribe({
      next: (updated: any) => {
        this.pro.rating = updated?.rating ?? this.pro.rating;
        (this.pro as any).ratingCount = updated?.ratingCount ?? (this.pro as any).ratingCount;
        this.toast.success('Merci', 'Note enregistrée');
        this.ratingLoading = false;
        this.cdr.markForCheck();
      },
      error: (e) => {
        const msg = e?.error?.message || e?.message || 'Impossible de noter';
        this.toast.error('Erreur', msg);
        this.myRating = 0;
        this.ratingLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  viewProfile() {
    this.router.navigate(['/professional', this.pro._id]);
  }

  toggleFav() {
    const id = this.pro._id || this.pro.name;
    this.favorites.toggle(id);
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

    const tel = this.pro.telephone;
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

    const tel = this.pro.telephone;
    if (!tel) {
      this.toast.warning('Numéro de téléphone non disponible');
      return;
    }

    const user = this.auth.user() as any;
    const userName = user?.name || 'Un client';
    const userCity = user?.ville || '';
    const userPhone = user?.telephone || '';
    
    const clean = tel.replace(/\s+/g, '').replace(/^\+/, '');
    
    let messageText = `*DEMANDE DE SERVICE - LA STREET*\n\n`;
    messageText += `Bonjour *${this.pro.name}*,\n\n`;
    messageText += `Je suis *${userName}* ${userCity ? '(basé à ' + userCity + ')' : ''}.\n`;
    messageText += `J'ai consulté votre profil de *${this.tradeLabel()}* sur la plateforme *La STREET* et votre expertise m'intéresse vivement.\n\n`;
    messageText += `Seriez-vous disponible pour une intervention ou un devis ?\n\n`;
    if (userPhone) messageText += `Vous pouvez aussi me joindre au : ${userPhone}\n\n`;
    messageText += `Dans l'attente de votre retour.\n\n`;
    messageText += `_— Envoyé via La STREET · Talents du Congo_`;

    const message = encodeURIComponent(messageText);
    window.open(`https://wa.me/${clean}?text=${message}`, '_blank');
  }
}
