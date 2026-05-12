import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PortfolioApiService, ProjectListDto, ApiResponse } from '../../core/services/portfolio-api.service';
import { LanguageService } from '../../core/services/language.service';
import { environment } from '../../../environments/environment';

export interface Endpoint {
  method: string;
  path: string;
  description: string;
  hasInput?: boolean;
  inputPlaceholder?: string;
  inputType?: 'slug-project' | 'skill-name';
}

export interface EndpointGroup {
  name: string;
  icon: string;
  expanded: boolean;
  endpoints: Endpoint[];
}

@Injectable({ providedIn: 'root' })
export class ApiExplorerService {
  private apiService = inject(PortfolioApiService);
  private http = inject(HttpClient);
  private langService = inject(LanguageService);

  endpointGroups = signal<EndpointGroup[]>([
    {
      name: 'Profile', icon: '👤', expanded: true,
      endpoints: [ { method: 'GET', path: '/api/profile', description: 'Get personal profile information' } ]
    },
    {
      name: 'Projects', icon: '📂', expanded: true,
      endpoints: [
        { method: 'GET', path: '/api/projects', description: 'Get all portfolio projects' },
        { method: 'GET', path: '/api/projects/{slug}', description: 'Get a specific project by slug', hasInput: true, inputType: 'slug-project', inputPlaceholder: 'youtube-dashboard' },
        { method: 'GET', path: '/api/projects/by-skill/{skillName}', description: 'Get projects filtered by skill name', hasInput: true, inputType: 'skill-name', inputPlaceholder: 'Angular' },
      ]
    },
    {
      name: 'Skills', icon: '⚡', expanded: true,
      endpoints: [ { method: 'GET', path: '/api/skills', description: 'Get all technical skills' } ]
    },
    {
      name: 'Socials', icon: '🔗', expanded: true,
      endpoints: [ { method: 'GET', path: '/api/socials', description: 'Get all social media links' } ]
    },
    {
      name: 'Auth', icon: '🔒', expanded: true,
      endpoints: [
        { method: 'POST', path: '/api/auth/login', description: 'Admin login - returns JWT cookie' },
        { method: 'POST', path: '/api/auth/logout', description: 'Admin logout - clears JWT cookie' },
      ]
    }
  ]);

  get allEndpoints(): Endpoint[] { return this.endpointGroups().flatMap(g => g.endpoints); }

  selectedEndpoint = signal<Endpoint | null>(null);
  slugInput = signal('');
  loginJson = signal("{\n  \"email\" : \"user@gmail.com\",\n  \"password\" : \"Test123!\"\n}");
  
  responseData = signal<unknown>(null);
  responseStatus = signal<number | null>(null);
  responseTime = signal<number | null>(null);
  isLoading = signal<boolean>(false);
  hasError = signal(false);
  isMobileSidebarOpen = signal(false);
  
  availableProjectSlugs = signal<string[]>([]);

  init() {
    this.apiService.getProjects().subscribe((res: any) => {
      if (res.data) this.availableProjectSlugs.set(res.data.map((p: any) => p.slug));
    });
  }

  toggleMobileSidebar() {
    this.isMobileSidebarOpen.update(v => !v);
  }

  selectEndpoint(endpoint: Endpoint) {
    this.selectedEndpoint.set(endpoint);
    this.responseData.set(null);
    this.responseStatus.set(null);
    this.responseTime.set(null);
    this.hasError.set(false);
    this.slugInput.set('');
    this.isMobileSidebarOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (endpoint.method === 'GET' && !endpoint.hasInput) {
      this.sendRequest();
    }
  }

  getRequestUrl(): string {
    const endpoint = this.selectedEndpoint();
    if (!endpoint) return '';
    let path = endpoint.path;
    if (endpoint.inputType === 'slug-project') {
      path = path.replace('{slug}', this.slugInput() || '{slug}');
    } else if (endpoint.inputType === 'skill-name') {
      path = path.replace('{skillName}', this.slugInput() || '{skillName}');
    }
    if (endpoint.method === 'GET') {
      return `${path}?lang=${this.langService.currentLang()}`;
    }
    return path;
  }

  sendRequest() {
    const endpoint = this.selectedEndpoint();
    if (!endpoint) return;
    
    this.isLoading.set(true);
    this.hasError.set(false);
    this.responseData.set(null);
    const startTime = Date.now();
    const path = endpoint.path;
    
    setTimeout(() => {
      switch (path) {
        case '/api/profile':
          this.apiService.getProfile().subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/skills':
          this.apiService.getSkills().subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/projects':
          this.apiService.getProjects().subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/projects/{slug}':
          if (!this.slugInput()) {
            this.handleError({ error: { message: 'Slug is required' }, status: 400 }, startTime);
            return;
          }
          this.apiService.getProjectBySlug(this.slugInput()).subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/projects/by-skill/{skillName}':
          if (!this.slugInput()) {
            this.handleError({ error: { message: 'Skill name is required' }, status: 400 }, startTime);
            return;
          }
          this.apiService.getProjectsBySkill(this.slugInput()).subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/socials':
          this.apiService.getSocials().subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
        case '/api/auth/login':
          try {
            const loginData = JSON.parse(this.loginJson());
            this.http.post(`${environment.apiUrl}/auth/login`, loginData, { withCredentials: true }).subscribe({
              next: (res: any) => this.handleSuccess(res, startTime),
              error: (err: any) => this.handleError(err, startTime)
            });
          } catch (e) {
            this.handleError({ error: { message: 'Invalid JSON body' }, status: 400 }, startTime);
          }
          break;
        case '/api/auth/logout':
          this.http.post(`${environment.apiUrl}/auth/logout`, {}, { withCredentials: true }).subscribe({
            next: (res: any) => this.handleSuccess(res, startTime),
            error: (err: any) => this.handleError(err, startTime)
          });
          break;
      }
    }, 400);
  }

  private handleSuccess(res: unknown, startTime: number) {
    this.responseData.set(res);
    this.responseStatus.set((res as any)?.status || 200);
    this.responseTime.set(Date.now() - startTime);
    this.isLoading.set(false);
  }

  private handleError(err: unknown, startTime: number) {
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
    if (status >= 200 && status < 300) return 'success';
    if (status >= 400 && status < 500) return 'warning';
    return 'error';
  }
}
