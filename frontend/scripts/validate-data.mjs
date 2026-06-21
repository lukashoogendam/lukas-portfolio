// Valideert de statische data in public/data/ vóór de build.
// Vangt: ongeldige JSON, ontbrekende/foute vertaalvelden, kapotte enums,
// en techStack-namen die niet in skills.json bestaan. Exit 1 bij fouten.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data');
const PROJECTS = join(DATA, 'projects');

const PROJECT_CATEGORIES = ['SCHOOL_PROJECT', 'PERSONAL_PROJECT'];
const PROJECT_STATUSES = ['COMPLETED', 'IN_PROGRESS'];
const SKILL_CATEGORIES = ['BACKEND', 'FRONTEND', 'DATABASE', 'DEVOPS', 'TOOLS', 'MOBILE', 'CLOUD'];

const errors = [];
const err = (file, msg) => errors.push(`${file}: ${msg}`);
const read = (p) => JSON.parse(readFileSync(p, 'utf8'));

const isStr = (v) => typeof v === 'string';
const isLoc = (v) => v && typeof v === 'object' && isStr(v.nl) && isStr(v.en);
const isLocList = (v) =>
  v && typeof v === 'object' && Array.isArray(v.nl) && Array.isArray(v.en) &&
  v.nl.every(isStr) && v.en.every(isStr);

function checkLoc(file, obj, field, { nullable = false } = {}) {
  const v = obj[field];
  if (nullable && v === null) return;
  if (!isLoc(v)) err(file, `veld "${field}" moet {nl,en} strings zijn`);
}

// ---- profile ----
try {
  const p = read(join(DATA, 'profile.json'));
  if (!isStr(p.name)) err('profile.json', 'name moet string zijn');
  if (!isStr(p.location)) err('profile.json', 'location moet string zijn');
  if (!isStr(p.email)) err('profile.json', 'email moet string zijn');
  ['role', 'focus', 'summary'].forEach((f) => checkLoc('profile.json', p, f));
} catch (e) { err('profile.json', e.message); }

// ---- skills ----
let skillNames = new Set();
try {
  const skills = read(join(DATA, 'skills.json'));
  if (!Array.isArray(skills)) throw new Error('moet een array zijn');
  skills.forEach((s, i) => {
    if (!isStr(s.name)) err('skills.json', `[${i}] name moet string zijn`);
    else skillNames.add(s.name);
    if (!SKILL_CATEGORIES.includes(s.category)) err('skills.json', `[${i}] ongeldige category "${s.category}"`);
    if (s.description !== null && !isLoc(s.description)) err('skills.json', `[${i}] description moet {nl,en} of null zijn`);
  });
} catch (e) { err('skills.json', e.message); }

// ---- featured-skills ----
try {
  const fs = read(join(DATA, 'featured-skills.json'));
  if (!Array.isArray(fs)) throw new Error('moet een array zijn');
  fs.forEach((s, i) => {
    checkLoc(`featured-skills.json[${i}]`, s, 'name');
    checkLoc(`featured-skills.json[${i}]`, s, 'description');
    if (!SKILL_CATEGORIES.includes(s.category)) err('featured-skills.json', `[${i}] ongeldige category "${s.category}"`);
    if (!isStr(s.icon)) err('featured-skills.json', `[${i}] icon moet string zijn`);
  });
} catch (e) { err('featured-skills.json', e.message); }

// ---- socials ----
try {
  const socials = read(join(DATA, 'socials.json'));
  if (!Array.isArray(socials)) throw new Error('moet een array zijn');
  socials.forEach((s, i) => {
    ['platform', 'url', 'icon'].forEach((f) => { if (!isStr(s[f])) err('socials.json', `[${i}] ${f} moet string zijn`); });
  });
} catch (e) { err('socials.json', e.message); }

// ---- timeline ----
try {
  const tl = read(join(DATA, 'timeline.json'));
  if (!Array.isArray(tl)) throw new Error('moet een array zijn');
  tl.forEach((e2, i) => {
    ['title', 'subtitle', 'description'].forEach((f) => checkLoc(`timeline.json[${i}]`, e2, f));
    if (!isStr(e2.type)) err('timeline.json', `[${i}] type moet string zijn`);
    if (typeof e2.current !== 'boolean') err('timeline.json', `[${i}] current moet boolean zijn`);
  });
} catch (e) { err('timeline.json', e.message); }

// ---- project details ----
try {
  const files = readdirSync(PROJECTS).filter((f) => f.endsWith('.json'));
  files.forEach((f) => {
    const file = `projects/${f}`;
    let o;
    try { o = read(join(PROJECTS, f)); } catch (e) { err(file, e.message); return; }
    if (!isStr(o.slug)) err(file, 'slug moet string zijn');
    ['title', 'shortDescription', 'description', 'role'].forEach((fld) => checkLoc(file, o, fld));
    checkLoc(file, o, 'courseName', { nullable: true });
    if (!isLocList(o.highlights)) err(file, 'highlights moet {nl:[],en:[]} zijn');
    if (!PROJECT_CATEGORIES.includes(o.category)) err(file, `ongeldige category "${o.category}"`);
    if (!PROJECT_STATUSES.includes(o.status)) err(file, `ongeldige status "${o.status}"`);
    if (typeof o.highlighted !== 'boolean') err(file, 'highlighted moet boolean zijn');
    if (!isStr(o.repositoryUrl)) err(file, 'repositoryUrl moet string zijn');
    if (!Array.isArray(o.techStack) || !o.techStack.every(isStr)) err(file, 'techStack moet string[] zijn');
    else o.techStack.forEach((t) => { if (!skillNames.has(t)) err(file, `techStack "${t}" bestaat niet in skills.json`); });
    ['images', 'showcases', 'documents'].forEach((a) => { if (!Array.isArray(o[a])) err(file, `${a} moet een array zijn`); });
  });
} catch (e) { err('projects/', e.message); }

if (errors.length) {
  console.error(`\n❌ validate-data: ${errors.length} fout(en):`);
  errors.forEach((e) => console.error('  - ' + e));
  process.exit(1);
}
console.log('✓ validate-data: alle datastructuren geldig');
