import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly key = 'street_favorites';
  favs = signal<string[]>(this.load());

  private load(): string[] {
    try { return JSON.parse(localStorage.getItem(this.key) || '[]'); } catch { return []; }
  }

  toggle(proId: string) {
    const list = new Set(this.favs());
    if (list.has(proId)) list.delete(proId); else list.add(proId);
    const arr = Array.from(list);
    localStorage.setItem(this.key, JSON.stringify(arr));
    this.favs.set(arr);
  }

  isFav(proId: string) { return this.favs().includes(proId); }
}
