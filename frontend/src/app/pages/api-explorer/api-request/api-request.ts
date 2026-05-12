import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiExplorerService } from '../api-explorer.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-api-request',
  imports: [CommonModule, FormsModule],
  templateUrl: './api-request.html',
  styleUrl: '../api-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiRequestComponent {
  public apiState = inject(ApiExplorerService);
  public apiDisplayHost = environment.apiDisplayHost;

  get selectedEndpoint() { return this.apiState.selectedEndpoint; }
  get isLoading() { return this.apiState.isLoading; }
  get slugInput() { return this.apiState.slugInput; }
  get loginJson() { return this.apiState.loginJson; }
  get availableProjectSlugs() { return this.apiState.availableProjectSlugs; }

  setSlugInput(val: string) { this.apiState.slugInput.set(val); }
  setLoginJson(val: string) { this.apiState.loginJson.set(val); }

  getRequestUrl() { return this.apiState.getRequestUrl(); }
  sendRequest() { this.apiState.sendRequest(); }

  isLoginEndpoint() { return this.selectedEndpoint()?.path === '/api/auth/login'; }
  isLogoutEndpoint() { return this.selectedEndpoint()?.path === '/api/auth/logout'; }
  isProjectDetailEndpoint() { return this.selectedEndpoint()?.path === '/api/projects/{slug}'; }
  isSkillNameEndpoint() { return this.selectedEndpoint()?.inputType === 'skill-name'; }
  isSlugEndpoint() { return this.selectedEndpoint()?.inputType === 'slug-project'; }
}
