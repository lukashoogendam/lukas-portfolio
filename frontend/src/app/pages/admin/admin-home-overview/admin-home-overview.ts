import { Component, inject, signal, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { PortfolioApiService, HomeSectionDto } from '../../../core/services/portfolio-api.service';
import { AdminApiService } from '../../../core/services/admin-api.service';

const SECTION_LABELS: Record<string, string> = {
  HERO: '🏠 Hero (Introductie)',
  ABOUT: '👤 Over mij',
  FEATURED_SKILLS: '⭐ Hoofdskills',
  SKILLS: '🛠️ Skills',
  PROJECTS: '💼 Projecten',
  TIMELINE: '📅 Tijdlijn',
  CONTACT: '✉️ Contact',
  CUSTOM_TEXT: '📝 Tekst Sectie',
};

const EDITABLE_TABS: Record<string, string> = {
  SKILLS: 'skills',
  PROJECTS: 'projects',
  TIMELINE: 'timeline',
};

@Component({
  selector: 'app-admin-home-overview',
  imports: [DragDropModule, FormsModule],
  templateUrl: './admin-home-overview.html',
  styleUrls: ['./admin-home-overview.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminHomeOverviewComponent implements OnInit {
  private api = inject(PortfolioApiService);
  private adminApi = inject(AdminApiService);
  private cdr = inject(ChangeDetectorRef);

  sections = signal<HomeSectionDto[]>([]);
  editingSection = signal<HomeSectionDto | null>(null);
  editTitle = signal('');
  editTitleEn = signal('');
  editSubtitle = signal('');
  editSubtitleEn = signal('');
  editContent = signal('');
  editContentEn = signal('');
  saving = signal(false);
  saveMessage = signal('');
  showAddForm = signal(false);
  newIdentifier = signal('');
  newTitle = signal('');

  ngOnInit() {
    this.loadSections();
  }

  loadSections() {
    this.api.getHome().subscribe(res => {
      const sorted = [...res.data.homeSections].sort((a, b) => a.sortOrder - b.sortOrder);
      this.sections.set(sorted);
      this.cdr.markForCheck();
    });
  }

  getSectionLabel(type: string): string {
    return SECTION_LABELS[type] ?? type;
  }

  getEditableTab(type: string): string | null {
    return EDITABLE_TABS[type] ?? null;
  }

  isNativeSection(type: string): boolean {
    return type !== 'CUSTOM_TEXT';
  }

  drop(event: CdkDragDrop<HomeSectionDto[]>) {
    const list = [...this.sections()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    
    list.forEach((section, index) => {
      section.sortOrder = index;
    });
    
    this.sections.set(list);
    this.saveOrder(list);
  }

  saveOrder(list: HomeSectionDto[]) {
    const ids = list.map(s => s.id);
    this.adminApi.reorderHomeSections(ids).subscribe(() => {
      this.showSave('Volgorde opgeslagen!');
    });
  }

  toggleVisible(section: HomeSectionDto) {
    const updated: HomeSectionDto = { ...section, visible: !section.visible };
    this.patchSection(updated, () => {
      this.showSave(updated.visible ? 'Sectie zichtbaar!' : 'Sectie verborgen!');
    });
  }

  addSection() {
    const identifier = this.newIdentifier().trim();
    const title = this.newTitle().trim();
    if (!identifier) return;

    const nextOrder = this.sections().length;
    this.adminApi.createHomeSection({
      identifier,
      title: title || null,
      titleEn: null,
      subtitle: null,
      subtitleEn: null,
      content: '',
      contentEn: '',
      sortOrder: nextOrder,
      type: 'CUSTOM_TEXT',
      visible: true,
    }).subscribe({
      next: () => {
        this.showAddForm.set(false);
        this.newIdentifier.set('');
        this.newTitle.set('');
        this.loadSections();
        this.showSave('Sectie toegevoegd!');
      },
      error: () => {
        this.saveMessage.set('❌ Aanmaken mislukt!');
        setTimeout(() => this.saveMessage.set(''), 3000);
        this.cdr.markForCheck();
      }
    });
  }

  deleteSection(section: HomeSectionDto) {
    if (!confirm(`Weet je zeker dat je "${section.title || section.identifier}" wilt verwijderen?`)) return;
    this.adminApi.deleteHomeSection(section.id).subscribe({
      next: () => {
        this.loadSections();
        this.showSave('Sectie verwijderd!');
      },
      error: () => {
        this.saveMessage.set('❌ Verwijderen mislukt!');
        setTimeout(() => this.saveMessage.set(''), 3000);
        this.cdr.markForCheck();
      }
    });
  }

  openEdit(section: HomeSectionDto) {
    this.editingSection.set(section);
    this.editTitle.set(section.title ?? '');
    this.editTitleEn.set(section.titleEn ?? '');
    this.editSubtitle.set(section.subtitle ?? '');
    this.editSubtitleEn.set(section.subtitleEn ?? '');
    this.editContent.set(section.content ?? '');
    this.editContentEn.set(section.contentEn ?? '');
  }

  closeEdit() {
    this.editingSection.set(null);
  }

  saveEdit() {
    const section = this.editingSection();
    if (!section) return;
    this.saving.set(true);

    const updated: HomeSectionDto = {
      ...section,
      title: this.editTitle(),
      titleEn: this.editTitleEn(),
      subtitle: this.editSubtitle(),
      subtitleEn: this.editSubtitleEn(),
      content: this.editContent(),
      contentEn: this.editContentEn(),
    };

    this.patchSection(updated, () => {
      this.saving.set(false);
      this.editingSection.set(null);
      this.showSave('Sectie opgeslagen!');
    });
  }

  private patchSection(section: HomeSectionDto, callback?: () => void) {
    this.adminApi.updateHomeSection(section.id, {
      identifier: section.identifier,
      title: section.title,
      titleEn: section.titleEn,
      subtitle: section.subtitle,
      subtitleEn: section.subtitleEn,
      content: section.content ?? '',
      contentEn: section.contentEn ?? '',
      sortOrder: section.sortOrder,
      type: section.type,
      visible: section.visible,
    }).subscribe({
      next: () => {
        this.loadSections();
        if (callback) callback();
        this.cdr.markForCheck();
      },
      error: () => {
        this.saving.set(false);
        this.saveMessage.set('❌ Opslaan mislukt!');
        setTimeout(() => this.saveMessage.set(''), 3000);
        this.cdr.markForCheck();
      }
    });
  }

  private showSave(msg: string) {
    this.saveMessage.set(msg);
    this.cdr.markForCheck();
    setTimeout(() => {
      this.saveMessage.set('');
      this.cdr.markForCheck();
    }, 2500);
  }
}
