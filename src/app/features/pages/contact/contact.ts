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
    <div class="min-h-screen bg-[#050505] text-slate-200 selection:bg-yellow-400/30 overflow-hidden pt-24 pb-32">
      <!-- Ambient Background -->
      <div class="fixed inset-0 pointer-events-none">
        <div class="absolute top-[10%] right-[-10%] w-[60%] h-[60%] bg-yellow-400/5 rounded-full blur-[150px] animate-pulse"></div>
        <div class="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] animate-pulse" style="animation-delay: 2s"></div>
      </div>

      <div class="container relative z-10 px-6">
        <!-- Hero Title -->
        <div class="max-w-4xl mx-auto text-center mb-24 animate-fade-in-up">
           <div class="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl mb-6">
              <svg class="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
              <span class="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em]">Canal de Communication</span>
           </div>
           <h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase italic leading-[0.9]">
             Parlons de <br> <span class="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-200">Demain.</span>
           </h1>
           <p class="mt-8 text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
             Une question, un partenariat ou un besoin d'assistance ? Nos experts sont à votre écoute pour orchestrer votre succès.
           </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
          
          <!-- Contact Form: Ultra Glass -->
          <div class="lg:col-span-7 space-y-8 animate-fade-in-up" style="animation-delay: 0.2s">
            <div class="relative group p-1 border border-white/5 rounded-[3rem] bg-white/[0.02] backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:border-white/10">
               <div class="absolute inset-0 bg-yellow-500/5 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
               
               <div class="relative rounded-[2.8rem] bg-black/40 p-8 md:p-12 space-y-10">
                  <div class="flex items-center justify-between border-b border-white/5 pb-8">
                     <h2 class="text-3xl font-black text-white uppercase tracking-tighter italic">Nous Contacter</h2>
                     <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white/5 px-4 py-2 rounded-full border border-white/10">Champs Requis</div>
                  </div>

                  <form class="space-y-6" (ngSubmit)="onSubmit()">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div class="space-y-2 group/field">
                          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 group-focus-within/field:text-yellow-500 transition-colors">Votre Nom</label>
                          <input [(ngModel)]="name" name="name" type="text" required placeholder="Ex: John Doe" class="w-full bg-[#050505]/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all outline-none group-hover:bg-white/[0.05]">
                       </div>
                       <div class="space-y-2 group/field">
                          <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 group-focus-within/field:text-yellow-500 transition-colors">Adresse Email</label>
                          <input [(ngModel)]="email" name="email" type="email" required placeholder="john@exemple.com" class="w-full bg-[#050505]/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all outline-none group-hover:bg-white/[0.05]">
                       </div>
                    </div>

                    <div class="space-y-2 group/field">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 group-focus-within/field:text-yellow-500 transition-colors">Sujet</label>
                       <input [(ngModel)]="subject" name="subject" type="text" placeholder="Définissez l'objet de votre demande" class="w-full bg-[#050505]/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all outline-none group-hover:bg-white/[0.05]">
                    </div>

                    <div class="space-y-2 group/field">
                       <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-2 group-focus-within/field:text-yellow-500 transition-colors">Votre Message</label>
                       <textarea [(ngModel)]="message" name="message" rows="6" required placeholder="Comment pouvons-nous vous aider ?" class="w-full bg-[#050505]/60 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/30 transition-all outline-none resize-none group-hover:bg-white/[0.05]"></textarea>
                    </div>

                    <div class="flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
                       <div class="flex items-center gap-3">
                          <div class="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></div>
                          <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Envoi via Client Mail local</span>
                       </div>
                       <button type="submit" [disabled]="!name || !email || !message" class="w-full md:w-auto px-12 py-5 bg-yellow-500 text-black font-black uppercase text-sm tracking-[0.2em] rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-20 shadow-2xl shadow-yellow-500/10">Envoyer le Message</button>
                    </div>
                  </form>
               </div>
            </div>
          </div>

          <!-- Info & FAQ: Tactical Sidebar -->
          <div class="lg:col-span-5 space-y-8 animate-fade-in-up" style="animation-delay: 0.4s">
            
            <!-- Contact Cards -->
            <div class="grid grid-cols-1 gap-4">
               <div class="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 flex items-center gap-6 group">
                  <div class="w-14 h-14 rounded-2xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center shrink-0 group-hover:bg-yellow-400 group-hover:text-black transition-all duration-500">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  </div>
                  <div>
                     <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">E-mail Direct</div>
                     <a href="mailto:cyberfusion22@gmail.com" class="text-base sm:text-lg font-black text-white hover:text-yellow-500 transition-colors tracking-tighter uppercase italic break-all">cyberfusion22{{'@'}}gmail.com</a>
                  </div>
               </div>

               <div class="p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-500 flex items-center gap-6 group">
                  <div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-white group-hover:text-black transition-all duration-500">
                     <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                  <div>
                     <div class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Localisation</div>
                     <div class="text-xl font-black text-white tracking-tighter uppercase italic">Brazzaville, Congo</div>
                  </div>
               </div>
            </div>

            <!-- FAQ Glass Accordion -->
            <div class="rounded-[2.5rem] bg-white/[0.01] border border-white/5 p-8 md:p-10 space-y-8">
               <div class="flex items-center gap-4 mb-2">
                  <div class="w-1.5 h-8 bg-yellow-500"></div>
                  <h3 class="text-2xl font-black text-white uppercase tracking-tighter italic">Questions Fréquentes</h3>
               </div>

               <div class="divide-y divide-white/5">
                 <details class="group py-6">
                    <summary class="flex items-center justify-between cursor-pointer list-none">
                       <span class="text-sm font-black text-slate-300 uppercase tracking-widest group-open:text-yellow-500 transition-colors">Délai de réponse</span>
                       <svg class="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                    </summary>
                    <div class="mt-4 text-sm text-slate-400 leading-relaxed font-medium pl-2 border-l border-yellow-500/30">
                       Notre équipe s'engage à vous répondre sous 24 à 48 heures ouvrées selon la complexité de votre demande.
                    </div>
                 </details>

                 <details class="group py-6">
                    <summary class="flex items-center justify-between cursor-pointer list-none">
                       <span class="text-sm font-black text-slate-300 uppercase tracking-widest group-open:text-yellow-500 transition-colors">Coût du service</span>
                       <svg class="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                    </summary>
                    <div class="mt-4 text-sm text-slate-400 leading-relaxed font-medium pl-2 border-l border-yellow-500/30">
                       L'accès à la plateforme La STREET est entièrement gratuit pour les utilisateurs et les comptes prestataires de base.
                    </div>
                 </details>

                 <details class="group py-6">
                    <summary class="flex items-center justify-between cursor-pointer list-none">
                       <span class="text-sm font-black text-slate-300 uppercase tracking-widest group-open:text-yellow-500 transition-colors">Signalements d'abus</span>
                       <svg class="w-4 h-4 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 9l-7 7-7-7"></path></svg>
                    </summary>
                    <div class="mt-4 text-sm text-slate-400 leading-relaxed font-medium pl-2 border-l border-yellow-500/30">
                       Vous pouvez signaler tout dysfonctionnement ou comportement inapproprié via ce formulaire avec l'objet "Signalement".
                    </div>
                 </details>
               </div>
            </div>

          </div>
        </div>
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
    ::-webkit-details-marker { display: none; }
    summary { list-style: none; }
  `]
})
export class ContactPage {
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

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
    this.toast.success('Redirection', 'Ouverture de votre messagerie...');
  }
}
