import { Component, OnInit, signal, inject, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PortfolioApiService, ProjectListDto, SkillDto } from '../../../core/services/portfolio-api.service';

type TranslationLang = 'nl' | 'en';

@Component({
  selector: 'app-admin-projects',
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-projects.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminProjectsComponent implements OnInit {
  private apiService = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);

  projects = signal<ProjectListDto[]>([]);
  skills = signal<SkillDto[]>([]);
  successMessage = signal<string | null>(null);

  showForm = signal(false);
  isEditing = signal(false);
  formLang = signal<TranslationLang>('nl');
  formData = signal<Record<string, unknown>>({});
  editSlug = signal<string | null>(null);
  uploadingField = signal<string | null>(null);

  translationData = signal<Record<string, unknown>>({});
  translationLoading = signal(false);
  translationLoaded = signal(false);

  ngOnInit() {
    this.loadProjects();
    this.loadSkills();
  }

  loadProjects() {
    this.apiService.getProjects().subscribe(res => this.projects.set(res.data));
  }

  loadSkills() {
    this.apiService.getSkills().subscribe(res => this.skills.set(res.data));
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.formData.set({});
    this.translationData.set({});
    this.translationLoaded.set(false);
    this.formLang.set('nl');
    this.editSlug.set(null);
    this.showForm.set(true);
  }

  openEditForm(project: ProjectListDto) {
    this.isEditing.set(true);
    this.formLang.set('nl');
    this.translationData.set({});
    this.translationLoaded.set(false);

    this.apiService.getProjectBySlug(project.slug).subscribe(res => {
      const fullProject = res.data;
      this.formData.set({
        ...(fullProject as any),
        images: fullProject.images || [],
        showcases: fullProject.showcases || [],
        skillIds: fullProject.skillIds || []
      });
      this.editSlug.set(fullProject.slug);
      this.showForm.set(true);
    });
  }

  closeForm() {
    this.showForm.set(false);
    this.formData.set({});
    this.editSlug.set(null);
  }

  switchFormLang(lang: TranslationLang) {
    if (this.formLang() === lang) return;
    this.formLang.set(lang);
    if (lang === 'en' && !this.translationLoaded() && this.isEditing()) {
      this.loadTranslation();
    }
  }

  loadTranslation() {
    this.translationLoading.set(true);
    this.adminApi.getProjectTranslation(this.editSlug()!, 'en').subscribe({
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
  }

  updateField(key: string, value: unknown) {
    if (this.formLang() === 'nl') {
      this.formData.update(data => ({ ...data, [key]: value }));
    } else {
      this.translationData.update(data => ({ ...data, [key]: value }));
    }
  }

  getFieldValue(key: string): any {
    return this.formLang() === 'nl' ? this.formData()[key] || '' : this.translationData()[key] || '';
  }

  saveItem() {
    const data = this.formData();
    const saveTranslation = () => {
      if (this.translationLoaded()) {
        const transData = this.translationData() as any;
        this.adminApi.upsertProjectTranslation(this.editSlug()!, 'en', {
          title: transData.title || '',
          shortDescription: transData.shortDescription || '',
          description: transData.description || '',
          role: transData.role || '',
          highlights: transData.highlights || ''
        }).subscribe();
      }
    };

    if (this.isEditing()) {
      this.adminApi.updateProject(this.editSlug()!, data).subscribe(() => {
        saveTranslation();
        this.onSaveSuccess('Project bijgewerkt');
      });
    } else {
      this.adminApi.createProject(data).subscribe(() => {
        this.onSaveSuccess('Project aangemaakt');
      });
    }
  }

  deleteItem(slug: string) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteProject(slug).subscribe(() => this.onSaveSuccess('Project verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadProjects();
  }

  onFileSelected(event: Event, fieldKey: string) {
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
        this.successMessage.set('Upload mislukt');
        setTimeout(() => this.successMessage.set(null), 4000);
      }
    });
    input.value = '';
  }

  // === Images ===
  getProjectImages(): any[] { return (this.formData()['images'] as any[]) || []; }
  
  updateImageTitle(index: number, title: string) {
    const images = [...this.getProjectImages()];
    images[index].title = title;
    this.updateField('images', images);
  }

  removeProjectImage(index: number) {
    const images = [...this.getProjectImages()];
    images.splice(index, 1);
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  moveImageUp(index: number) {
    if (index === 0) return;
    const images = [...this.getProjectImages()];
    const temp = images[index];
    images[index] = images[index - 1];
    images[index - 1] = temp;
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  moveImageDown(index: number) {
    const images = [...this.getProjectImages()];
    if (index === images.length - 1) return;
    const temp = images[index];
    images[index] = images[index + 1];
    images[index + 1] = temp;
    this.recalculateImageSortOrder(images);
    this.updateField('images', images);
  }

  private recalculateImageSortOrder(images: any[]) {
    images.forEach((img, i) => img.sortOrder = i);
  }

  onImageFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set('newImage');
    this.adminApi.uploadFile(file).subscribe({
      next: (res) => {
        const images = [...this.getProjectImages()];
        images.push({ title: file.name.split('.')[0], imageUrl: res.data.url, sortOrder: images.length });
        this.updateField('images', images);
        this.uploadingField.set(null);
      },
      error: () => {
        this.uploadingField.set(null);
      }
    });
    input.value = '';
  }

  @HostListener('window:paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.showForm() || this.formLang() !== 'nl') return;
    const items = event.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          event.preventDefault();
          this.uploadPastedImage(file);
          break;
        }
      }
    }
  }

  private uploadPastedImage(file: File) {
    this.uploadingField.set('newImage');
    const fileName = `Screenshot_${new Date().getTime()}`;
    this.adminApi.uploadFile(file).subscribe(res => {
      const images = [...this.getProjectImages()];
      images.push({ title: fileName, imageUrl: res.data.url, sortOrder: images.length });
      this.updateField('images', images);
      this.uploadingField.set(null);
    });
  }

  // === Showcases ===
  getProjectShowcases(): any[] { return (this.formData()['showcases'] as any[]) || []; }

  addProjectShowcase(type: string) {
    const showcases = [...this.getProjectShowcases()];
    showcases.push({ type, title: 'Nieuwe ' + type, url: '', embedCode: '', sortOrder: showcases.length });
    this.updateField('showcases', showcases);
  }

  updateShowcaseField(index: number, field: string, value: any) {
    const showcases = [...this.getProjectShowcases()];
    showcases[index][field] = value;
    this.updateField('showcases', showcases);
  }

  removeProjectShowcase(index: number) {
    const showcases = [...this.getProjectShowcases()];
    showcases.splice(index, 1);
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  moveShowcaseUp(index: number) {
    if (index === 0) return;
    const showcases = [...this.getProjectShowcases()];
    const temp = showcases[index];
    showcases[index] = showcases[index - 1];
    showcases[index - 1] = temp;
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  moveShowcaseDown(index: number) {
    const showcases = [...this.getProjectShowcases()];
    if (index === showcases.length - 1) return;
    const temp = showcases[index];
    showcases[index] = showcases[index + 1];
    showcases[index + 1] = temp;
    this.recalculateShowcaseSortOrder(showcases);
    this.updateField('showcases', showcases);
  }

  private recalculateShowcaseSortOrder(showcases: any[]) {
    showcases.forEach((sc, i) => sc.sortOrder = i);
  }

  onShowcaseFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set(`showcase_${index}`);
    this.adminApi.uploadFile(file).subscribe(res => {
      this.updateShowcaseField(index, 'url', res.data.url);
      this.uploadingField.set(null);
    });
    input.value = '';
  }

  // === Documents ===
  getProjectDocuments(): any[] { return (this.formData()['documents'] as any[]) || []; }

  addProjectDocument() {
    const docs = [...this.getProjectDocuments()];
    docs.push({ title: 'Nieuw Document', url: '', sortOrder: docs.length });
    this.updateField('documents', docs);
  }

  updateDocumentField(index: number, field: string, value: any) {
    const docs = [...this.getProjectDocuments()];
    docs[index][field] = value;
    this.updateField('documents', docs);
  }

  removeProjectDocument(index: number) {
    const docs = [...this.getProjectDocuments()];
    docs.splice(index, 1);
    this.recalculateDocumentSortOrder(docs);
    this.updateField('documents', docs);
  }

  moveDocumentUp(index: number) {
    if (index === 0) return;
    const docs = [...this.getProjectDocuments()];
    const temp = docs[index];
    docs[index] = docs[index - 1];
    docs[index - 1] = temp;
    this.recalculateDocumentSortOrder(docs);
    this.updateField('documents', docs);
  }

  moveDocumentDown(index: number) {
    const docs = [...this.getProjectDocuments()];
    if (index === docs.length - 1) return;
    const temp = docs[index];
    docs[index] = docs[index + 1];
    docs[index + 1] = temp;
    this.recalculateDocumentSortOrder(docs);
    this.updateField('documents', docs);
  }

  private recalculateDocumentSortOrder(docs: any[]) {
    docs.forEach((doc, i) => doc.sortOrder = i);
  }

  onDocumentFileSelected(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.uploadingField.set(`document_${index}`);
    this.adminApi.uploadFile(file).subscribe(res => {
      this.updateDocumentField(index, 'url', res.data.url);
      if (this.getProjectDocuments()[index].title === 'Nieuw Document') {
          this.updateDocumentField(index, 'title', file.name.split('.')[0]);
      }
      this.uploadingField.set(null);
    });
    input.value = '';
  }

  // === Skills ===
  getProjectSkills(): number[] { return (this.formData()['skillIds'] as number[]) || []; }

  toggleSkill(skillId: number) {
    const currentSkills = [...this.getProjectSkills()];
    const index = currentSkills.indexOf(skillId);
    if (index === -1) {
      currentSkills.push(skillId);
    } else {
      currentSkills.splice(index, 1);
    }
    this.updateField('skillIds', currentSkills);
  }
}
