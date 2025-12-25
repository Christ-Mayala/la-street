import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-14 md:py-16">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <span class="text-sm font-medium text-yellow-300">Données & Confidentialité</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Politique de <span class="text-yellow-400">confidentialité</span>
          </h1>
          <p class="mt-4 text-lg text-slate-300">
            Dernière mise à jour : 25 décembre 2025
          </p>
        </div>
      </div>
    </section>

    <main class="container py-10 md:py-14">
      <div class="max-w-4xl mx-auto">
        <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8">
          <div class="prose prose-invert prose-slate max-w-none">
            <p>
              Cette politique décrit comment La STREET collecte, utilise et protège vos informations.
              Elle est susceptible d'évoluer en fonction des fonctionnalités.
            </p>

            <h2>1. Données collectées</h2>
            <ul>
              <li>Données de compte : nom, email, téléphone, rôle.</li>
              <li>Données de profil professionnel : localisation, métier, description, photos.</li>
              <li>Données techniques : informations de navigation et journaux techniques (sécurité, performance).</li>
            </ul>

            <h2>2. Utilisation des données</h2>
            <ul>
              <li>Créer et gérer votre compte.</li>
              <li>Afficher les profils et faciliter la mise en relation.</li>
              <li>Prévenir les abus, améliorer la qualité et la sécurité du service.</li>
            </ul>

            <h2>3. Partage</h2>
            <p>
              Les informations de profil professionnel peuvent être visibles publiquement sur la plateforme.
              Certaines données peuvent être traitées par des prestataires techniques (hébergement, email, analytics).
            </p>

            <h2>4. Cookies</h2>
            <p>
              La STREET peut utiliser des cookies ou mécanismes similaires pour assurer le fonctionnement du site et
              améliorer l'expérience utilisateur.
            </p>

            <h2>5. Conservation</h2>
            <p>
              Les données sont conservées pendant la durée nécessaire au fonctionnement du service et/ou selon les
              obligations légales applicables.
            </p>

            <h2>6. Sécurité</h2>
            <p>
              Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données.
              Aucun système n'étant infaillible, un risque résiduel existe.
            </p>

            <h2>7. Vos droits</h2>
            <p>
              Vous pouvez demander la mise à jour ou la suppression de vos informations selon les modalités disponibles
              dans l'application ou via contact.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute demande liée à vos données : <a href="mailto:cyberfusion22@gmail.com">cyberfusion22@gmail.com</a>.
              Vous pouvez aussi passer par la page <a routerLink="/contact">Contact</a>.
            </p>
          </div>
        </div>

        <div class="mt-6 text-center">
          <a routerLink="/" class="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-yellow-300 transition-colors">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Retour à l'accueil
          </a>
        </div>
      </div>
    </main>
  `,
  styles: [`
    .hero-bg {
      background-image:
        radial-gradient(circle at 20% 50%, rgba(234, 179, 8, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(234, 179, 8, 0.03) 0%, transparent 50%);
    }
  `]
})
export class PrivacyPage {
  constructor() {
    const seo = inject(SeoService);
    seo.setTitle('Confidentialité · La STREET');
    seo.updateTags({
      description: 'Politique de confidentialité de La STREET : collecte, utilisation et protection des données.'
    });
  }
}
