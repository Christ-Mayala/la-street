import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-24 right-4 z-[9999] w-[24rem] max-w-[calc(100vw-2rem)] flex flex-col gap-3">
      <div 
        *ngFor="let t of toast.toasts()" 
        class="group relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-2xl animate-toast-in"
        [ngClass]="containerClass(t.type)"
      >
        <!-- Progress Bar Background (Subtle) -->
        <div class="absolute bottom-0 left-0 h-1 bg-white/20 animate-toast-progress"></div>

        <div class="p-4 flex items-start gap-4">
          <!-- Icon Based on Type -->
          <div class="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" [ngClass]="iconBgClass(t.type)">
             <svg *ngIf="t.type === 'success'" class="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"></path>
             </svg>
             <svg *ngIf="t.type === 'error'" class="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
             </svg>
             <svg *ngIf="t.type === 'info'" class="w-6 h-6 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
             </svg>
          </div>

          <div class="flex-1 min-w-0 pr-6">
            <h4 class="text-sm font-black text-white uppercase tracking-wider mb-0.5">{{ t.title }}</h4>
            <p *ngIf="t.message" class="text-xs font-medium text-slate-400 leading-relaxed">{{ t.message }}</p>
          </div>

          <button 
            (click)="toast.dismiss(t.id)"
            class="absolute top-3 right-3 p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/10 transition-all opacity-0 group-hover:opacity-100"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Animated border effect -->
        <div class="absolute inset-0 border-2 border-white/5 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  `,
  styles: [`
    .animate-toast-in {
      animation: toastIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
    }

    .animate-toast-progress {
      animation: progress 4.5s linear forwards;
    }

    @keyframes toastIn {
      from { opacity: 0; transform: translateX(50px) scale(0.9); }
      to { opacity: 1; transform: translateX(0) scale(1); }
    }

    @keyframes progress {
      from { width: 100%; }
      to { width: 0%; }
    }
  `]
})
export class ToastHostComponent {
  protected readonly toast = inject(ToastService);

  containerClass(type: any) {
    const base = 'bg-black/80 ';
    if (type === 'success') return base + 'border-emerald-500/20 shadow-emerald-500/5';
    if (type === 'error') return base + 'border-rose-500/20 shadow-rose-500/5';
    return base + 'border-sky-500/20 shadow-sky-500/5';
  }

  iconBgClass(type: any) {
    if (type === 'success') return 'bg-emerald-500/10';
    if (type === 'error') return 'bg-rose-500/10';
    return 'bg-sky-500/10';
  }
}
