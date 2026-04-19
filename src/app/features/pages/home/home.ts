import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import { Professional } from '../../../core/models/professional.model';
import { ProfessionalCardComponent } from '../../../shared/components/professional-card/professional-card';
import { SeoService } from '../../../core/services/seo.service';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';
import { SiteStatsService } from '../../../core/services/site-stats.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ProfessionalCardComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomePage implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly api = inject(ApiService);
  private readonly auth = inject(AuthService);
  private readonly stats = inject(SiteStatsService);
  private readonly seo = inject(SeoService);

  private authSubscription?: Subscription;
  private modalTimer?: any;

  q = '';
  ville = '';
  loadingPros = signal(true);
  loadingRecommended = signal(true);
  totalProfessionals = 0;
  totalTrades = 0;
  totalCities = 0;
  showAuthModal = false;

  readonly pros = signal<Professional[]>([]);
  readonly recommended = signal<Professional[]>([]);
  readonly categories = signal<any[]>([]);
  readonly isLoggedIn = signal<boolean>(false);
  readonly isNotificationHidden = signal<boolean>(false);
  readonly isModalDismissed = signal<boolean>(false);
  error = signal('');

  ngOnInit() {
    // Vérifier l'état d'authentification initial
    this.isLoggedIn.set(!!this.auth.user());

    // S'abonner aux changements d'authentification
    this.authSubscription = this.auth.user$.subscribe(user => {
      this.isLoggedIn.set(!!user);

      // Si l'utilisateur se connecte, fermer toutes les modales et notifications
      if (user) {
        this.showAuthModal = false;
        this.isNotificationHidden.set(true);
        this.dismissModal();
      }
    });

    // Charger les préférences stockées
    this.loadPreferences();

    // Vérifier si l'utilisateur est admin
    const user = this.auth.user();
    if (user?.role?.toLowerCase() === 'admin') {
      this.router.navigate(['/admin']);
      return;
    }

    this.loadRecommended();
    this.loadProfessionals();
    this.loadStats();
    this.loadCategories();

    // Configuration SEO
    this.seo.setTitle('La STREET · Plateforme des métiers');
    this.seo.updateTags({
      description: 'La STREET connecte les habitants à des professionnels par métier et localité en République du Congo.'
    });

    // Afficher la modale après 10 secondes seulement si l'utilisateur n'est pas connecté
    // et n'a pas déjà choisi de ne plus la voir
    if (!this.isLoggedIn() && !this.isModalDismissed()) {
      this.modalTimer = setTimeout(() => {
        this.showAuthModal = true;
      }, 10000);
    }
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
    if (this.modalTimer) {
      clearTimeout(this.modalTimer);
    }
  }

  private loadPreferences() {
    const notificationHidden = localStorage.getItem('home_notification_hidden');
    const modalDismissed = localStorage.getItem('home_modal_dismissed');

    if (notificationHidden === 'true') {
      this.isNotificationHidden.set(true);
    }

    if (modalDismissed === 'true') {
      this.isModalDismissed.set(true);
    }
  }

  private savePreferences() {
    localStorage.setItem('home_notification_hidden', this.isNotificationHidden().toString());
    localStorage.setItem('home_modal_dismissed', this.isModalDismissed().toString());
  }

  private loadStats() {
    this.stats.counts().subscribe({
      next: (c) => {
        this.totalCities = c?.totalCities || 0;
        this.totalTrades = c?.totalTrades || 0;
        if (!this.totalProfessionals) this.totalProfessionals = c?.totalProfessionals || 0;
      },
      error: () => {
        // Valeurs par défaut en cas d'erreur
        this.totalCities = 15;
        this.totalTrades = 50;
        this.totalProfessionals = this.pros().length;
      }
    });
  }

  loadRecommended() {
    this.loadingRecommended.set(true);
    this.api.recommendations({ limit: 6 }).subscribe({
      next: (list) => {
        const highRated = (list || []).filter(pro => {
          const rating = pro.rating || 0;
          return rating >= 4;
        });
        this.recommended.set(highRated);
        this.loadingRecommended.set(false);
      },
      error: () => {
        this.recommended.set([]);
        this.loadingRecommended.set(false);
      },
    });
  }

  loadProfessionals() {
    this.loadingPros.set(true);
    this.error.set('');
    this.api.professionalsPaged({ page: 1, limit: 50 }).subscribe({
      next: (r) => {
        const items = r?.items || [];
        this.pros.set(items);
        this.totalProfessionals = r?.total || 0;
        this.loadingPros.set(false);
      },
      error: (e) => {
        this.error.set(e?.message || 'Erreur lors du chargement des profils');
        this.pros.set([]);
        this.loadingPros.set(false);
      },
    });
  }

  loadCategories() {
    this.api.categories().subscribe({
      next: (list) => {
        // Obtenir seulement les 6 premières catégories pour l'affichage Home
        this.categories.set((list || []).slice(0, 6));
      },
      error: () => this.categories.set([])
    });
  }

  getLastThreeProfessionals(): Professional[] {
    return this.pros().slice(0, 3);
  }

  retryLoading() {
    this.loadProfessionals();
    this.loadRecommended();
  }

  onSearch() {
    const query: any = {};
    if (this.q.trim()) query.q = this.q.trim();
    if (this.ville.trim()) query.ville = this.ville.trim();
    this.router.navigate(['/search'], { queryParams: query });
  }

  hideNotificationBar() {
    this.isNotificationHidden.set(true);
    this.savePreferences();
  }

  closeModal() {
    this.showAuthModal = false;
  }

  dismissModal() {
    this.closeModal();
    this.isModalDismissed.set(true);
    this.savePreferences();
  }

  toggleModalDismiss(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.isModalDismissed.set(checked);
    this.savePreferences();

    if (checked) {
      this.closeModal();
    }
  }

  scrollToContent() {
    const element = document.getElementById('main-content');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
