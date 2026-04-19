import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar';
import { FooterComponent } from './shared/components/footer/footer';
import { ToastHostComponent } from './shared/components/toast-host/toast-host';
import { PwaInstallBannerComponent } from './shared/components/pwa-install-banner/pwa-install-banner';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, PwaInstallBannerComponent, ToastHostComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly auth = inject(AuthService);
  protected readonly title = signal('La STREET');

  ngOnInit() {
    this.auth.checkAuth().catch(() => {});
  }
}
