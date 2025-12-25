import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <section class="relative overflow-hidden hero-bg">
      <div class="absolute inset-0 -z-10 bg-black"></div>

      <!-- Background elements -->
      <div class="absolute top-0 left-0 w-full h-full -z-5 overflow-hidden">
        <div class="absolute -top-10 left-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
        <div class="absolute bottom-10 right-1/4 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
      </div>

      <div class="container relative z-10 py-16 md:py-20">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/20 mb-6">
            <svg class="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
            <span class="text-sm font-medium text-yellow-300">Contact & Support</span>
          </div>

          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            <span class="text-yellow-400">Contactez-nous</span>
          </h1>
          <p class="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
            Vous avez une question, une suggestion ou besoin d'aide ? Notre équipe est là pour vous répondre.
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <main class="container py-12 md:py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Contact Form -->
        <div class="lg:col-span-2">
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6 md:p-8">
            <h2 class="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <svg class="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path>
              </svg>
              Envoyez-nous un message
            </h2>

            <form class="space-y-6" (ngSubmit)="onSubmit()">
              <!-- Name & Email -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label for="name" class="block text-sm font-medium text-slate-300">
                    Votre nom <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <input
                      [(ngModel)]="name"
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div class="space-y-2">
                  <label for="email" class="block text-sm font-medium text-slate-300">
                    Votre email <span class="text-red-400">*</span>
                  </label>
                  <div class="relative">
                    <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    <input
                      [(ngModel)]="email"
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder="john@exemple.com"
                      class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              <!-- Subject -->
              <div class="space-y-2">
                <label for="subject" class="block text-sm font-medium text-slate-300">
                  Sujet
                </label>
                <div class="relative">
                  <svg class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <input
                    [(ngModel)]="subject"
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Objet de votre message"
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              <!-- Message -->
              <div class="space-y-2">
                <label for="message" class="block text-sm font-medium text-slate-300">
                  Votre message <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <svg class="absolute left-4 top-4 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  <textarea
                    [(ngModel)]="message"
                    id="message"
                    name="message"
                    rows="6"
                    required
                    placeholder="Décrivez votre demande en détail..."
                    class="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-700 bg-black/40 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
                  ></textarea>
                </div>
              </div>

              <!-- Submit Button -->
              <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <p class="text-sm text-slate-400">
                  <span class="text-yellow-300 font-medium">Note :</span> Votre message sera envoyé directement à notre équipe par email
                </p>
                <button
                  type="submit"
                  class="px-8 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/30 flex items-center justify-center gap-2"
                  [disabled]="!name || !email || !message"
                  [class.opacity-50]="!name || !email || !message"
                  [class.cursor-not-allowed]="!name || !email || !message"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                  Envoyer le message
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="space-y-6">
          <!-- Contact Card -->
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Nos coordonnées
            </h3>

            <div class="space-y-4">
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-white">Email</h4>
                  <a href="mailto:cyberfusion22@gmail.com" class="text-slate-300 hover:text-yellow-300 transition-colors duration-200">
                    cyberfusion22{{'@'}}gmail.com
                  </a>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <div class="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <div>
                  <h4 class="font-semibold text-white">Localisation</h4>
                  <p class="text-slate-300">République du Congo</p>
                </div>
              </div>
            </div>
          </div>

          <!-- FAQ Card -->
          <div class="bg-black/30 backdrop-blur-sm rounded-2xl border border-slate-800 p-6">
            <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">
              <svg class="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Questions fréquentes
            </h3>

            <div class="space-y-4">
              <details class="group">
                <summary class="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white transition-colors duration-200">
                  <span class="font-medium">Quel est le temps de réponse ?</span>
                  <svg class="w-4 h-4 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </summary>
                <p class="mt-2 text-sm text-slate-400 pl-4 border-l-2 border-yellow-400/50">
                  Nous répondons généralement dans les 24-48 heures ouvrées.
                </p>
              </details>

              <details class="group">
                <summary class="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white transition-colors duration-200">
                  <span class="font-medium">Est-ce que le service est gratuit ?</span>
                  <svg class="w-4 h-4 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </summary>
                <p class="mt-2 text-sm text-slate-400 pl-4 border-l-2 border-yellow-400/50">
                  Oui, La STREET est entièrement gratuite pour les utilisateurs et professionnels.
                </p>
              </details>

              <details class="group">
                <summary class="flex items-center justify-between cursor-pointer text-slate-300 hover:text-white transition-colors duration-200">
                  <span class="font-medium">Puis-je signaler un problème ?</span>
                  <svg class="w-4 h-4 group-open:rotate-180 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </summary>
                <p class="mt-2 text-sm text-slate-400 pl-4 border-l-2 border-yellow-400/50">
                  Oui, vous pouvez signaler tout comportement inapproprié directement via le formulaire.
                </p>
              </details>
            </div>

            <div class="mt-6 pt-6 border-t border-slate-800">
              <p class="text-sm text-slate-400">
                Vous ne trouvez pas de réponse ? <a routerLink="/faq" class="text-yellow-300 hover:text-yellow-400 hover:underline transition-colors duration-200">Consultez notre FAQ complète</a>
              </p>
            </div>
          </div>
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

    details summary::-webkit-details-marker {
      display: none;
    }

    details[open] summary {
      margin-bottom: 8px;
    }
  `]
})
export class ContactPage {
  private readonly seo = inject(SeoService);

  name = '';
  email = '';
  subject = '';
  message = '';

  constructor() {
    this.seo.setTitle('Contact · La STREET - Support et Assistance');
    this.seo.updateTags({
      description: 'Contactez l\'équipe La STREET pour le support technique, les partenariats, les signalements ou toute autre demande.'
    });
  }

  onSubmit() {
    const to = 'cyberfusion22@gmail.com';
    const body = encodeURIComponent(`${this.message}\n\n---\nNom: ${this.name}\nEmail: ${this.email}`);
    const subj = encodeURIComponent(this.subject || 'Contact La STREET');
    window.location.href = `mailto:${to}?subject=${subj}&body=${body}`;
  }
}
