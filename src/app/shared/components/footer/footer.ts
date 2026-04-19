import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <footer class="bg-[#050505] border-t border-white/5 pt-20 pb-10">
      <div class="container mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
          
          <!-- Brand and Info -->
          <div class="lg:col-span-5 space-y-8">
            <a routerLink="/" class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-yellow-600 p-[1px]">
                <div class="w-full h-full bg-black rounded-[15px] flex items-center justify-center overflow-hidden">
                  <img src="/logo.jpg" alt="Logo" class="w-full h-full object-cover">
                </div>
              </div>
              <span class="text-2xl font-black tracking-tighter text-white">LA STREET</span>
            </a>
            
            <p class="text-slate-400 text-lg leading-relaxed max-w-md">
              La passerelle d'excellence entre les talents locaux et les projets d'envergure en République du Congo.
            </p>

            <div class="flex items-center gap-4">
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-white/5">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-white/5">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/></svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-yellow-500 hover:bg-yellow-500/10 transition-all border border-white/5">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505a3.017 3.017 0 00-2.122 2.136C0 8.055 0 12 0 12s0 3.945.501 5.814a3.017 3.017 0 002.122 2.136c1.872.505 9.377.505 9.377.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.945 24 12 24 12s0-3.945-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>

          <!-- Shortcuts -->
          <div class="lg:col-span-2 space-y-6">
            <h4 class="text-white font-bold tracking-wider uppercase text-xs">Navigation</h4>
            <ul class="space-y-4">
              <li><a routerLink="/" class="text-slate-400 hover:text-white transition-colors">Accueil</a></li>
              <li><a routerLink="/search" class="text-slate-400 hover:text-white transition-colors">Professionnels</a></li>
              <li><a routerLink="/leads" class="text-slate-400 hover:text-white transition-colors">Missions</a></li>
              <li><a routerLink="/about" class="text-slate-400 hover:text-white transition-colors">À propos</a></li>
            </ul>
          </div>

          <!-- Support -->
          <div class="lg:col-span-2 space-y-6">
            <h4 class="text-white font-bold tracking-wider uppercase text-xs">Support</h4>
            <ul class="space-y-4">
              <li><a routerLink="/contact" class="text-slate-400 hover:text-white transition-colors">Aide</a></li>
              <li><a routerLink="/terms" class="text-slate-400 hover:text-white transition-colors">Conditions</a></li>
              <li><a routerLink="/privacy" class="text-slate-400 hover:text-white transition-colors">Confidentialité</a></li>
            </ul>
          </div>

          <!-- Professionals -->
          <div class="lg:col-span-3">
             <div class="bg-gradient-to-br from-yellow-400/10 to-transparent p-6 rounded-3xl border border-yellow-500/10">
               <h4 class="text-white font-bold mb-3">Professionnel ?</h4>
               <p class="text-slate-400 text-sm mb-5">Développez votre activité et boostez votre visibilité locale.</p>
               <a routerLink="/register" class="inline-flex items-center gap-2 text-yellow-500 font-bold hover:gap-3 transition-all">
                 S'inscrire <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
               </a>
             </div>
          </div>

        </div>

        <div class="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p class="text-slate-500 text-sm">
            © {{ year }} La STREET. Réalisé avec ❤️ par <a href="https://cyberfusion-group.vercel.app/" target="_blank" class="text-slate-400 hover:text-yellow-500">Cyberfusion Group</a>
          </p>
          <p class="text-[10px] uppercase font-black tracking-[.2em] text-slate-600">
            Talents Visibles, Travail Valorisé
          </p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    @media (max-width: 640px) {
      .footer-card-mobile {
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
      }
    }
  `]
})
export class FooterComponent {
  protected readonly year = new Date().getFullYear();
}
