import { Component, input, computed, signal, ViewEncapsulation, OnInit, OnDestroy, inject, ChangeDetectorRef, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { JsonPipe } from '@angular/common';
@Component({
  selector: 'app-api-terminal',
  imports: [JsonPipe],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="code-window" #terminalEl>
      <div class="code-header">
        <div class="code-dots">
          <span class="dot red"></span>
          <span class="dot yellow"></span>
          <span class="dot green"></span>
        </div>
        <span class="code-title">bash - {{ endpoint() }}</span>
      </div>
      <div class="code-body">
        <div class="terminal-line">
          <span class="prompt-user">user&#64;lukasportfolio.site</span><span class="prompt-char">:~$</span>
        </div>
        <div class="terminal-line command-line">
          <span class="typed-command">{{ displayedCommand() }}</span><span class="cursor" [class.hidden]="phase() !== 'typing'">▊</span>
        </div>
        @if (phase() === 'loading' || phase() === 'done') {
          <div class="terminal-loading" [class.fade-in]="true">
            <span class="spinner">⠋</span> Connecting to {{ endpoint() }}...
          </div>
        }
        @if (phase() === 'done') {
          <div class="terminal-response fade-in">
            <span class="status-line">
              <span class="status-ok">✓</span> HTTP/1.1 <span class="status-code">200 OK</span>
              <span class="response-time">{{ responseTime() }}ms</span>
            </span>
            @if (jsonPayload()) {
              <pre class="json-payload">{{ jsonPayload() | json }}</pre>
            }
          </div>
        }
      </div>
    </div>
  `,
  styleUrls: ['./api-terminal.component.scss']
})
export class ApiTerminalComponent implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private terminalEl = viewChild<ElementRef>('terminalEl');

  endpoint = input('/api/v1/resource');
  jsonPayload = input<unknown>();

  fullCommand = computed(() => {
    const baseUrl = 'https://lukasportfolio.site/api';
    return `curl -X GET ${baseUrl}${this.endpoint()}`;
  });

  displayedCommand = signal('');
  phase = signal<'idle' | 'typing' | 'loading' | 'done'>('idle');
  responseTime = signal(0);

  private timers: ReturnType<typeof setTimeout>[] = [];
  private observer: IntersectionObserver | null = null;
  private hasPlayed = false;

  constructor() {
    afterNextRender(() => {
      this.setupIntersectionObserver();
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.timers.forEach(t => clearTimeout(t));
    this.observer?.disconnect();
  }

  private setupIntersectionObserver() {
    const el = this.terminalEl()?.nativeElement;
    if (!el) {
      // Fallback: start immediately if element not found
      this.startAnimation();
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !this.hasPlayed) {
          this.hasPlayed = true;
          this.startAnimation();
          this.observer?.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    this.observer.observe(el);
  }

  private startAnimation() {
    const command = this.fullCommand();
    this.phase.set('typing');
    this.cdr.markForCheck();

    let i = 0;
    const typeSpeed = 30; // ms per character

    const typeNext = () => {
      if (i <= command.length) {
        this.displayedCommand.set(command.substring(0, i));
        this.cdr.markForCheck();
        i++;
        this.timers.push(setTimeout(typeNext, typeSpeed + Math.random() * 20));
      } else {
        // Typing complete → show loading
        this.timers.push(setTimeout(() => {
          this.phase.set('loading');
          this.cdr.markForCheck();

          // After "loading" delay → show response
          const fakeMs = 80 + Math.floor(Math.random() * 150);
          this.timers.push(setTimeout(() => {
            this.responseTime.set(fakeMs);
            this.phase.set('done');
            this.cdr.markForCheck();
          }, 800));
        }, 300));
      }
    };

    // Small initial delay before typing starts
    this.timers.push(setTimeout(typeNext, 600));
  }
}
