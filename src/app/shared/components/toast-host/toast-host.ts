import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-[22rem] max-w-[calc(100vw-2rem)] space-y-2">
      <div *ngFor="let t of toast.toasts()" class="rounded-xl border p-3 shadow-lg backdrop-blur bg-black/70" [ngClass]="borderClass(t.type)">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <div class="text-sm font-semibold text-white truncate">{{ t.title }}</div>
            <div *ngIf="t.message" class="mt-1 text-xs text-slate-300">{{ t.message }}</div>
          </div>
          <button class="text-xs text-slate-300 hover:text-white" (click)="toast.dismiss(t.id)">Fermer</button>
        </div>
      </div>
    </div>
  `,
})
export class ToastHostComponent {
  protected readonly toast = inject(ToastService);

  borderClass(type: any) {
    if (type === 'success') return 'border-emerald-500/30';
    if (type === 'error') return 'border-red-500/30';
    return 'border-sky-500/30';
  }
}
