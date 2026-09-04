import { Language } from './language.service';

export type ProjectCategory = 'SCHOOL_PROJECT' | 'PERSONAL_PROJECT';
export type ProjectStatus = 'COMPLETED' | 'IN_PROGRESS';
export type SkillCategory = 'BACKEND' | 'FRONTEND' | 'DATABASE' | 'DATA' | 'DEVOPS' | 'TOOLS' | 'MOBILE' | 'CLOUD';

// ─────────────────────────────────────────────────────────────────────────────
// Public DTOs — consumed by components. Already localized to plain strings,
// so the bilingual structure never leaks past this module.
// ─────────────────────────────────────────────────────────────────────────────

export interface Profile {
  name: string;
  role: string;
  focus: string;
  location: string;
  email: string;
  summary: string;
}

export interface SkillDto {
  name: string;
  category: SkillCategory;
  description: string;
}

export interface FeaturedSkillDto {
  name: string;
  description: string;
  category: SkillCategory;
  icon: string;
}

export interface TimelineEventDto {
  title: string;
  subtitle: string;
  type: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: string;
}

export interface ProjectListDto {
  slug: string;
  title: string;
  shortDescription: string;
  category: ProjectCategory;
  status: ProjectStatus;
  courseName: string | null;
  highlighted: boolean;
}

export interface ProjectImageDto {
  title: string;
  imageUrl: string;
}

export interface ShowcaseDto {
  type: string;
  title: string;
  url: string;
  embedCode: string;
}

export interface DocumentDto {
  title: string;
  url: string;
}

export interface ProjectDetailDto {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  highlights: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  repositoryUrl: string;
  techStack: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
  courseName: string | null;
  highlighted: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Raw JSON shapes — the on-disk structure with bilingual { nl, en } fields.
// ─────────────────────────────────────────────────────────────────────────────

export interface Localized { nl: string; en: string; }
export interface LocalizedList { nl: string[]; en: string[]; }

export interface RawProfile {
  name: string;
  role: Localized;
  focus: Localized;
  location: string;
  email: string;
  summary: Localized;
}

export interface RawSkill {
  name: string;
  category: SkillCategory;
  description: Localized | null;
}

export interface RawFeaturedSkill {
  name: Localized;
  description: Localized;
  category: SkillCategory;
  icon: string;
}

export interface RawTimelineEvent {
  title: Localized;
  subtitle: Localized;
  type: string;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  description: Localized;
}

export interface RawProjectList {
  slug: string;
  title: Localized;
  shortDescription: Localized;
  category: ProjectCategory;
  status: ProjectStatus;
  courseName: Localized | null;
  highlighted: boolean;
}

export interface RawProjectDetail {
  slug: string;
  title: Localized;
  shortDescription: Localized;
  description: Localized;
  role: Localized;
  highlights: LocalizedList;
  category: ProjectCategory;
  status: ProjectStatus;
  startDate: string | null;
  endDate: string | null;
  repositoryUrl: string;
  courseName: Localized | null;
  highlighted: boolean;
  techStack: string[];
  images: ProjectImageDto[];
  showcases: ShowcaseDto[];
  documents: DocumentDto[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Pickers — resolve a bilingual field down to a single string for the given
// language, falling back to Dutch when the target language is missing.
// ─────────────────────────────────────────────────────────────────────────────

export function pick(value: Localized, lang: Language): string {
  return value?.[lang] || value?.nl || '';
}

export function pickList(value: LocalizedList, lang: Language): string[] {
  const v = value?.[lang];
  return (v && v.length) ? v : (value?.nl ?? []);
}

export function pickOrNull(value: Localized | null, lang: Language): string | null {
  return value ? pick(value, lang) : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mappers — Raw* → public DTO
// ─────────────────────────────────────────────────────────────────────────────

export function mapProfile(raw: RawProfile, lang: Language): Profile {
  return {
    name: raw.name,
    role: pick(raw.role, lang),
    focus: pick(raw.focus, lang),
    location: raw.location,
    email: raw.email,
    summary: pick(raw.summary, lang)
  };
}

export function mapSkill(raw: RawSkill, lang: Language): SkillDto {
  return {
    name: raw.name,
    category: raw.category,
    description: raw.description ? pick(raw.description, lang) : ''
  };
}

export function mapFeaturedSkill(raw: RawFeaturedSkill, lang: Language): FeaturedSkillDto {
  return {
    name: pick(raw.name, lang),
    description: pick(raw.description, lang),
    category: raw.category,
    icon: raw.icon
  };
}

export function mapTimeline(raw: RawTimelineEvent, lang: Language): TimelineEventDto {
  return {
    title: pick(raw.title, lang),
    subtitle: pick(raw.subtitle, lang),
    type: raw.type,
    startDate: raw.startDate,
    endDate: raw.endDate,
    current: raw.current,
    description: pick(raw.description, lang)
  };
}

export function mapProjectList(raw: RawProjectList, lang: Language): ProjectListDto {
  return {
    slug: raw.slug,
    title: pick(raw.title, lang),
    shortDescription: pick(raw.shortDescription, lang),
    category: raw.category,
    status: raw.status,
    courseName: pickOrNull(raw.courseName, lang),
    highlighted: raw.highlighted
  };
}

export function mapProjectDetail(raw: RawProjectDetail, lang: Language): ProjectDetailDto {
  return {
    slug: raw.slug,
    title: pick(raw.title, lang),
    shortDescription: pick(raw.shortDescription, lang),
    description: pick(raw.description, lang),
    role: pick(raw.role, lang),
    highlights: pickList(raw.highlights, lang),
    category: raw.category,
    status: raw.status,
    startDate: raw.startDate,
    endDate: raw.endDate,
    repositoryUrl: raw.repositoryUrl,
    techStack: raw.techStack,
    images: raw.images,
    showcases: raw.showcases,
    documents: raw.documents,
    courseName: pickOrNull(raw.courseName, lang),
    highlighted: raw.highlighted
  };
}
