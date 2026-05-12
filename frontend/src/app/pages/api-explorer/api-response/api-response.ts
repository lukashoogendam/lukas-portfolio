import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NgxJsonViewerModule } from 'ngx-json-viewer';
import { ApiExplorerService } from '../api-explorer.service';
import { ProjectListDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-api-response',
  imports: [CommonModule, RouterLink, NgxJsonViewerModule],
  templateUrl: './api-response.html',
  styleUrl: '../api-explorer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ApiResponseComponent {
  public apiState = inject(ApiExplorerService);

  get selectedEndpoint() { return this.apiState.selectedEndpoint; }
  get responseData() { return this.apiState.responseData; }
  get responseStatus() { return this.apiState.responseStatus; }
  get responseTime() { return this.apiState.responseTime; }
  get isLoading() { return this.apiState.isLoading; }
  get hasError() { return this.apiState.hasError; }

  getStatusClass() { return this.apiState.getStatusClass(); }

  isProjectsEndpoint() { return this.selectedEndpoint()?.path === '/api/projects'; }
  isProjectsBySkillEndpoint() { return this.selectedEndpoint()?.path === '/api/projects/by-skill/{skillName}'; }

  getProjectList(): ProjectListDto[] {
    const data = this.responseData() as any;
    if (!data?.data || !Array.isArray(data.data)) return [];
    return data.data as ProjectListDto[];
  }
}
