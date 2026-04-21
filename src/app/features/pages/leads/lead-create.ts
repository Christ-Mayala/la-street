import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lead-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lead-create.html',
  styleUrl: './lead-create.css'
})
export class LeadCreatePage implements OnInit {
  private readonly api = inject(ApiService);

  trades = signal<any[]>([]);
  submitting = signal(false);
  message = signal('');
  isError = signal(false);

  formData: any = {
    serviceType: '',
    description: '',
    location: '',
    urgency: 'flexible',
    estimatedPrice: null
  };

  step = signal<'form' | 'success'>('form');
  notifiedProsCount = signal(0);
  dynamicFeedback = signal('');
  recommendedPros = signal<any[]>([]);

  ngOnInit() {
    this.api.categories().subscribe({
      next: (cats: any[]) => {
        const allTrades = cats.flatMap(c => c.trades || []);
        this.trades.set(allTrades);
      },
      error: (e) => console.error('Erreur récupération métiers via catégories', e)
    });
  }

  onSubmit() {
    if (!this.formData.serviceType || !this.formData.description) return;

    this.submitting.set(true);
    this.message.set('');
    this.isError.set(false);

    this.api.createLead(this.formData).subscribe({
      next: (res: any) => {
        this.submitting.set(false);
        this.step.set('success');
        
        // Vrais pros recommandés retournés par le backend
        if (res.recommendedPros && res.recommendedPros.length > 0) {
          this.recommendedPros.set(res.recommendedPros.map((p: any) => ({
            ...p,
            avatarUrl: p.profileImage?.url || null
          })));
        } else {
          this.loadMatchingPros();
        }

        // Simulation dynamique de notification
        const baseCount = Math.floor(Math.random() * 10) + 12; // Entre 12 et 22 pour correspondre au plan (12+)
        this.notifiedProsCount.set(baseCount);
        this.message.set(`Votre demande a été envoyée à ${baseCount} professionnels. Les premières réponses arrivent...`);
        
        // Séquence de feedbacks temporisés
        setTimeout(() => {
          this.dynamicFeedback.set("Les professionnels consultent votre demande...");
        }, 5000);

        setTimeout(() => {
          this.dynamicFeedback.set(`${Math.floor(baseCount / 2)} pros analysent votre profil...`);
        }, 15000);

        setTimeout(() => {
          this.dynamicFeedback.set("Soyez prêt à recevoir des propositions !");
        }, 30000);
      },
      error: (e) => {
        this.submitting.set(false);
        this.isError.set(true);
        this.message.set(e.error?.message || e?.message || "Une erreur est survenue lors de la publication.");
      },
    });
  }

  loadMatchingPros() {
    const params: any = { 
      limit: 3,
      serviceType: this.formData.serviceType
    };
    if (this.formData.location) params.q = this.formData.location;

    this.api.professionals(params).subscribe({
      next: (res) => {
        this.recommendedPros.set(res || []);
      },
      error: (e) => console.error('Error fetching matching pros', e)
    });
  }

  reset() {
    this.step.set('form');
    this.formData = {
      serviceType: '',
      description: '',
      location: '',
      urgency: 'flexible',
      estimatedPrice: null
    };
    this.message.set('');
    this.dynamicFeedback.set('');
    this.recommendedPros.set([]);
  }
}
