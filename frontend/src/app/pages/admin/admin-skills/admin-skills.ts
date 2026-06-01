import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PortfolioApiService, SkillDto } from '../../../core/services/portfolio-api.service';

type TranslationLang = 'nl' | 'en';

@Component({
  selector: 'app-admin-skills',
  imports: [FormsModule],
  templateUrl: './admin-skills.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSkillsComponent implements OnInit {
  private apiService = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);

  skills = signal<SkillDto[]>([]);
  successMessage = signal<string | null>(null);

  showForm = signal(false);
  isEditing = signal(false);
  formLang = signal<TranslationLang>('nl');
  formData = signal<Record<string, unknown>>({});
  editId = signal<number | null>(null);

  translationData = signal<Record<string, unknown>>({});
  translationLoading = signal(false);
  translationLoaded = signal(false);

  ngOnInit() {
    this.loadSkills();
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
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(skill: SkillDto) {
    this.isEditing.set(true);
    this.formLang.set('nl');
    this.translationData.set({});
    this.translationLoaded.set(false);
    this.formData.set({ ...(skill as any) });
    this.editId.set(skill.id);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.formData.set({});
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
    this.adminApi.getSkillTranslation(this.editId()!, 'en').subscribe({
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
        this.adminApi.upsertSkillTranslation(this.editId()!, 'en', {
          description: transData.description || ''
        }).subscribe();
      }
    };

    if (this.isEditing()) {
      this.adminApi.updateSkill(this.editId()!, data).subscribe(() => {
        saveTranslation();
        this.onSaveSuccess('Skill bijgewerkt');
      });
    } else {
      this.adminApi.createSkill(data).subscribe(() => {
        this.onSaveSuccess('Skill aangemaakt');
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteSkill(id).subscribe(() => this.onSaveSuccess('Skill verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadSkills();
  }
}
