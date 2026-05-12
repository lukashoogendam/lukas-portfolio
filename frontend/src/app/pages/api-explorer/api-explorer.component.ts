import { Component, signal, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { PortfolioApiService, ProjectListDto } from '../../core/services/portfolio-api.service';
import { AuthService } from '../../core/services/auth.service';
import { LanguageService } from '../../core/services/language.service';
import { HttpClient } from '@angular/common/http';

interface Endpoint {
  method: string;
  path: string;
  description: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
}

@Component({
  selector: 'app-api-explorer',
  imports: [CommonModule, FormsModule, RouterLink, NgxJsonViewerModule],
  templateUrl: './api-explorer.component.html',
  styleUrl: './api-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiExplorerComponent implements OnInit {

  endpoints: Endpoint[] = [
    { method: 'GET', path: '/api/profile', description: 'Get personal profile information' },
    { method: 'GET', path: '/api/skills', description: 'Get all technical skills' },
    { method: 'GET', path: '/api/projects', description: 'Get all portfolio projects' },
    { method: 'GET', path: '/api/projects/{slug}', description: 'Get a specific project by slug', hasInput: true, inputPlaceholder: 'youtube-dashboard' },
    { method: 'GET', path: '/api/assignments', description: 'Get all school assignments' },
    { method: 'GET', path: '/api/assignments/{slug}', description: 'Get a specific assignment by slug', hasInput: true, inputPlaceholder: 'assignment-1' },
    { method: 'POST', path: '/api/contact', description: 'Send a contact message' },
    { method: 'POST', path: '/api/auth/login', description: 'Admin login — returns JWT cookie' },
  ];

  selectedEndpoint = signal<Endpoint | null>(null);
  slugInput = signal('');
  responseData = signal<unknown>(null);
  responseStatus = signal<number | null>(null);
  responseTime = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  hasError = signal(false);

  // Request body fields
  contactJson = signal("{\n  \"name\" : \"\",\n  \"email\" : \"\",\n  \"message\" : \"\"\n}");
  loginJson = signal("{\n  \"email\" : \"admin@lukas.dev\",\n  \"password\" : \"admin123\"\n}");

  private apiService = inject(PortfolioApiService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private langService = inject(LanguageService);

  availableProjectSlugs = signal<string[]>([]);
  availableAssignmentSlugs = signal<string[]>([]);

  constructor() {
    effect(() => {
      // Track language changes
      this.langService.currentLang();
      // Only auto-resend if we have a GET endpoint selected without required slug input
      // or if it has a slug input and we have entered something
      const endpoint = this.selectedEndpoint();
      if (endpoint?.method === 'GET') {
        if (!endpoint.hasInput || this.slugInput()) {
          this.sendRequest();
        }
      }
    });
  }

  ngOnInit(): void {
    // Load available slugs for dropdowns
    this.apiService.getProjects().subscribe(res => {
      if (res.data) this.availableProjectSlugs.set(res.data.map(p => p.slug));
    });
    this.apiService.getAssignments().subscribe(res => {
      if (res.data) this.availableAssignmentSlugs.set(res.data.map(a => a.slug));
    });

    // Check if there is an endpoint specified in the query parameters
    this.route.queryParams.subscribe(params => {
      if (params['endpoint']) {
        const targetEndpoint = this.endpoints.find(e => e.path === params['endpoint']);
        if (targetEndpoint) {
          // If the endpoint is already selected, don't trigger again to avoid loops
          if (this.selectedEndpoint()?.path !== targetEndpoint.path) {
            this.selectEndpoint(targetEndpoint);
          }
        }
      } else {
        // Standaard gedrag: open het profile endpoint
        if (!this.selectedEndpoint()) {
          this.selectEndpoint(this.endpoints[0]); // /api/profile is index 0
        }
      }
    });
  }

  selectEndpoint(endpoint: Endpoint): void {
    this.selectedEndpoint.set(endpoint);
    this.responseData.set(null);
    this.responseStatus.set(null);
    this.responseTime.set(null);
    this.hasError.set(false);
    this.slugInput.set(''); // Empty by default for dropdown

    // UX Verbetering: Auto-send voor GET requests (geen body nodig en geen verplichte input)
    if (endpoint.method === 'GET' && !endpoint.hasInput) {
      this.sendRequest();
    }
  }

  getRequestUrl(): string {
    const endpoint = this.selectedEndpoint();
    if (!endpoint) return '';
    
    let path = endpoint.path;
    if (endpoint.hasInput) {
      path = path.replace('{slug}', this.slugInput() || '{slug}');
    }
    
    if (endpoint.method === 'GET') {
      return `${path}?lang=${this.langService.currentLang()}`;
    }
    
    return path;
  }

  sendRequest(): void {
    const endpoint = this.selectedEndpoint();
    if (!endpoint) return;

    this.isLoading.set(true);
    this.hasError.set(false);
    this.responseData.set(null);
    const startTime = Date.now();

    const path = endpoint.path;

    // UX Verbetering: Artificiële vertraging zodat je de loading animatie ziet
    // en het meer als een echte remote API call voelt.
    setTimeout(() => {
      switch (path) {
        case '/api/profile':
          this.apiService.getProfile().subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/skills':
          this.apiService.getSkills().subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/projects':
          this.apiService.getProjects().subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/projects/{slug}':
          if (!this.slugInput()) {
            this.handleError({ error: { message: 'Slug is required' }, status: 400 }, startTime);
            return;
          }
          this.apiService.getProjectBySlug(this.slugInput()).subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/assignments':
          this.apiService.getAssignments().subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/assignments/{slug}':
          if (!this.slugInput()) {
            this.handleError({ error: { message: 'Slug is required' }, status: 400 }, startTime);
            return;
          }
          this.apiService.getAssignmentBySlug(this.slugInput()).subscribe({
            next: (res) => this.handleSuccess(res, startTime),
            error: (err) => this.handleError(err, startTime)
          });
          break;
        case '/api/contact':
          try {
            const contactData = JSON.parse(this.contactJson());
            this.apiService.sendContactMessage(contactData).subscribe({
              next: (res) => this.handleSuccess(res, startTime),
              error: (err) => this.handleError(err, startTime)
            });
          } catch (e) {
            this.handleError({ error: { message: 'Invalid JSON body' }, status: 400 }, startTime);
          }
          break;
        case '/api/auth/login':
          try {
            const loginData = JSON.parse(this.loginJson());
            this.http.post('http://localhost:8080/api/auth/login', loginData, { withCredentials: true }).subscribe({
              next: (res) => this.handleSuccess(res, startTime),
              error: (err) => this.handleError(err, startTime)
            });
          } catch (e) {
            this.handleError({ error: { message: 'Invalid JSON body' }, status: 400 }, startTime);
          }
          break;
        default:
          break;
      }
    }, 400); // 400ms delay
  }

  private handleSuccess(res: unknown, startTime: number): void {
    this.responseData.set(res);
    this.responseStatus.set((res as any)?.status || 200);
    this.responseTime.set(Date.now() - startTime);
    this.isLoading.set(false);
  }

  private handleError(err: unknown, startTime: number): void {
    const errorObj = err as any;
    this.responseData.set(errorObj.error || { status: errorObj.status, message: errorObj.message });
    this.responseStatus.set(errorObj.status);
    this.responseTime.set(Date.now() - startTime);
    this.isLoading.set(false);
    this.hasError.set(true);
  }

  getStatusClass(): string {
    const status = this.responseStatus();
    if (!status) return '';
    const isSuccess = status >= 200 && status < 300;
    if (isSuccess) return 'success';
    const isWarning = status >= 400 && status < 500;
    if (isWarning) return 'warning';
    return 'error';
  }

  isContactEndpoint(): boolean {
    return this.selectedEndpoint()?.path === '/api/contact';
  }

  isLoginEndpoint(): boolean {
    return this.selectedEndpoint()?.path === '/api/auth/login';
  }

  isProfileEndpoint(): boolean {
    return this.selectedEndpoint()?.path === '/api/profile';
  }

  isProjectsEndpoint(): boolean { return this.selectedEndpoint()?.path === '/api/projects'; }
  isProjectDetailEndpoint(): boolean { return this.selectedEndpoint()?.path === '/api/projects/{slug}'; }
  isAssignmentsEndpoint(): boolean { return this.selectedEndpoint()?.path === '/api/assignments'; }
  isAssignmentDetailEndpoint(): boolean { return this.selectedEndpoint()?.path === '/api/assignments/{slug}'; }
  isSkillsEndpoint(): boolean {
    return this.selectedEndpoint()?.path === '/api/skills';
  }

  getProjectList(): ProjectListDto[] {
    const data = this.responseData() as any;
    if (!data?.data || !Array.isArray(data.data)) return [];
    return data.data as ProjectListDto[];
  }
}
