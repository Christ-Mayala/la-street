import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-payment-process',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-process.html'
})
export class PaymentProcessPage {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);
  private toast = inject(ToastService);
  private seo = inject(SeoService);

  plan: string = 'standard';
  leadId: string | null = null;
  proofMode: 'code' | 'image' = 'code';
  transactionCode: string = '';
  amount: string = '';
  
  selectedFile: File | null = null;
  uploadedImageUrl = signal<string | null>(null);
  
  isSubmitting = signal(false);

  constructor() {
    this.seo.setTitle('Paiement · La STREET');
    this.route.queryParams.subscribe(params => {
      if (params['plan']) this.plan = params['plan'];
      if (params['leadId']) this.leadId = params['leadId'];
      this.amount = this.getAmount();
    });
  }

  planLabel(): string {
    const labels: Record<string, string> = {
      starter: 'Starter', standard: 'Standard', premium: 'Premium', 'pay-per-lead': 'Pay-Per-Lead'
    };
    return labels[this.plan] || this.plan;
  }

  getAmount(): string {
    const prices: Record<string, string> = {
      starter: '2000', standard: '5000', premium: '10000', 'pay-per-lead': '500'
    };
    return prices[this.plan] || '5000';
  }

  hasValidProof(): boolean {
    if (this.proofMode === 'code') return this.transactionCode.trim().length >= 4;
    return !!this.selectedFile;
  }

  copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.toast.success('Copié !', 'Numéro copié dans le presse-papier.');
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        this.toast.error('Erreur', 'L\'image est trop lourde (max 10Mo)');
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => this.uploadedImageUrl.set(e.target.result);
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.uploadedImageUrl.set(null);
  }

  goBack() {
    if (this.plan === 'pay-per-lead' && this.leadId) {
      this.router.navigate(['/leads', this.leadId]);
    } else {
      this.router.navigate(['/pricing']);
    }
  }

  submitRequest() {
    if (!this.hasValidProof()) {
      this.toast.error('Erreur', 'Veuillez fournir un code de transaction ou une capture d\'écran.');
      return;
    }

    this.isSubmitting.set(true);

    const formData = new FormData();
    formData.append('amount', this.amount);
    if (this.proofMode === 'code') {
      formData.append('transactionCode', this.transactionCode.trim());
    } else if (this.selectedFile) {
      formData.append('proofImage', this.selectedFile);
    }

    if (this.plan === 'pay-per-lead' && this.leadId) {
      formData.append('leadId', this.leadId);
      this.api.unlockLead(formData).subscribe({
        next: () => {
          this.toast.success('Demande reçue !', 'Un admin validera votre paiement. La mission sera débloquée sous 24h.');
          this.router.navigate(['/leads', this.leadId]);
        },
        error: (err) => {
          this.toast.error('Erreur', err.message || 'Une erreur est survenue.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      formData.append('plan', this.plan);
      if (this.leadId) formData.append('leadId', this.leadId);
      
      this.api.requestSubscription(formData).subscribe({
        next: () => {
          this.toast.success('Demande reçue !', 'Un admin vérifiera votre paiement et activera votre compte sous 24h.');
          this.router.navigate(['/leads']);
        },
        error: (err) => {
          this.toast.error('Erreur', err.message || 'Une erreur est survenue.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}
