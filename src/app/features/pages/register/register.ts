import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ApiService } from '../../../core/services/api.service';
import { SeoService } from '../../../core/services/seo.service';
import { ToastService } from '../../../core/services/toast.service';

type Category = { _id: string; name: string; trades: { _id: string; name: string }[] };

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterPage {
  showPassword = false;

  private readonly auth = inject(AuthService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  private readonly toast = inject(ToastService);

  private scrollToTop() {
    if (typeof window === 'undefined') return;
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  step = 1;
  role: 'client' | 'professional' = 'client';

  name = '';
  email = '';
  password = '';
  telephone = '';
  hasWhatsapp = false;

  pays = 'République du Congo';
  ville = '';
  quartier = '';

  categories: Category[] = [];
  categoryId = '';
  tradeId = '';
  selectedTrades: { _id: string; name: string }[] = [];

  experienceRange: '0-1' | '2-5' | '5+' = '0-1';
  preferredContact: 'call' | 'whatsapp' | 'both' = 'both';
  description = '';

  days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  daysAvailable: string[] = [];
  hoursAvailable = '';

  acceptRules = false;
  villes = ['Brazzaville', 'Pointe-Noire', 'Dolisie', 'Nkayi', 'Ouesso'];

  profileImageFile: File | null = null;
  realizationFiles: File[] = [];
  fileError = '';
  globalError = '';
  isLoading = false;

  totalSteps() {
    return this.role === 'professional' ? 5 : 3;
  }

  displayStep() {
    if (this.role === 'professional') return this.step;
    if (this.step <= 2) return this.step;
    return 3;
  }

  progress() {
    return (this.displayStep() / this.totalSteps()) * 100;
  }

  constructor() {
    this.seo.setTitle('Inscription · La STREET');
    this.seo.updateTags({
      description: 'Rejoignez La STREET, la plateforme qui connecte les professionnels et clients en République du Congo (Brazzaville). Inscrivez-vous gratuitement.'
    });

    this.loadCategories();
  }

  loadCategories() {
    try {
      this.api.categories().subscribe({
        next: (list) => {
          this.categories = (list || []) as Category[];
        },
        error: () => {
          this.categories = [];
        },
      });
    } catch {
      this.categories = [];
    }
  }

  onCategoryChange(nextId?: string) {
    if (typeof nextId === 'string') this.categoryId = nextId;
    const c: any = this.categories.find((x: any) => x._id === this.categoryId);
    const trades = c?.trades || c?.tradeIds || c?.metiers || [];
    this.selectedTrades = Array.isArray(trades) ? trades : [];
    this.tradeId = '';
  }

  toggleDay(d: string, e: any) {
    const checked = !!e?.target?.checked;
    if (checked) {
      if (!this.daysAvailable.includes(d)) {
        this.daysAvailable = [...this.daysAvailable, d];
      }
    } else {
      this.daysAvailable = this.daysAvailable.filter((x) => x !== d);
    }
  }

  private validateImageFile(f: File): string {
    if (!f.type.startsWith('image/')) {
      return `Le fichier ${f.name} n'est pas une image.`;
    }
    if (f.size > 10 * 1024 * 1024) {
      return `L'image ${f.name} dépasse 10MB.`;
    }
    return '';
  }

  onPhotosChange(e: any) {
    const files: FileList | null = e.target?.files || null;
    this.fileError = '';
    this.profileImageFile = null;
    this.realizationFiles = [];

    if (!files || files.length === 0) return;

    if (files.length > 2) {
      this.fileError = 'Vous ne pouvez sélectionner que 2 photos maximum.';
      return;
    }

    const arr: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const err = this.validateImageFile(f);
      if (err) {
        this.fileError = err;
        return;
      }
      arr.push(f);
    }

    this.profileImageFile = arr[0] || null;
    this.realizationFiles = arr.slice(1, 2);
  }

  previewUrl(f: File) {
    try {
      return URL.createObjectURL(f);
    } catch {
      return '';
    }
  }

  prev() {
    if (this.role !== 'professional' && this.step === 5) {
      this.step = 2;
      this.scrollToTop();
      return;
    }

    if (this.step > 1) {
      this.step--;
      this.scrollToTop();
    }
  }

  async onNextOrSubmit() {
    this.globalError = '';

    if (this.step < 5) {
      if (!this.validateCurrentStep()) {
        this.toast.error('Erreur', this.globalError || 'Veuillez corriger les champs.');
        this.scrollToTop();
        return;
      }

      if (this.role !== 'professional') {
        if (this.step === 2) {
          this.step = 5;
        } else {
          this.step++;
        }
      } else {
        this.step++;
      }

      this.scrollToTop();
      return;
    }

    if (!this.acceptRules) {
      this.globalError = 'Vous devez accepter les conditions d\'utilisation.';
      this.toast.error('Erreur', this.globalError);
      this.scrollToTop();
      return;
    }

    if (this.role === 'professional') {
      if (!this.categoryId || !this.tradeId) {
        this.globalError = 'Veuillez sélectionner une catégorie et un métier.';
        this.toast.error('Erreur', this.globalError);
        this.scrollToTop();
        return;
      }
      if (!this.ville) {
        this.globalError = 'Veuillez sélectionner une ville.';
        this.toast.error('Erreur', this.globalError);
        this.scrollToTop();
        return;
      }
      if (!this.profileImageFile) {
        this.globalError = 'Veuillez ajouter votre photo de profil.';
        this.toast.error('Erreur', this.globalError);
        this.scrollToTop();
        return;
      }
    }

    this.isLoading = true;

    try {
      const cleanName = String(this.name || '').trim();
      const cleanEmail = String(this.email || '').trim().toLowerCase();
      const cleanPassword = String(this.password || '');
      const cleanTelephone = String(this.telephone || '').trim();

      await this.auth.register({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: this.role === 'professional' ? 'professional' : 'user',
        telephone: cleanTelephone,
      });

      await this.auth.login({ email: cleanEmail, password: cleanPassword });

      // 3. Si professionnel, créer le profil professionnel
      if (this.role === 'professional') {
        if (!this.profileImageFile) {
          throw new Error('Photo de profil requise');
        }

        const fd = new FormData();
        fd.append('name', cleanName);
        fd.append('telephone', cleanTelephone);
        fd.append('whatsapp', String(this.hasWhatsapp));
        fd.append('pays', this.pays);
        fd.append('ville', this.ville);
        fd.append('quartier', this.quartier || '');
        fd.append('categoryId', this.categoryId);
        fd.append('tradeId', this.tradeId);
        fd.append('experienceRange', this.experienceRange);
        fd.append('preferredContact', this.preferredContact);
        fd.append('description', this.description || '');
        fd.append('hoursAvailable', this.hoursAvailable || '');

        // Ajouter les jours disponibles
        this.daysAvailable.forEach(d => {
          fd.append('daysAvailable', d);
        });

        // Ajouter les photos
        fd.append('profileImage', this.profileImageFile, this.profileImageFile.name);
        this.realizationFiles.forEach((f, index) => {
          fd.append('gallery', f, f.name);
        });

        // Envoyer la requête pour créer le profil professionnel
        await new Promise<void>((resolve, reject) => {
          this.api.createProfessional(fd).subscribe({
            next: () => resolve(),
            error: (err) => {
              reject(err);
            }
          });
        });
      }

      this.toast.success('Bienvenue !', this.role === 'professional' ? 'Votre compte et votre profil professionnel ont été créés.' : 'Votre compte a été créé avec succès.');
      this.router.navigate(['/profile']);

    } catch (error: any) {
      // Gestion des erreurs spécifiques
      if (error?.message?.includes('duplicate') || error?.error?.message?.includes('duplicate')) {
        this.globalError = 'Cet email est déjà utilisé. Veuillez utiliser une autre adresse email.';
      } else if (error?.message?.includes('email')) {
        this.globalError = 'Adresse email invalide ou déjà utilisée.';
      } else {
        this.globalError = error?.message || 'Une erreur est survenue lors de la création du compte.';
      }

      this.toast.error('Erreur', this.globalError);
      this.scrollToTop();
    } finally {
      this.isLoading = false;
    }
  }

  private validateCurrentStep(): boolean {
    switch (this.step) {
      case 1:
        if (!this.name || this.name.length < 2) {
          this.globalError = 'Veuillez entrer un nom complet valide (min. 2 caractères).';
          return false;
        }
        if (!this.email || !this.isValidEmail(this.email)) {
          this.globalError = 'Veuillez entrer une adresse email valide.';
          return false;
        }
        if (!this.password || this.password.length < 6) {
          this.globalError = 'Le mot de passe doit contenir au moins 6 caractères.';
          return false;
        }
        if (!this.telephone) {
          this.globalError = 'Veuillez entrer un numéro de téléphone.';
          return false;
        }
        break;

      case 2:
        if (!this.ville) {
          this.globalError = 'Veuillez sélectionner une ville.';
          return false;
        }
        break;

      case 3:
        if (this.role === 'professional') {
          if (!this.categoryId) {
            this.globalError = 'Veuillez sélectionner une catégorie.';
            return false;
          }
          if (!this.tradeId) {
            this.globalError = 'Veuillez sélectionner un métier.';
            return false;
          }
        }
        break;
    }

    return true;
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
