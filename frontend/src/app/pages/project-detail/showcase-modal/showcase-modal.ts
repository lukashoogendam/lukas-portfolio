import { Component, input, output, inject } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ShowcaseDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-showcase-modal',
  templateUrl: './showcase-modal.html',
  styleUrl: './showcase-modal.scss'
})
export class ShowcaseModalComponent {
  sc = input<ShowcaseDto>();
  close = output<void>();

  private sanitizer = inject(DomSanitizer);

  getSafeEmbedHtml(embedCode?: string): SafeHtml {
    if (!embedCode) return '';
    return this.sanitizer.bypassSecurityTrustHtml(embedCode);
  }

  getSafeDemoUrl(url?: string): SafeResourceUrl {
    if (!url) return '';
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  isYouTubeUrl(url?: string): boolean {
    return !!url && (url.includes('youtube.com') || url.includes('youtu.be'));
  }

  closeModal() {
    this.close.emit();
  }
}
