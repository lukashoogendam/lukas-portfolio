export const nl = {
  // Navbar
  'nav.home': 'Home',
  'nav.about': 'Over mij',
  'nav.skills': 'Skills',
  'nav.projects': 'Projecten',
  'nav.experience': 'Ervaring',
  'nav.contact': 'Contact',

  // Hero
  'hero.badge': 'Beschikbaar voor nieuwe projecten',
  'hero.cta_work': 'Bekijk mijn werk',
  'hero.cta_contact': 'Neem contact op',

  // About
  'about.subtitle': 'Ontdek mijn achtergrond en drijfveren',
  'about.fallback_title': 'Wie ben ik?',

  // Skills
  'skills.fallback_title': 'Skills & Technologieën',
  'skills.core_title': 'Hoofdskills',
  'skills.core_lead': 'mijn expertise',
  'skills.all_title': 'Vaardigheden',
  'skills.all_lead': 'alles waar ik mee gewerkt heb',
  'skills.units_tech': 'technologieën',
  'skills.units_cat': 'categorieën',
  'skills.divider': 'en verder',

  // Projects
  'projects.fallback_title': 'Uitgelichte Projecten',
  'projects.view_all': 'Alle projecten bekijken',

  // Timeline
  'timeline.label': 'Carrière',
  'timeline.fallback_title': 'Ervaring & Educatie',
  'timeline.lead': 'opleiding & projecten in de tijd',
  'timeline.current': 'Heden',

  // Contact
  'contact.fallback_title': 'Neem Contact Op',
  'contact.intro': 'Geen ingewikkelde flow. Stuur gewoon een request, ik reageer doorgaans binnen een dag.',
  'contact.success_title': 'Bericht verstuurd!',
  'contact.success_message': 'Bedankt voor je bericht. Ik neem zo snel mogelijk contact met je op.',
  'contact.new_message': 'Nieuw bericht',
  'contact.label_name': 'Naam',
  'contact.label_email': 'E-mail',
  'contact.label_message': 'Bericht',
  'contact.placeholder_name': 'Jouw naam',
  'contact.placeholder_email': 'jouw@email.nl',
  'contact.placeholder_message': 'Schrijf hier je bericht...',
  'contact.submit': 'Verstuur bericht',
  'contact.submitting': 'Versturen...',
  'contact.error': 'Er is iets misgegaan. Probeer het opnieuw.',

  // Projects Overview
  'overview.loading': 'Projecten laden...',
  'overview.error_title': 'Projecten niet gevonden',
  'overview.error_message': 'De projecten konden niet geladen worden.',
  'overview.title': 'Mijn Projecten',
  'overview.subtitle_suffix': 'gerealiseerde projecten en concepten',
  'overview.view_details': 'Bekijk details',
  'overview.empty': 'Nog geen projecten toegevoegd.',
  'overview.back': '← Terug',
  'overview.cat_all': 'Alles',

  // Project Detail
  'detail.loading': 'Project laden...',
  'detail.error_title': 'Project niet gevonden',
  'detail.error_message': 'Het opgevraagde project bestaat niet of kon niet geladen worden.',
  'detail.back': '← Terug',
  'detail.current': 'Heden',
  'detail.about': 'Over dit project',
  'detail.my_role': 'Mijn rol',
  'detail.built': 'Wat er is gebouwd',
  'detail.view_demo': 'Demo bekijken',
  'detail.click_to_open': 'Klik om te openen',
  'detail.docs': 'Documentatie & Notities',
  'detail.lightbox_alt': 'Screenshot vergroot',
  'detail.view_doc': 'Bekijk',

  // Enums
  'enum.category.SCHOOL_PROJECT': 'Schoolproject',
  'enum.category.PERSONAL_PROJECT': 'Eigen project',
  'enum.status.COMPLETED': 'Afgerond',
  'enum.status.IN_PROGRESS': 'In ontwikkeling',

  // Skill category enums
  'enum.skill_category.BACKEND': 'Backend',
  'enum.skill_category.FRONTEND': 'Frontend',
  'enum.skill_category.DATABASE': 'Database',
  'enum.skill_category.DATA': 'Data',
  'enum.skill_category.DEVOPS': 'DevOps',
  'enum.skill_category.TOOLS': 'Tools',
  'enum.skill_category.MOBILE': 'Mobile',
  'enum.skill_category.CLOUD': 'Cloud',
} as const;

export type TranslationKey = keyof typeof nl;
