import { Component, input, output, inject } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ShowcaseDto } from '../../../core/services/portfolio-api.service';

// Tags that can execute code or load/navigate outside the embed's own markup.
// Removed wholesale (including their content) rather than just unwrapped.
const DISALLOWED_TAGS = ['script', 'iframe', 'object', 'embed', 'applet', 'base', 'form', 'noscript'];

// Attributes that can execute code: inline event handlers and javascript: URLs.
const URL_ATTRIBUTES = new Set(['href', 'src', 'action', 'formaction', 'xlink:href']);

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
    return this.sanitizer.bypassSecurityTrustHtml(sanitizeEmbedCode(embedCode));
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

// embedCode comes from project JSON data and is trusted only as far as the
// repo's own content pipeline; sanitize it before it's ever passed to
// bypassSecurityTrustHtml so a compromised or malformed embed can't run code.
function sanitizeEmbedCode(html: string): string {
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const removeSelector = [...DISALLOWED_TAGS, 'meta[http-equiv]'].join(',');
  doc.querySelectorAll(removeSelector).forEach((el) => el.remove());

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_ELEMENT);
  let node = walker.nextNode() as Element | null;
  while (node) {
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name.toLowerCase();
      if (name.startsWith('on') || name === 'srcdoc') {
        node.removeAttribute(attr.name);
      } else if (URL_ATTRIBUTES.has(name) && /^\s*javascript:/i.test(attr.value)) {
        node.removeAttribute(attr.name);
      }
    }
    node = walker.nextNode() as Element | null;
  }

  return doc.body.innerHTML;
}
