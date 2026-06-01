import { Component, OnInit, signal, inject, ChangeDetectionStrategy } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AdminApiService } from '../../../core/services/admin-api.service';
import { TimelineEventDto } from '../../../core/services/portfolio-api.service';

@Component({
  selector: 'app-admin-timeline',
  imports: [FormsModule, DatePipe],
  templateUrl: './admin-timeline.html',
  styleUrl: '../admin.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminTimelineComponent implements OnInit {
  private adminApi = inject(AdminApiService);

  events = signal<TimelineEventDto[]>([]);
  successMessage = signal<string | null>(null);

  showForm = signal(false);
  isEditing = signal(false);
  formData = signal<Record<string, unknown>>({});
  editId = signal<number | null>(null);

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.adminApi.getTimelineEvents().subscribe(res => this.events.set(res.data));
  }

  openCreateForm() {
    this.isEditing.set(false);
    this.formData.set({ type: 'WORK', current: false, sortOrder: 0 });
    this.editId.set(null);
    this.showForm.set(true);
  }

  openEditForm(event: TimelineEventDto) {
    this.isEditing.set(true);
    this.formData.set({ ...event });
    this.editId.set(event.id);
    this.showForm.set(true);
  }

  closeForm() {
    this.showForm.set(false);
    this.formData.set({});
    this.editId.set(null);
  }

  isCurrent(): boolean {
    return !!this.formData()['current'];
  }

  updateField(key: string, value: unknown) {
    this.formData.update(data => ({ ...data, [key]: value }));
  }

  saveItem() {
    const data = this.formData();
    if (this.isEditing()) {
      this.adminApi.updateTimelineEvent(this.editId()!, data).subscribe(() => {
        this.onSaveSuccess('Tijdlijn item bijgewerkt');
      });
    } else {
      this.adminApi.createTimelineEvent(data).subscribe(() => {
        this.onSaveSuccess('Tijdlijn item aangemaakt');
      });
    }
  }

  deleteItem(id: number) {
    if (confirm('Weet je zeker dat je dit wilt verwijderen?')) {
      this.adminApi.deleteTimelineEvent(id).subscribe(() => this.onSaveSuccess('Item verwijderd'));
    }
  }

  private onSaveSuccess(message: string) {
    this.closeForm();
    this.successMessage.set(message);
    setTimeout(() => this.successMessage.set(null), 3000);
    this.loadEvents();
  }
}
