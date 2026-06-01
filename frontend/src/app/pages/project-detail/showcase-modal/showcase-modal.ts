import { Component, input, output, inject, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-showcase-modal',
  templateUrl: './showcase-modal.html',
  styleUrl: './showcase-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseModalComponent {
  sc = input<any>();
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

  isYouTubeUrl(url: string): boolean {
    return url.includes('youtube.com') || url.includes('youtu.be');
  }

  closeModal() {
    this.close.emit();
  }
}
