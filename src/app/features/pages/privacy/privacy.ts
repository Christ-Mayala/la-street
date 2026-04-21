import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden pt-24 pb-32">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-yellow-400/5 rounded-full blur-[150px] animate-pulse"></div>
        <div class="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="container relative z-10 px-6">
        <!-- Hero -->
        <div class="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
           <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Data Safeguard Protocol</span>
           </div>
           <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
             Vie <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-200">Privée.</span>
           </h1>
           <p class="mt-8 text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
             Transparence totale sur le traitement de vos données. Votre anonymat et votre sécurité sont nos priorités absolues.
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
                      Cette politique décrit comment La STREET collecte, utilise et protège vos informations au sein de notre écosystème.
                    </p>

                    <h2>1. Collecte des Signaux</h2>
                    <ul>
                      <li>Données d'identité : Nom, Email, Téléphonie.</li>
                      <li>Données Professionnelles : Localisation tactique, Métier, Portfolios.</li>
                      <li>Signaux Techniques : Logs de sécurité, Métriques de performance, Empreintes numériques.</li>
                    </ul>

                    <h2>2. Finalité du Traitement</h2>
                    <p>
                      Vos données servent exclusivement à orchestrer la mise en relation, sécuriser les échanges 
                      et optimiser l'algorithme de recommandation des talents.
                    </p>

                    <h2>3. Partage & Transmission</h2>
                    <p>
                      Seules les informations publiques de votre profil professionnel sont accessibles au réseau. 
                      Aucune donnée personnelle n'est vendue à des tiers. Le partage est strictement limité aux prestataires 
                      d'infrastructure nécessaires (hébergement, passerelle mail).
                    </p>

                    <h2>4. Rétention des Données</h2>
                    <p>
                      Les données sont conservées tant que votre compte est actif ou pour satisfaire aux obligations légales. 
                      En cas de suppression de compte, une purge complète est effectuée sous 30 jours.
                    </p>

                    <h2>5. Sécurité de l'Infrastructure</h2>
                    <p>
                      Nous utilisons des protocoles de chiffrement de pointe et des architectures isolées pour prévenir 
                      toute fuite de données. La résilience de notre système est notre engagement.
                    </p>

                    <h2>6. Droits des Utilisateurs</h2>
                    <p>
                      Vous disposez d'un droit d'accès, d'opposition et de suppression de vos données. 
                      Ces actions sont réalisables via votre 
                      <a routerLink="/profile">Espace Personnel</a>.
                    </p>

                    <h2>7. Contact Sentinel</h2>
                    <p>
                      Pour toute question liée à la confidentialité : 
                      <a href="mailto:cyberfusion22@gmail.com">cyberfusion22@gmail.com</a>.
                    </p>
                 </div>

                 <div class="pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-8">
                    <div class="flex items-center gap-3">
                       <div class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></div>
                       <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Privacy Protocol 3.0</span>
                    </div>
                    <a routerLink="/" class="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-white hover:text-yellow-500 transition-all uppercase tracking-[0.2em]">Retour à l'accueil</a>
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
export class PrivacyPage {
  constructor() {
    const seo = inject(SeoService);
    seo.setTitle('Confidentialité · La STREET');
    seo.updateTags({
      description: 'Politique de confidentialité de La STREET : collecte, utilisation et protection des données.'
    });
  }
}
