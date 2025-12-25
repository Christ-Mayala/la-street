import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-terms',
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            <span class="text-sm font-medium text-yellow-300">Support & Légal</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Conditions <span class="text-yellow-400">d'utilisation</span>
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
              Les présentes conditions d'utilisation encadrent l'accès et l'utilisation de la plateforme La STREET.
              En utilisant le site, vous acceptez ces conditions.
            </p>

            <h2>1. Objet du service</h2>
            <p>
              La STREET est une plateforme de mise en relation entre des utilisateurs et des professionnels/artisans.
              La STREET ne fournit pas directement les prestations : elle facilite la recherche, la visibilité et le contact.
            </p>

            <h2>2. Comptes & accès</h2>
            <ul>
              <li>Vous devez fournir des informations exactes lors de l'inscription.</li>
              <li>Vous êtes responsable de la confidentialité de vos identifiants.</li>
              <li>Tout usage frauduleux ou abusif peut entraîner une suspension.</li>
            </ul>

            <h2>3. Contenus & profils</h2>
            <ul>
              <li>Vous garantissez disposer des droits sur les contenus publiés (photos, textes, etc.).</li>
              <li>Les contenus illégaux, trompeurs, diffamatoires ou haineux sont interdits.</li>
              <li>La STREET peut modérer ou retirer des contenus en cas de non-conformité.</li>
            </ul>

            <h2>4. Règles de bonne conduite</h2>
            <ul>
              <li>Ne pas usurper l'identité d'autrui.</li>
              <li>Ne pas publier de fausses informations ou de coordonnées trompeuses.</li>
              <li>Ne pas tenter d'altérer le fonctionnement du site (attaque, scraping abusif, etc.).</li>
            </ul>

            <h2>5. Responsabilité</h2>
            <p>
              La STREET met tout en œuvre pour proposer un service disponible et sécurisé, mais ne garantit pas l'absence
              d'interruptions. Les prestations, délais, tarifs et résultats dépendent des parties (client/professionnel).
            </p>

            <h2>6. Signalement</h2>
            <p>
              Si vous constatez un abus ou un contenu inapproprié, merci d'utiliser les fonctionnalités de signalement
              ou de contacter le support.
            </p>

            <h2>7. Modifications</h2>
            <p>
              La STREET peut mettre à jour ces conditions à tout moment. En continuant d'utiliser la plateforme après
              modification, vous acceptez la version mise à jour.
            </p>

            <h2>8. Contact</h2>
            <p>
              Pour toute question : <a href="mailto:cyberfusion22@gmail.com">cyberfusion22@gmail.com</a>.
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
export class TermsPage {
  constructor() {
    const seo = inject(SeoService);
    seo.setTitle("Conditions d'utilisation · La STREET");
    seo.updateTags({
      description: "Consultez les conditions d'utilisation de La STREET (Talents & métiers du Congo)."
    });
  }
}
