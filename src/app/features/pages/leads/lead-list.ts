import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Lead } from '../../../core/models/lead.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lead-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.css'
})
export class LeadListPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);

  leads = signal<Lead[]>([]);
  loading = signal(true);
  trades = signal<any[]>([]);
  selectedTrade = '';
  user = this.auth.user;

  ngOnInit() {
    this.loadTrades();
    this.loadLeads();
  }

  isPrestataire(): boolean {
    const u = this.user();
    return u?.subtype === 'prestataire' || u?.role === 'professional' || u?.role === 'prestataire' || u?.role === 'admin';
  }

  loadTrades() {
    this.api.categories().subscribe({
      next: (categories) => {
        const allTrades: any[] = [];
        categories.forEach(cat => {
          if (cat.trades) allTrades.push(...cat.trades);
        });
        this.trades.set(allTrades.sort((a, b) => a.name.localeCompare(b.name)));
      },
      error: (e) => console.error(e),
    });
  }

  loadLeads() {
    this.loading.set(true);
    const params: any = {};
    if (this.selectedTrade) params.serviceType = this.selectedTrade;

    this.api.leads(params).subscribe({
      next: (res) => {
        this.leads.set(res.items);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.loading.set(false);
      },
    });
  }
}
