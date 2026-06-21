const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { execFileSync } = require('child_process');
const { createSlug, isSafePath } = require('./cli-lib');

// Pad configuratie
const FRONTEND_DIR = path.join(__dirname, '..', 'frontend');
const DATA_DIR = path.join(FRONTEND_DIR, 'public', 'data');
const PROJECTS_DETAIL_DIR = path.join(DATA_DIR, 'projects');
const UPLOADS_DIR = path.join(FRONTEND_DIR, 'public', 'assets', 'uploads');
const GENERATE_INDEX_SCRIPT = path.join(FRONTEND_DIR, 'scripts', 'generate-index.mjs');

// nl verplicht, en valt terug op nl
const loc = (nl, en) => ({ nl, en: (en && en.trim()) ? en : nl });

// projects.json (index) opnieuw opbouwen via het canonieke generate-index script,
// zodat er maar één implementatie van de index-projectie bestaat.
function regenerateIndex() {
    execFileSync('node', [GENERATE_INDEX_SCRIPT], { stdio: 'inherit' });
}

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function run() {
    console.log('\n=== 🚀 Nieuw Project Toevoegen ===\n');

    try {
        const title = await question('1. Project Titel (NL): ');
        if (!title.trim()) throw new Error('Titel is verplicht.');

        const titleEn = await question('2. Project Titel (EN) [leeg = zelfde als NL]: ') || title;

        let slug = await question(`3. URL Slug [leeg = '${createSlug(title)}']: `);
        slug = slug.trim() ? createSlug(slug) : createSlug(title);

        const shortDesc = await question('4. Korte beschrijving (NL): ');
        const shortDescEn = await question('5. Korte beschrijving (EN) [leeg = zelfde als NL]: ');

        const category = await question('6. Categorie (SCHOOL_PROJECT of PERSONAL_PROJECT) [PERSONAL_PROJECT]: ') || 'PERSONAL_PROJECT';

        const imagePathsInput = await question('7. Afbeeldingen toevoegen? (volledige lokale paden, gescheiden door komma, of leeg): ');

        console.log('\n--- Bezig met verwerken... ---\n');

        if (!fs.existsSync(PROJECTS_DETAIL_DIR)) fs.mkdirSync(PROJECTS_DETAIL_DIR, { recursive: true });
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

        // Afbeeldingen veilig kopiëren
        const uploadedImages = [];
        if (imagePathsInput.trim()) {
            const paths = imagePathsInput.split(',').map(p => p.trim());
            for (let i = 0; i < paths.length; i++) {
                const imgPath = paths[i];
                if (fs.existsSync(imgPath) && fs.statSync(imgPath).isFile()) {
                    const ext = path.extname(imgPath);
                    const safeName = `${slug}-${Date.now()}-${i}${ext}`;
                    const targetPath = path.join(UPLOADS_DIR, safeName);
                    if (!isSafePath(UPLOADS_DIR, targetPath)) {
                        throw new Error(`Onveilig bestandspad gedetecteerd: ${targetPath}`);
                    }
                    fs.copyFileSync(imgPath, targetPath);
                    uploadedImages.push({ title: `Screenshot ${i + 1}`, imageUrl: `/assets/uploads/${safeName}` });
                    console.log(`✅ Afbeelding gekopieerd: ${safeName}`);
                } else {
                    console.log(`⚠️ Afbeelding niet gevonden of geen bestand: ${imgPath}`);
                }
            }
        }

        // Project detail JSON aanmaken (nieuwe structuur: localized {nl,en})
        const newProjectDetail = {
            slug,
            title: loc(title, titleEn),
            shortDescription: loc(shortDesc, shortDescEn),
            description: loc('Voeg hier je volledige markdown beschrijving toe...', 'Add your full markdown description here...'),
            role: loc('Mijn rol...', 'My role...'),
            highlights: { nl: ['Highlight 1', 'Highlight 2'], en: ['Highlight 1', 'Highlight 2'] },
            category,
            status: 'COMPLETED',
            startDate: null,
            endDate: null,
            repositoryUrl: '',
            courseName: null,
            highlighted: true,
            techStack: [],
            images: uploadedImages,
            showcases: [],
            documents: []
        };

        const detailFilePath = path.join(PROJECTS_DETAIL_DIR, `${slug}.json`);
        if (fs.existsSync(detailFilePath)) {
            console.log(`⚠️ Let op: ${slug}.json bestond al en wordt overschreven.`);
        }
        fs.writeFileSync(detailFilePath, JSON.stringify(newProjectDetail, null, 2) + '\n', 'utf8');
        console.log(`✅ Project detail aangemaakt: ${detailFilePath}`);

        // Index (projects.json) opnieuw genereren uit alle detailbestanden
        regenerateIndex();

        console.log('\n🎉 Project succesvol toegevoegd!');
        console.log(`Vul /public/data/projects/${slug}.json verder aan (beschrijving, techStack, highlights) en commit daarna naar git.\n`);

    } catch (error) {
        console.error('\n❌ Fout bij het toevoegen van het project:', error.message);
    } finally {
        rl.close();
    }
}

run();
