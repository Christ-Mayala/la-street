import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';
export type Toast = { id: string; type: ToastType; title: string; message?: string };

const uid = () => `${Date.now()}_${Math.random().toString(16).slice(2)}`;

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  push(t: Omit<Toast, 'id'>, ttlMs = 4500) {
    const id = uid();
    this.toasts.set([{ id, ...t }, ...this.toasts()].slice(0, 5));
    setTimeout(() => this.dismiss(id), ttlMs);
  }

  success(title: string, message?: string) {
    this.push({ type: 'success', title, message });
  }

  error(title: string, message?: string) {
    this.push({ type: 'error', title, message });
  }

  info(title: string, message?: string) {
    this.push({ type: 'info', title, message });
  }

  dismiss(id: string) {
    this.toasts.set(this.toasts().filter((t) => t.id !== id));
  }

  warning(numéroDeTéléphoneNonDisponible: string) {
    
  }
}
