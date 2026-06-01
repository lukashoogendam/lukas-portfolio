import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { PortfolioApiService, SocialDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-admin-socials',
  imports: [FormsModule],
  templateUrl: './admin-socials.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSocialsComponent implements OnInit {
  private apiService = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);

  socials = signal<SocialDto[]>([]);
  successMessage = signal<string | null>(null);

  showForm = signal(false);
  isEditing = signal(false);
  formData = signal<Record<string, unknown>>({});
  editId = signal<number | null>(null);

  ngOnInit() {
    this.loadSocials();
  }

  loadSocials() {
    this.apiService.getSocials().subscribe(res => this.socials.set(res.data));
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.formData.set({});
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(social: SocialDto) {
    this.isEditing.set(true);
    this.formData.set({ ...(social as any) });
    this.editId.set(social.id);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.formData.set({});
  }

  updateField(key: string, value: unknown) {
    this.formData.update(data => ({ ...data, [key]: value }));
  }

  saveItem() {
    const data = this.formData();
    if (this.isEditing()) {
      this.adminApi.updateSocial(this.editId()!, data).subscribe(() => {
        this.onSaveSuccess('Social bijgewerkt');
      });
    } else {
      this.adminApi.createSocial(data).subscribe(() => {
        this.onSaveSuccess('Social aangemaakt');
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteSocial(id).subscribe(() => this.onSaveSuccess('Social verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadSocials();
  }
}
