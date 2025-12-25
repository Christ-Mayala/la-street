import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(private title: Title, private meta: Meta) {}

  setTitle(title: string) {
    this.title.setTitle(title);
  }

  updateTags(tags: { description?: string; url?: string; image?: string; keywords?: string }) {
    if (tags.description) {
      this.meta.updateTag({ name: 'description', content: tags.description });
      this.meta.updateTag({ property: 'og:description', content: tags.description });
    }
    if (tags.url) {
      this.meta.updateTag({ property: 'og:url', content: tags.url });
    }
    if (tags.image) {
      this.meta.updateTag({ property: 'og:image', content: tags.image });
    }
    if (tags.keywords) {
      this.meta.updateTag({ name: 'keywords', content: tags.keywords });
    }
  }
}
