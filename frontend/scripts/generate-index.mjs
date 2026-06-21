// Genereert public/data/projects.json (de lijst-index) uit de losse
// public/data/projects/<slug>.json detailbestanden. De detailbestanden zijn
// de ENIGE bron van waarheid; deze index is afgeleid.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'data');
const PROJECTS = join(DATA, 'projects');

const files = readdirSync(PROJECTS).filter((f) => f.endsWith('.json')).sort();

const index = files.map((f) => {
  const o = JSON.parse(readFileSync(join(PROJECTS, f), 'utf8'));
  return {
    slug: o.slug,
    title: o.title,
    shortDescription: o.shortDescription,
    category: o.category,
    status: o.status,
    courseName: o.courseName ?? null,
    highlighted: !!o.highlighted,
  };
});

writeFileSync(join(DATA, 'projects.json'), JSON.stringify(index, null, 2) + '\n', 'utf8');
console.log(`generate-index: projects.json bijgewerkt (${index.length} projecten)`);
