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
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  trades = signal<any[]>([]);
  submitting = signal(false);
  message = signal('');
  isError = signal(false);

  formData: any = {
    serviceType: '',
    description: '',
    location: '',
    estimatedPrice: null
  };

  ngOnInit() {
    this.loadTrades();
  }

  loadTrades() {
    this.api.categories().subscribe({
      next: (categories) => {
        // Extraire tous les trades (métiers) pour la sélection
        const allTrades: any[] = [];
        categories.forEach(cat => {
          if (cat.trades && Array.isArray(cat.trades)) {
            allTrades.push(...cat.trades);
          }
        });
        // Trier par nom
        const sorted = allTrades.sort((a, b) => a.name.localeCompare(b.name));
        this.trades.set(sorted);
      },
      error: (e) => console.error('Erreur chargement métiers', e),
    });
  }

  onSubmit() {
    if (!this.formData.serviceType || !this.formData.description) return;

    this.submitting.set(true);
    this.message.set('');
    this.isError.set(false);

    this.api.createLead(this.formData).subscribe({
      next: () => {
        this.message.set('Votre demande a été publiée avec succès !');
        setTimeout(() => this.router.navigate(['/']), 2000);
      },
      error: (e) => {
        this.isError.set(true);
        this.message.set(e?.message || 'Une erreur est survenue lors de la publication.');
        this.submitting.set(false);
      },
    });
  }
}
