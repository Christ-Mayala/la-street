import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden pt-24 pb-32">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-yellow-400/5 rounded-full blur-[150px] animate-pulse"></div>
        <div class="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="container relative z-10 px-6">
        <!-- Hero -->
        <div class="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
           <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Compliance & Protocol</span>
           </div>
           <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
             Conditions <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-200">Générales.</span>
           </h1>
           <p class="mt-8 text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
             Dernière mise à jour : 25 décembre 2025. L'utilisation de nos services implique l'acceptation intégrale de ce protocole.
           </p>
        </div>

        <main class="max-w-4xl mx-auto animate-fade-in-up" style="animation-delay: 0.2s">
           <div class="relative group p-1 border border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl shadow-2xl">
              <div class="relative rounded-[2.8rem] bg-black/40 p-10 md:p-16 space-y-16">
                 
                 <div class="prose prose-invert prose-slate max-w-none 
                             prose-headings:font-black prose-headings:uppercase prose-headings:italic prose-headings:tracking-tighter prose-headings:text-white
                             prose-h2:text-3xl prose-h2:border-l-4 prose-h2:border-yellow-500 prose-h2:pl-6 prose-h2:mb-8
                             prose-p:text-slate-400 prose-p:leading-loose prose-p:font-medium
                             prose-li:text-slate-400 prose-li:font-medium prose-li:marker:text-yellow-500
                             prose-a:text-yellow-500 prose-a:no-underline hover:prose-a:underline">
                    
                    <p class="text-lg italic font-bold text-white/80 border-b border-white/5 pb-8 mb-12">
                      Les présentes conditions d'utilisation encadrent l'accès et l'utilisation de la plateforme La STREET.
                      En utilisant le site, vous acceptez ces conditions sans réserve.
                    </p>

                    <h2>1. Objet du service</h2>
                    <p>
                      La STREET est une plateforme de mise en relation entre des utilisateurs et des professionnels certifiés.
                      La plateforme agit en tant que facilitateur technique et n'est pas partie prenante des contrats de service
                      entre les utilisateurs et les prestataires.
                    </p>

                    <h2>2. Comptes & Accès au Réseau</h2>
                    <ul>
                      <li>L'exactitude des données d'identification est obligatoire pour maintenir l'intégrité du réseau.</li>
                      <li>La sécurité des identifiants (OTP, mots de passe) relève de la responsabilité exclusive de l'utilisateur.</li>
                      <li>Toute violation des protocoles de sécurité pourra entraîner une exclusion définitive.</li>
                    </ul>

                    <h2>3. Propriété Intellectuelle</h2>
                    <p>
                      Vous conservez vos droits sur les contenus publiés, mais vous accordez à La STREET une licence mondiale
                      pour diffuser ces informations afin d'assurer le fonctionnement optimal du service de mise en relation.
                    </p>

                    <h2>4. Code de Conduite Tactique</h2>
                    <ul>
                      <li>Usage de données réelles et vérifiables.</li>
                      <li>Interdiction absolue de toute forme d'usurpation d'identité.</li>
                      <li>Respect des standards de communication professionnelle.</li>
                    </ul>

                    <h2>5. Contact & Support</h2>
                    <p>
                      Pour toute question relative à ce protocole : 
                      <a href="mailto:cyberfusion22@gmail.com">cyberfusion22@gmail.com</a> ou via notre page 
                      <a routerLink="/contact">Contact</a>.
                    </p>
                 </div>

                 <div class="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div class="flex items-center gap-3">
                       <div class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                       <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Protocol Verified 2025</span>
                    </div>
                    <a routerLink="/" class="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:text-yellow-500 transition-all uppercase tracking-[0.2em]">Retour_Accueil</a>
                 </div>
              </div>
           </div>
        </main>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; background: #050505; }
    .animate-fade-in-up {
      animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
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
