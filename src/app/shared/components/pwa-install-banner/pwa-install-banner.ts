import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';

type PromptChoice = { outcome: 'accepted' | 'dismissed'; platform: string };

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<PromptChoice>;
};

@Component({
  selector: 'app-pwa-install-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="visible()" class="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-4">
      <div class="mx-auto max-w-3xl rounded-2xl border border-slate-800 bg-black/90 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
        <div class="flex items-start gap-3 p-4 sm:p-5">
          <div class="h-11 w-11 shrink-0 rounded-xl overflow-hidden border border-yellow-400/25 bg-yellow-400/10">
            <img src="/icon-192.png" alt="" class="h-full w-full object-cover" />
          </div>

          <div class="min-w-0 flex-1">
            <div class="flex items-center justify-between gap-3">
              <div class="min-w-0">
                <div class="text-sm sm:text-base font-semibold text-white truncate">Installer La STREET</div>
                <div class="text-xs sm:text-sm text-slate-300 mt-0.5">
                  Accédez plus vite, en plein écran, comme une application.
                </div>
              </div>

              <button type="button" (click)="dismiss()" class="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors" aria-label="Fermer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="mt-3 flex flex-col sm:flex-row gap-2 sm:items-center">
              <button
                *ngIf="canPrompt(); else iosHelp"
                type="button"
                (click)="install()"
                class="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-600 transition-all"
              >
                Installer
              </button>

              <ng-template #iosHelp>
                <div class="text-xs sm:text-sm text-slate-300">
                  Sur iPhone: ouvrez <span class="font-semibold text-white">Partager</span> puis <span class="font-semibold text-white">Sur l’écran d’accueil</span>.
                </div>
              </ng-template>

              <button type="button" (click)="dismiss()" class="w-full sm:w-auto px-4 py-2 rounded-xl border border-slate-700 text-slate-200 hover:bg-white/5 transition-colors">
                Plus tard
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class PwaInstallBannerComponent implements OnInit, OnDestroy {
  private deferred: BeforeInstallPromptEvent | null = null;

  visible = signal(false);
  canPrompt = signal(false);

  private readonly storageKey = 'la_street_pwa_install_dismissed_v1';

  private isStandalone(): boolean {
    if (typeof window === 'undefined') return true;
    const nav: any = navigator as any;
    return window.matchMedia?.('(display-mode: standalone)')?.matches || !!nav?.standalone;
  }

  private isIosSafari(): boolean {
    if (typeof window === 'undefined') return false;
    const ua = String(navigator.userAgent || '');
    const isIOS = /iPad|iPhone|iPod/i.test(ua);
    const isWebkit = /WebKit/i.test(ua);
    const isCriOS = /CriOS/i.test(ua);
    const isFxiOS = /FxiOS/i.test(ua);
    return isIOS && isWebkit && !isCriOS && !isFxiOS;
  }

  private dismissed(): boolean {
    try {
      return localStorage.getItem(this.storageKey) === '1';
    } catch {
      return false;
    }
  }

  private markDismissed() {
    try {
      localStorage.setItem(this.storageKey, '1');
    } catch {
      // ignore
    }
  }

  private onBeforeInstallPrompt = (e: Event) => {
    if (this.isStandalone() || this.dismissed()) return;
    e.preventDefault();
    this.deferred = e as BeforeInstallPromptEvent;
    this.canPrompt.set(true);
    this.visible.set(true);
  };

  private onAppInstalled = () => {
    this.deferred = null;
    this.canPrompt.set(false);
    this.visible.set(false);
    this.markDismissed();
  };

  ngOnInit() {
    if (this.isStandalone() || this.dismissed()) return;

    window.addEventListener('beforeinstallprompt', this.onBeforeInstallPrompt as any);
    window.addEventListener('appinstalled', this.onAppInstalled as any);

    if (this.isIosSafari()) {
      this.canPrompt.set(false);
      this.visible.set(true);
    }
  }

  ngOnDestroy() {
    if (typeof window === 'undefined') return;
    window.removeEventListener('beforeinstallprompt', this.onBeforeInstallPrompt as any);
    window.removeEventListener('appinstalled', this.onAppInstalled as any);
  }

  dismiss() {
    this.visible.set(false);
    this.markDismissed();
  }

  async install() {
    const p = this.deferred;
    if (!p) {
      this.markDismissed();
      this.visible.set(false);
      return;
    }

    try {
      await p.prompt();
      await p.userChoice;
    } finally {
      this.deferred = null;
      this.canPrompt.set(false);
      this.visible.set(false);
      this.markDismissed();
    }
  }
}
