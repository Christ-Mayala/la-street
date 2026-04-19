import { Component, Inject, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';
import { SiteStatsService } from '../../../core/services/site-stats.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-yellow-400/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 3s"></div>
      </div>

      <!-- Hero Section: Immersive Storytelling -->
      <section class="relative pt-32 pb-24 overflow-hidden">
        <div class="container relative z-10 px-4 sm:px-6">
          <div class="max-w-5xl mx-auto text-center space-y-6 animate-fade-in-up">
            <div class="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-4">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inset-0 h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span class="relative rounded-full h-2 w-2 bg-yellow-400"></span>
              </span>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">L'ADN de La STREET</span>
            </div>

            <!-- Title with overflow fix on mobile -->
            <h1 class="text-4xl sm:text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] uppercase italic break-words">
              Révolutionner<br>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-200">L'Artisanat</span>
            </h1>

            <p class="text-base sm:text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium px-2">
              Nous bâtissons le pont numérique entre les talents invisibles et ceux qui les recherchent, en créant un cadre de confiance unique au Congo.
            </p>

            <!-- Quick Stats: Responsive -->
            <div class="pt-8 sm:pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 max-w-4xl mx-auto">
              <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-500">
                <div class="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tighter">{{ totalProfessionals }}</div>
                <div class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-yellow-500 transition-colors leading-tight mt-1">Talents Vérifiés</div>
              </div>
              <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-500">
                <div class="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tighter">{{ totalTrades }}</div>
                <div class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-yellow-500 transition-colors leading-tight mt-1">Métiers Actifs</div>
              </div>
              <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-500">
                <div class="text-3xl sm:text-4xl font-black text-white mb-1 tracking-tighter">{{ totalCities }}</div>
                <div class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-yellow-500 transition-colors leading-tight mt-1">Villes Couvertes</div>
              </div>
              <div class="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm group hover:bg-white/[0.05] transition-all duration-500">
                <div class="text-2xl sm:text-4xl font-black text-white mb-1 tracking-tighter">Gratuit</div>
                <div class="text-[9px] sm:text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover:text-yellow-500 transition-colors leading-tight mt-1">Frais d'accès</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Vision Section: Wide Aesthetic -->
      <section class="py-24 relative">
        <div class="container px-6">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
            <div class="relative group">
              <div class="absolute inset-0 bg-yellow-500/10 blur-[100px] rounded-full group-hover:bg-yellow-500/20 transition-all duration-1000"></div>
              <div class="relative sm:aspect-square min-h-[280px] sm:min-h-0 rounded-[2rem] sm:rounded-[3rem] overflow-hidden border border-white/10 bg-black/40 backdrop-blur-2xl p-1 shadow-2xl">
                 <div class="h-full w-full rounded-[1.8rem] sm:rounded-[2.8rem] bg-gradient-to-br from-slate-900 to-black p-6 sm:p-12 flex flex-col justify-between gap-6 group-hover:scale-[0.98] transition-all duration-700">
                    <div class="w-12 sm:w-16 h-1 bg-yellow-500"></div>
                    <div class="space-y-4 sm:space-y-6">
                       <h3 class="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-tight">Notre Vision <br> <span class="text-yellow-500">Sans Frontières.</span></h3>
                       <p class="text-slate-300 text-sm sm:text-lg leading-relaxed">Faire de chaque savoir-faire une opportunité économique réelle, accessible en un clic partout sur le territoire.</p>
                    </div>
                    <div class="flex items-center gap-3 sm:gap-4">
                       <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 text-yellow-500 font-black text-sm shrink-0">ST</div>
                       <div class="text-xs font-black uppercase tracking-widest text-slate-500">Système d'Excellence</div>
                    </div>
                 </div>
              </div>
            </div>

            <div class="space-y-8 sm:space-y-12">
               <div class="space-y-3 sm:space-y-4">
                  <h4 class="text-xs font-black text-yellow-500 uppercase tracking-[0.4em]">Pourquoi La STREET ?</h4>
                  <h2 class="text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tighter italic">L'intelligence Locale <br> Amplifiée.</h2>
               </div>

               <div class="grid grid-cols-1 gap-4 sm:gap-6">
                  <div class="flex gap-4 sm:gap-6 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                     <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 sm:w-7 sm:h-7 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                     </div>
                     <div>
                        <h5 class="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Omniprésence</h5>
                        <p class="text-slate-300 text-sm leading-relaxed">Une cartographie instantanée des métiers de proximité, éliminant les intermédiaires obsolètes.</p>
                     </div>
                  </div>

                  <div class="flex gap-4 sm:gap-6 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500">
                     <div class="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                        <svg class="w-5 h-5 sm:w-7 sm:h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                     </div>
                     <div>
                        <h5 class="text-base sm:text-lg font-bold text-white mb-1 sm:mb-2">Protocoles de Sécurité</h5>
                        <p class="text-slate-300 text-sm leading-relaxed">Modération active et labels de confiance pour une sérénité totale lors de chaque mise en relation.</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Steps: Tactical Layout -->
      <section class="py-16 sm:py-24 relative bg-white/[0.01]">
        <div class="container px-4 sm:px-6">
           <div class="max-w-4xl mx-auto text-center mb-12 sm:mb-20">
              <h2 class="text-3xl sm:text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-4 sm:mb-6">4 Phases Pour <span class="text-yellow-500">Réussir.</span></h2>
              <p class="text-slate-300 font-bold uppercase text-xs tracking-[0.2em]">Stratégie d'Intégration Complète</p>
           </div>

           <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div class="group relative p-7 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-black border border-white/10 hover:border-yellow-500/30 transition-all duration-500">
                 <div class="text-6xl font-black text-white/5 absolute top-4 right-6 sm:top-6 sm:right-8 group-hover:text-yellow-500/10 transition-colors">01</div>
                 <div class="h-10 sm:h-14 w-1 flex flex-col justify-end gap-1 mb-6 sm:mb-8">
                    <div class="w-1 h-3 bg-yellow-500"></div>
                 </div>
                 <h4 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4">Initialisation</h4>
                 <p class="text-slate-300 text-sm leading-relaxed">Créez votre identité numérique en moins de 2 minutes.</p>
              </div>

              <div class="group relative p-7 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-black border border-white/10 hover:border-yellow-500/30 transition-all duration-500">
                 <div class="text-6xl font-black text-white/5 absolute top-4 right-6 sm:top-6 sm:right-8 group-hover:text-yellow-500/10 transition-colors">02</div>
                 <div class="h-10 sm:h-14 w-1 flex flex-col justify-end gap-1 mb-6 sm:mb-8">
                    <div class="w-1 h-6 bg-yellow-500"></div>
                 </div>
                 <h4 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4">Recherche</h4>
                 <p class="text-slate-300 text-sm leading-relaxed">Explorez les profils vérifiés selon vos besoins précis.</p>
              </div>

              <div class="group relative p-7 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-black border border-white/10 hover:border-yellow-500/30 transition-all duration-500">
                 <div class="text-6xl font-black text-white/5 absolute top-4 right-6 sm:top-6 sm:right-8 group-hover:text-yellow-500/10 transition-colors">03</div>
                 <div class="h-10 sm:h-14 w-1 flex flex-col justify-end gap-1 mb-6 sm:mb-8">
                    <div class="w-1 h-9 bg-yellow-500"></div>
                 </div>
                 <h4 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4">Inspection</h4>
                 <p class="text-slate-300 text-sm leading-relaxed">Consultez réalisations et disponibilités en temps réel.</p>
              </div>

              <div class="group relative p-7 sm:p-10 rounded-[2rem] sm:rounded-[2.5rem] bg-black border border-white/10 hover:border-yellow-500/30 transition-all duration-500">
                 <div class="text-6xl font-black text-white/5 absolute top-4 right-6 sm:top-6 sm:right-8 group-hover:text-yellow-500/10 transition-colors">04</div>
                 <div class="h-10 sm:h-14 w-1 flex flex-col justify-end gap-1 mb-6 sm:mb-8">
                    <div class="w-1 h-12 bg-yellow-500"></div>
                 </div>
                 <h4 class="text-lg sm:text-xl font-black text-white uppercase tracking-tighter mb-3 sm:mb-4">Contact Direct</h4>
                 <p class="text-slate-300 text-sm leading-relaxed">Établissez le contact direct via Call ou WhatsApp.</p>
              </div>
           </div>
        </div>
      </section>

      <!-- CyberFusion: Studio Aesthetic -->
      <section class="py-16 sm:py-32 relative overflow-hidden">
        <div class="container px-4 sm:px-6">
           <div class="relative rounded-3xl sm:rounded-[4rem] bg-white/[0.05] border border-white/10 overflow-hidden p-6 sm:p-12 md:p-20 shadow-2xl backdrop-blur-md">
              <div class="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-transparent opacity-80"></div>
              
              <div class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
                 <!-- Left: CyberFusion Info -->
                 <div class="space-y-6 sm:space-y-10">
                    <div class="space-y-3">
                       <span class="text-xs font-black text-yellow-500 uppercase tracking-[0.4em]">Propulsé par</span>
                       <h2 class="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic leading-none">
                         CyberFusion<br>Group.
                       </h2>
                    </div>
                    <p class="text-slate-100 text-base sm:text-xl leading-relaxed max-w-lg font-medium">
                      Nous sommes un studio panafricain dédié à l'ingénierie logicielle et à la transformation numérique durable, basé à Brazzaville.
                    </p>
                    <div class="flex flex-wrap gap-3 pt-2">
                       <div class="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Innovation</div>
                       <div class="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Développement Durable</div>
                       <div class="px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-black border border-white/10 text-[10px] font-black uppercase tracking-widest text-white">Priorité Afrique</div>
                    </div>
                 </div>

                 <!-- Right: Manifeste Card -->
                 <div class="p-6 sm:p-10 rounded-3xl sm:rounded-[3.5rem] bg-black/60 border border-white/10 backdrop-blur-3xl space-y-6 shadow-inner hover:bg-black/80 transition-all duration-700">
                    <div class="space-y-3">
                       <h4 class="text-xl sm:text-2xl font-black text-white tracking-tighter uppercase">Manifeste d'Impact</h4>
                       <div class="h-1 w-16 bg-yellow-500"></div>
                    </div>
                    <p class="text-slate-100 text-sm sm:text-base leading-relaxed font-semibold">
                      Notre mission dépasse le code. Nous activons le potentiel économique local par des infrastructures numériques robustes, intuitives et souveraines.
                    </p>
                    <div class="pt-4 space-y-3">
                       <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Statut des Opérations</div>
                       <div class="flex items-center gap-3">
                          <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
                          <span class="text-xs sm:text-sm font-black text-emerald-400 uppercase tracking-wider leading-snug">Système Opérationnel 24/7</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <!-- CTA Footer: Massive Aesthetic -->
      <section class="pt-16 sm:pt-24 pb-24 sm:pb-48 relative overflow-hidden">
        <div class="container px-4 sm:px-6 text-center">
           <div class="max-w-4xl mx-auto space-y-8 sm:space-y-12 animate-fade-in-up">
              <h2 class="text-4xl sm:text-6xl md:text-9xl font-black text-white uppercase tracking-tighter leading-none italic opacity-90 hover:opacity-100 transition-opacity break-words">
                Devenez Enfin<br class="sm:hidden"> <span class="text-yellow-500">Visible.</span>
              </h2>
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-4 sm:pt-8">
                 <a routerLink="/register" class="px-8 sm:px-12 py-5 sm:py-6 bg-yellow-500 text-black font-black uppercase text-sm tracking-[0.2em] rounded-2xl sm:rounded-[2rem] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-yellow-500/20 text-center">Initialiser Profil</a>
                 <a routerLink="/search" class="px-8 sm:px-12 py-5 sm:py-6 bg-white/5 backdrop-blur-xl border border-white/10 text-white font-black uppercase text-sm tracking-[0.2em] rounded-2xl sm:rounded-[2rem] hover:bg-white/10 transition-all text-center">Explorer les Métiers</a>
              </div>
              <p class="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Rejoignez +{{ totalProfessionals }} Talents Aujourd'hui</p>
           </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    :host { display: block; background: #050505; }
    .animate-fade-in-up {
      animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) both;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(40px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-pulse {
      animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 0.1; }
      50% { opacity: 0.2; }
    }
  `]
})
export class AboutPage implements OnInit {
  private readonly stats = inject(SiteStatsService);
  private readonly seo = inject(SeoService);

  totalProfessionals = 0;
  totalTrades = 0;
  totalCities = 0;

  constructor() {}

  ngOnInit() {
    this.seo.setTitle('À propos · La STREET - La vitrine des métiers locaux');
    this.seo.updateTags({
      description: 'Découvrez La STREET, la plateforme qui connecte les habitants aux meilleurs professionnels et artisans locaux en République du Congo. Simple, rapide et fiable.'
    });

    this.loadStats();
  }

  loadStats() {
    this.stats.counts().subscribe({
      next: (c) => {
        this.totalProfessionals = c?.totalProfessionals || 0;
        this.totalTrades = c?.totalTrades || 0;
        this.totalCities = c?.totalCities || 0;
      },
      error: (e) => {
        console.error('Erreur lors de la récupération des statistiques:', e);
      },
    });
  }
}
