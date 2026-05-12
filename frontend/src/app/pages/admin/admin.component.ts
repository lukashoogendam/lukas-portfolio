import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AdminApiService } from '../../core/services/admin-api.service';
import {
  PortfolioApiService,
  ProjectListDto,
  SkillDto,
  AssignmentDto,
  SocialDto
} from '../../core/services/portfolio-api.service';

type Tab = 'projects' | 'skills' | 'assignments' | 'socials';
type TranslationLang = 'nl' | 'en';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminComponent implements OnInit {

  authService = inject(AuthService);
  private apiService = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);

  activeTab = signal<Tab>('projects');
  successMessage = signal<string | null>(null);

  // Data lists
  projects = signal<ProjectListDto[]>([]);
  skills = signal<SkillDto[]>([]);
  assignments = signal<AssignmentDto[]>([]);
  socials = signal<SocialDto[]>([]);

  // Form state
  showForm = signal(false);
  isEditing = signal(false);
  formLang = signal<TranslationLang>('nl');
  formData = signal<Record<string, unknown>>({});
  editSlug = signal<string | null>(null);
  editId = signal<number | null>(null);
  uploadingField = signal<string | null>(null);

  // Translation state within form
  translationData = signal<Record<string, unknown>>({});
  translationLoading = signal(false);
  translationLoaded = signal(false);

  ngOnInit(): void {
    this.loadProjects();
    this.loadSkills();
    this.loadAssignments();
    this.loadSocials();
  }

  switchTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.closeForm();
  }

  // === Data Loading ===
  loadProjects(): void {
    this.apiService.getProjects().subscribe({
      next: (res) => this.projects.set(res.data)
    });
  }

  loadSkills(): void {
    this.apiService.getSkills().subscribe({
      next: (res) => this.skills.set(res.data)
    });
  }

  loadAssignments(): void {
    this.apiService.getAssignments().subscribe({
      next: (res) => this.assignments.set(res.data)
    });
  }

  loadSocials(): void {
    this.apiService.getSocials().subscribe({
      next: (res) => this.socials.set(res.data)
    });
  }

  // === Form Management ===
  openCreateForm(): void {
    this.isEditing.set(false);
    this.formData.set({});
    this.translationData.set({});
    this.translationLoaded.set(false);
    this.formLang.set('nl');
    this.editSlug.set(null);
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(item: Record<string, unknown>): void {
    const tab = this.activeTab();
    this.isEditing.set(true);
    this.formLang.set('nl');
    this.translationData.set({});
    this.translationLoaded.set(false);

    if (tab === 'projects' && item['slug']) {
      // Fetch full project detail to load images and description
      this.apiService.getProjectBySlug(item['slug'] as string).subscribe({
        next: (res) => {
          const fullProject = res.data;
          this.formData.set({
            ...fullProject,
            images: fullProject.images || [],
            showcases: fullProject.showcases || []
          });
          this.editSlug.set(fullProject.slug);
          this.editId.set(fullProject.id);
          this.showForm.set(true);
        }
      });
    } else {
      this.formData.set({ ...item });
      if (item['slug']) this.editSlug.set(item['slug'] as string);
      if (item['id']) this.editId.set(item['id'] as number);
      this.showForm.set(true);
    }
  }

  closeForm(): void {
    this.showForm.set(false);
    this.formData.set({});
    this.translationData.set({});
    this.translationLoaded.set(false);
    this.formLang.set('nl');
    this.editSlug.set(null);
    this.editId.set(null);
  }

  switchFormLang(lang: TranslationLang): void {
    if (this.formLang() === lang) return;
    this.formLang.set(lang);

    if (lang === 'en' && !this.translationLoaded() && this.isEditing()) {
      this.loadTranslationForCurrentForm();
    }
  }

  loadTranslationForCurrentForm(): void {
    const tab = this.activeTab();
    this.translationLoading.set(true);

    if (tab === 'projects') {
      const slug = this.editSlug()!;
      this.adminApi.getProjectTranslation(slug, 'en').subscribe({
        next: (res) => {
          this.translationData.set({ ...res.data });
          this.translationLoading.set(false);
          this.translationLoaded.set(true);
        },
        error: () => {
          this.translationData.set({ title: '', shortDescription: '', description: '', role: '', highlights: '' });
          this.translationLoading.set(false);
          this.translationLoaded.set(true);
        }
      });
    } else if (tab === 'skills') {
      const id = this.editId()!;
      this.adminApi.getSkillTranslation(id, 'en').subscribe({
         next: (res) => {
             this.translationData.set({ ...res.data });
             this.translationLoading.set(false);
             this.translationLoaded.set(true);
         },
         error: () => {
             this.translationData.set({ description: '' });
             this.translationLoading.set(false);
             this.translationLoaded.set(true);
         }
      });
    } else if (tab === 'assignments') {
      const id = this.editId()!;
      this.adminApi.getAssignmentTranslation(id, 'en').subscribe({
         next: (res) => {
             this.translationData.set({ ...res.data });
             this.translationLoading.set(false);
             this.translationLoaded.set(true);
         },
         error: () => {
             this.translationData.set({ title: '', description: '' });
             this.translationLoading.set(false);
             this.translationLoaded.set(true);
         }
      });
    }
  }

  updateField(key: string, value: unknown): void {
    if (this.formLang() === 'nl') {
      this.formData.update(data => ({ ...data, [key]: value }));
    } else {
      this.translationData.update(data => ({ ...data, [key]: value }));
    }
  }

  getFieldValue(key: string): any {
    if (this.formLang() === 'nl') {
      return this.formData()[key] || '';
    }
    return this.translationData()[key] || '';
  }

  saveItem(): void {
    const tab = this.activeTab();
    const data = this.formData();
    const editing = this.isEditing();

    const saveTranslationIfLoaded = () => {
       if (this.translationLoaded()) {
           const transData = this.translationData() as Record<string, unknown>;
           if (tab === 'projects') {
               this.adminApi.upsertProjectTranslation(this.editSlug()!, 'en', {
                 title: transData['title'] as string || '',
                 shortDescription: transData['shortDescription'] as string || '',
                 description: transData['description'] as string || '',
                 role: transData['role'] as string || '',
                 highlights: transData['highlights'] as string || ''
               }).subscribe();
           } else if (tab === 'skills') {
               this.adminApi.upsertSkillTranslation(this.editId()!, 'en', {
                 description: transData['description'] as string || ''
               }).subscribe();
           } else if (tab === 'assignments') {
               this.adminApi.upsertAssignmentTranslation(this.editId()!, 'en', {
                 title: transData['title'] as string || '',
                 description: transData['description'] as string || ''
               }).subscribe();
           }
       }
    };

    switch (tab) {
      case 'projects':
        if (editing) {
          this.adminApi.updateProject(this.editSlug()!, data).subscribe({
            next: () => {
              saveTranslationIfLoaded();
              this.onSaveSuccess('Project bijgewerkt', 'projects');
            }
          });
        } else {
          this.adminApi.createProject(data).subscribe({
            next: () => this.onSaveSuccess('Project aangemaakt', 'projects')
          });
        }
        break;
      case 'skills':
        if (editing) {
          this.adminApi.updateSkill(this.editId()!, data).subscribe({
            next: () => {
              saveTranslationIfLoaded();
              this.onSaveSuccess('Skill bijgewerkt', 'skills');
            }
          });
        } else {
          this.adminApi.createSkill(data).subscribe({
            next: () => this.onSaveSuccess('Skill aangemaakt', 'skills')
          });
        }
        break;
      case 'assignments':
        if (editing) {
          this.adminApi.updateAssignment(this.editId()!, data).subscribe({
            next: () => {
              saveTranslationIfLoaded();
              this.onSaveSuccess('Assignment bijgewerkt', 'assignments');
            }
          });
        } else {
          this.adminApi.createAssignment(data).subscribe({
            next: () => this.onSaveSuccess('Assignment aangemaakt', 'assignments')
          });
        }
        break;
      case 'socials':
        if (editing) {
          this.adminApi.updateSocial(this.editId()!, data).subscribe({
            next: () => this.onSaveSuccess('Social bijgewerkt', 'socials')
          });
        } else {
          this.adminApi.createSocial(data).subscribe({
            next: () => this.onSaveSuccess('Social aangemaakt', 'socials')
          });
        }
        break;
    }
  }

  deleteItem(type: Tab, identifier: string | number): void {
    const confirmed = confirm('Weet je zeker dat je dit wilt verwijderen?');
    if (!confirmed) return;

    switch (type) {
      case 'projects':
        this.adminApi.deleteProject(identifier as string).subscribe({
          next: () => this.onSaveSuccess('Project verwijderd', 'projects')
        });
        break;
      case 'skills':
        this.adminApi.deleteSkill(identifier as number).subscribe({
          next: () => this.onSaveSuccess('Skill verwijderd', 'skills')
        });
        break;
      case 'assignments':
        this.adminApi.deleteAssignment(identifier as number).subscribe({
          next: () => this.onSaveSuccess('Assignment verwijderd', 'assignments')
        });
        break;
      case 'socials':
        this.adminApi.deleteSocial(identifier as number).subscribe({
          next: () => this.onSaveSuccess('Social verwijderd', 'socials')
        });
        break;
    }
  }

  private onSaveSuccess(message: string, reload: Tab): void {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);

    switch (reload) {
      case 'projects': this.loadProjects(); break;
      case 'skills': this.loadSkills(); break;
      case 'assignments': this.loadAssignments(); break;
      case 'socials': this.loadSocials(); break;
    }
  }

  logout(): void {
    this.authService.logout();
  }

  // === File Upload ===
  onFileSelected(event: Event, fieldKey: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set(fieldKey);

    this.adminApi.uploadFile(file).subscribe({
      next: (res) => {
        this.updateField(fieldKey, res.data.url);
        this.uploadingField.set(null);
        this.successMessage.set(`Bestand geüpload: ${res.data.filename}`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.uploadingField.set(null);
        this.successMessage.set('Upload mislukt — controleer het bestandstype (PDF/afbeelding)');
        setTimeout(() => this.successMessage.set(null), 4000);
      }
    });

    input.value = '';
  }

  // === Project Images Manager ===
  getProjectImages(): any[] {
    return (this.formData()['images'] as any[]) || [];
  }

  updateImageTitle(index: number, title: string): void {
    const images = [...this.getProjectImages()];
    images[index].title = title;
    this.updateField('images', images);
  }

  removeProjectImage(index: number): void {
    const images = [...this.getProjectImages()];
    images.splice(index, 1);
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  moveImageUp(index: number): void {
    if (index === 0) return;
    const images = [...this.getProjectImages()];
    const temp = images[index];
    images[index] = images[index - 1];
    images[index - 1] = temp;
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  moveImageDown(index: number): void {
    const images = [...this.getProjectImages()];
    if (index === images.length - 1) return;
    const temp = images[index];
    images[index] = images[index + 1];
    images[index + 1] = temp;
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  private recalculateImageSortOrder(images: any[]): void {
    images.forEach((img, i) => {
      img.sortOrder = i;
    });
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set('newImage');

    this.adminApi.uploadFile(file).subscribe({
      next: (res) => {
        const images = [...this.getProjectImages()];
        images.push({
          title: file.name.split('.')[0],
          imageUrl: res.data.url,
          sortOrder: images.length
        });
        this.updateField('images', images);

        this.uploadingField.set(null);
        this.successMessage.set(`Afbeelding geüpload: ${res.data.filename}`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.uploadingField.set(null);
        this.successMessage.set('Upload mislukt — controleer of het een geldige afbeelding is');
        setTimeout(() => this.successMessage.set(null), 4000);
      }
    });

    input.value = '';
  }

  // === Project Showcases Manager ===
  getProjectShowcases(): any[] {
    return (this.formData()['showcases'] as any[]) || [];
  }

  addProjectShowcase(type: string): void {
    const showcases = [...this.getProjectShowcases()];
    showcases.push({
      type: type,
      title: 'Nieuwe ' + type,
      url: '',
      embedCode: '',
      sortOrder: showcases.length
    });
    this.updateField('showcases', showcases);
  }

  updateShowcaseField(index: number, field: string, value: any): void {
    const showcases = [...this.getProjectShowcases()];
    showcases[index][field] = value;
    this.updateField('showcases', showcases);
  }

  removeProjectShowcase(index: number): void {
    const showcases = [...this.getProjectShowcases()];
    showcases.splice(index, 1);
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  moveShowcaseUp(index: number): void {
    if (index === 0) return;
    const showcases = [...this.getProjectShowcases()];
    const temp = showcases[index];
    showcases[index] = showcases[index - 1];
    showcases[index - 1] = temp;
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  moveShowcaseDown(index: number): void {
    const showcases = [...this.getProjectShowcases()];
    if (index === showcases.length - 1) return;
    const temp = showcases[index];
    showcases[index] = showcases[index + 1];
    showcases[index + 1] = temp;
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  private recalculateShowcaseSortOrder(showcases: any[]): void {
    showcases.forEach((sc, i) => {
      sc.sortOrder = i;
    });
  }

  onShowcaseFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set(`showcase_${index}`);

    this.adminApi.uploadFile(file).subscribe({
      next: (res) => {
        this.updateShowcaseField(index, 'url', res.data.url);
        this.uploadingField.set(null);
        this.successMessage.set(`Bestand geüpload: ${res.data.filename}`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.uploadingField.set(null);
        this.successMessage.set('Upload mislukt — controleer het bestandstype');
        setTimeout(() => this.successMessage.set(null), 4000);
      }
    });

    input.value = '';
  }

  // === Project Documents Manager ===
  getProjectDocuments(): any[] {
    return (this.formData()['documents'] as any[]) || [];
  }

  addProjectDocument(): void {
    const documents = [...this.getProjectDocuments()];
    documents.push({
      title: 'Nieuw Document',
      url: '',
      sortOrder: documents.length
    });
    this.updateField('documents', documents);
  }

  updateDocumentField(index: number, field: string, value: any): void {
    const documents = [...this.getProjectDocuments()];
    documents[index][field] = value;
    this.updateField('documents', documents);
  }

  removeProjectDocument(index: number): void {
    const documents = [...this.getProjectDocuments()];
    documents.splice(index, 1);
    this.recalculateDocumentSortOrder(documents);
    this.updateField('documents', documents);
  }

  moveDocumentUp(index: number): void {
    if (index === 0) return;
    const documents = [...this.getProjectDocuments()];
    const temp = documents[index];
    documents[index] = documents[index - 1];
    documents[index - 1] = temp;
    this.recalculateDocumentSortOrder(documents);
    this.updateField('documents', documents);
  }

  moveDocumentDown(index: number): void {
    const documents = [...this.getProjectDocuments()];
    if (index === documents.length - 1) return;
    const temp = documents[index];
    documents[index] = documents[index + 1];
    documents[index + 1] = temp;
    this.recalculateDocumentSortOrder(documents);
    this.updateField('documents', documents);
  }

  private recalculateDocumentSortOrder(documents: any[]): void {
    documents.forEach((doc, i) => {
      doc.sortOrder = i;
    });
  }

  onDocumentFileSelected(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set(`document_${index}`);

    this.adminApi.uploadFile(file).subscribe({
      next: (res) => {
        this.updateDocumentField(index, 'url', res.data.url);
        if (this.getProjectDocuments()[index].title === 'Nieuw Document') {
            this.updateDocumentField(index, 'title', file.name.split('.')[0]);
        }
        this.uploadingField.set(null);
        this.successMessage.set(`Bestand geüpload: ${res.data.filename}`);
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: () => {
        this.uploadingField.set(null);
        this.successMessage.set('Upload mislukt');
        setTimeout(() => this.successMessage.set(null), 4000);
      }
    });

    input.value = '';
  }
}
