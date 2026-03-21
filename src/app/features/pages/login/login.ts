import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  email = '';
  password = '';
  loading = false;
  error = '';
  showPassword = false;

  private scrollToTop() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  constructor() {
    this.seo.setTitle('Connexion · La STREET');
    this.seo.updateTags({
      description: 'Connectez-vous à votre compte La STREET pour accéder à toutes les fonctionnalités de la plateforme.'
    });

    const u = this.auth.user();
    if (String(u?.role || '').toLowerCase() === 'admin') this.router.navigate(['/admin']);
    else if (u?.token) this.router.navigate(['/']);
  }

  async onLogin() {
    this.error = '';
    this.loading = true;
    try {
      const u = await this.auth.login(this.email, this.password);
      this.toast.success('Bienvenue', `Bonjour ${u?.name || ''}`.trim());
      if (String(u?.role || '').toLowerCase() === 'admin') this.router.navigate(['/admin']);
      else this.router.navigate(['/']);
    } catch (e: any) {
      this.error = e?.message || 'Email ou mot de passe incorrect';
      this.toast.error('Erreur', this.error);
      this.scrollToTop();
    } finally {
      this.loading = false;
    }
  }
}
