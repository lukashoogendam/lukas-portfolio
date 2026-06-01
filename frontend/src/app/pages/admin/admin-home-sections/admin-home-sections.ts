import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { HomeSectionDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-admin-home-sections',
  imports: [FormsModule],
  templateUrl: './admin-home-sections.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomeSectionsComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  sections = signal<HomeSectionDto[]>([]);
  successMessage = signal<string | null>(null);

  showForm = signal(false);
  isEditing = signal(false);
  formData = signal<Record<string, unknown>>({});
  editId = signal<number | null>(null);

  ngOnInit() {
    this.loadSections();
  }

  loadSections() {
    this.adminApi.getHomeSections().subscribe(res => this.sections.set(res.data));
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.formData.set({ sortOrder: 0 });
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(section: HomeSectionDto) {
    this.isEditing.set(true);
    this.formData.set({ ...section });
    this.editId.set(section.id);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.formData.set({});
    this.editId.set(null);
  }

  updateField(key: string, value: unknown) {
    this.formData.update(data => ({ ...data, [key]: value }));
  }

  saveItem() {
    const data = this.formData();
    if (this.isEditing()) {
      this.adminApi.updateHomeSection(this.editId()!, data).subscribe(() => {
        this.onSaveSuccess('Sectie bijgewerkt');
      });
    } else {
      this.adminApi.createHomeSection(data).subscribe(() => {
        this.onSaveSuccess('Sectie aangemaakt');
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteHomeSection(id).subscribe(() => this.onSaveSuccess('Sectie verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadSections();
  }
}
