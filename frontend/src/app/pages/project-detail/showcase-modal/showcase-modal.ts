import { Component, Input, Output, EventEmitter, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-showcase-modal',
  imports: [CommonModule],
  templateUrl: './showcase-modal.html',
  styleUrl: '../project-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowcaseModalComponent {
  @Input() sc: any;
  @Output() close = new EventEmitter<void>();

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
