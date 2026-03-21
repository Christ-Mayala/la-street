import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.html'
})
export class PricingPage {
  private seo = inject(SeoService);

  constructor() {
    this.seo.setTitle('Abonnements · La STREET');
  }
}
