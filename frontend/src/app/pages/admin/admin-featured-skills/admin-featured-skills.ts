import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { FeaturedSkillDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-admin-featured-skills',
  imports: [FormsModule],
  templateUrl: './admin-featured-skills.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminFeaturedSkillsComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  items = signal<FeaturedSkillDto[]>([]);
  successMessage = signal<string | null>(null);
  showForm = signal(false);
  isEditing = signal(false);
  formData = signal<Record<string, unknown>>({});
  editId = signal<number | null>(null);

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.adminApi.getFeaturedSkills().subscribe(res => this.items.set(res.data));
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.formData.set({});
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(item: FeaturedSkillDto) {
    this.isEditing.set(true);
    this.formData.set({ ...(item as any) });
    this.editId.set(item.id);
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
      this.adminApi.updateFeaturedSkill(this.editId()!, data).subscribe(() => {
        this.onSaveSuccess('Hoofdskill bijgewerkt');
      });
    } else {
      this.adminApi.createFeaturedSkill(data).subscribe(() => {
        this.onSaveSuccess('Hoofdskill aangemaakt');
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteFeaturedSkill(id).subscribe(() => this.onSaveSuccess('Hoofdskill verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadItems();
  }
}
