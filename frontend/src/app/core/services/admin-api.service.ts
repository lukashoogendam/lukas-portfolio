import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  ProjectDetailDto,
  SkillDto,
  AssignmentDto,
  SocialDto
} from './portfolio-api.service';

export interface ProjectTranslationRequest {
  title: string;
  shortDescription?: string;
  description?: string;
  role?: string;
  highlights?: string;
  features?: string[];
}

export interface AssignmentTranslationRequest {
  title: string;
  description?: string;
}

export interface SkillTranslationRequest {
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminApiService {

  private readonly baseUrl = 'http://localhost:8080/api/admin';
  private http = inject(HttpClient);

  // === Projects ===
  createProject(request: unknown): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.post<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects`, request, { withCredentials: true }
    );
  }

  updateProject(slug: string, request: unknown): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.put<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}`, request, { withCredentials: true }
    );
  }

  deleteProject(slug: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/projects/${slug}`, { withCredentials: true }
    );
  }

  getProjectTranslation(slug: string, lang: string): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.get<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}/translations/${lang}`, { withCredentials: true }
    );
  }

  upsertProjectTranslation(slug: string, lang: string, request: ProjectTranslationRequest): Observable<ApiResponse<ProjectDetailDto>> {
    return this.http.put<ApiResponse<ProjectDetailDto>>(
      `${this.baseUrl}/projects/${slug}/translations/${lang}`, request, { withCredentials: true }
    );
  }

  // === Skills ===
  createSkill(request: unknown): Observable<ApiResponse<SkillDto>> {
    return this.http.post<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills`, request, { withCredentials: true }
    );
  }

  updateSkill(id: number, request: unknown): Observable<ApiResponse<SkillDto>> {
    return this.http.put<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}`, request, { withCredentials: true }
    );
  }

  deleteSkill(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/skills/${id}`, { withCredentials: true }
    );
  }

  getSkillTranslation(id: number, lang: string): Observable<ApiResponse<SkillDto>> {
    return this.http.get<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}/translations/${lang}`, { withCredentials: true }
    );
  }

  upsertSkillTranslation(id: number, lang: string, request: SkillTranslationRequest): Observable<ApiResponse<SkillDto>> {
    return this.http.put<ApiResponse<SkillDto>>(
      `${this.baseUrl}/skills/${id}/translations/${lang}`, request, { withCredentials: true }
    );
  }

  // === Assignments ===
  createAssignment(request: unknown): Observable<ApiResponse<AssignmentDto>> {
    return this.http.post<ApiResponse<AssignmentDto>>(
      `${this.baseUrl}/assignments`, request, { withCredentials: true }
    );
  }

  updateAssignment(id: number, request: unknown): Observable<ApiResponse<AssignmentDto>> {
    return this.http.put<ApiResponse<AssignmentDto>>(
      `${this.baseUrl}/assignments/${id}`, request, { withCredentials: true }
    );
  }

  deleteAssignment(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/assignments/${id}`, { withCredentials: true }
    );
  }

  getAssignmentTranslation(id: number, lang: string): Observable<ApiResponse<AssignmentDto>> {
    return this.http.get<ApiResponse<AssignmentDto>>(
      `${this.baseUrl}/assignments/${id}/translations/${lang}`, { withCredentials: true }
    );
  }

  upsertAssignmentTranslation(id: number, lang: string, request: AssignmentTranslationRequest): Observable<ApiResponse<AssignmentDto>> {
    return this.http.put<ApiResponse<AssignmentDto>>(
      `${this.baseUrl}/assignments/${id}/translations/${lang}`, request, { withCredentials: true }
    );
  }

  // === Socials ===
  createSocial(request: unknown): Observable<ApiResponse<SocialDto>> {
    return this.http.post<ApiResponse<SocialDto>>(
      `${this.baseUrl}/socials`, request, { withCredentials: true }
    );
  }

  updateSocial(id: number, request: unknown): Observable<ApiResponse<SocialDto>> {
    return this.http.put<ApiResponse<SocialDto>>(
      `${this.baseUrl}/socials/${id}`, request, { withCredentials: true }
    );
  }

  deleteSocial(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/socials/${id}`, { withCredentials: true }
    );
  }

  // === Files ===
  uploadFile(file: File): Observable<ApiResponse<{ filename: string; url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse<{ filename: string; url: string }>>(
      'http://localhost:8080/api/admin/files/upload',
      formData,
      { withCredentials: true }
    );
  }
}
