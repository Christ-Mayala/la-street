import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-lead-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  templateUrl: './lead-detail.html',
  styleUrl: './lead-detail.css'
})
export class LeadDetailPage implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private seo = inject(SeoService);

  lead = signal<any>(null);
  isLoading = signal(true);
  isSubmitting = signal(false);

  responseMessage: string = '';

  get user() { return this.auth.user(); }

  /** Un prestataire est toute personne avec subtype = 'prestataire' ou role professional/prestataire */
  isPrestataire(): boolean {
    const u = this.user;
    return u?.subtype === 'prestataire'
      || u?.role === 'professional'
      || u?.role === 'prestataire'
      || u?.role === 'admin';
  }

  /** Nettoyage du numéro pour WhatsApp (supprime les espaces et le 0 initial) */
  cleanPhone(phone?: string): string {
    if (!phone) return '';
    return phone.replace(/\s+/g, '').replace(/^0/, '242');
  }

  whatsappLink(): string {
    const phone = this.cleanPhone(this.lead()?.userId?.telephone);
    const msg = encodeURIComponent(`Bonjour, j'ai vu votre demande sur La STREET concernant "${this.lead()?.serviceType}". Je suis disponible pour cette mission.`);
    return `https://wa.me/${phone}?text=${msg}`;
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadLead(id);
  }

  loadLead(id: string) {
    this.isLoading.set(true);
    this.api.getLead(id).subscribe({
      next: (data) => {
        this.lead.set(data);
        this.seo.setTitle(`${data.serviceType} · La STREET`);
        this.isLoading.set(false);
      },
      error: () => {
        this.toast.error('Erreur', 'Impossible de charger la mission');
        this.isLoading.set(false);
      }
    });
  }

  submitResponse() {
    if (!this.responseMessage.trim()) return;
    this.isSubmitting.set(true);
    this.api.respondToLead(this.lead()._id, this.responseMessage).subscribe({
      next: () => {
        this.toast.success('Envoyé !', 'Votre proposition est enregistrée.');
        this.responseMessage = '';
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toast.error('Erreur', err.message || 'Une erreur est survenue.');
        this.isSubmitting.set(false);
      }
    });
  }
}
