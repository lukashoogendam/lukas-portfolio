const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Pad configuratie
const FRONTEND_DIR = path.join(__dirname, 'frontend');
const DATA_DIR = path.join(FRONTEND_DIR, 'public', 'data');
const PROJECTS_LIST_FILE = path.join(DATA_DIR, 'projects.json');
const PROJECTS_DETAIL_DIR = path.join(DATA_DIR, 'projects');
const UPLOADS_DIR = path.join(FRONTEND_DIR, 'public', 'assets', 'uploads');

// Helper voor veilige paden (Directory Traversal preventie)
function isSafePath(basePath, userPath) {
    const resolvedPath = path.resolve(basePath, userPath);
    return resolvedPath.startsWith(basePath);
}

// Helper voor slug generatie
function createSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Spaties naar dashes
        .replace(/[^\w\-]+/g, '')       // Verwijder non-word characters
        .replace(/\-\-+/g, '-')         // Vervang meerdere dashes
        .replace(/^-+/, '')             // Trim dash aan begin
        .replace(/-+$/, '');            // Trim dash aan eind
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

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
        const shortDescEn = await question('5. Korte beschrijving (EN): ');

        const category = await question('6. Categorie (SCHOOL_PROJECT of PERSONAL_PROJECT) [PERSONAL_PROJECT]: ') || 'PERSONAL_PROJECT';
        
        const imagePathsInput = await question('7. Afbeeldingen toevoegen? (geef volledige lokale paden, gescheiden door komma, of laat leeg): ');
        
        console.log('\n--- Bezig met verwerken... ---\n');

        // 1. Zorg dat mappen bestaan
        if (!fs.existsSync(PROJECTS_DETAIL_DIR)) fs.mkdirSync(PROJECTS_DETAIL_DIR, { recursive: true });
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

        // 2. Afbeeldingen veilig kopiëren
        const uploadedImages = [];
        if (imagePathsInput.trim()) {
            const paths = imagePathsInput.split(',').map(p => p.trim());
            for (let i = 0; i < paths.length; i++) {
                const imgPath = paths[i];
                if (fs.existsSync(imgPath) && fs.statSync(imgPath).isFile()) {
                    // Genereer een veilige bestandsnaam
                    const ext = path.extname(imgPath);
                    const safeName = `${slug}-${Date.now()}-${i}${ext}`;
                    const targetPath = path.join(UPLOADS_DIR, safeName);
                    
                    if (!isSafePath(UPLOADS_DIR, targetPath)) {
                        throw new Error(`Onveilig bestandspad gedetecteerd: ${targetPath}`);
                    }

                    fs.copyFileSync(imgPath, targetPath);
                    uploadedImages.push({
                        title: `Screenshot ${i + 1}`,
                        imageUrl: `/assets/uploads/${safeName}`,
                        sortOrder: i + 1
                    });
                    console.log(`✅ Afbeelding gekopieerd: ${safeName}`);
                } else {
                    console.log(`⚠️ Waarschuwing: Afbeelding niet gevonden of is geen bestand: ${imgPath}`);
                }
            }
        }

        // 3. Project Detail JSON aanmaken
        const newProjectDetail = {
            id: Date.now(), // Unieke ID genereren
            slug: slug,
            title: title,
            titleEn: titleEn,
            shortDescription: shortDesc,
            shortDescriptionEn: shortDescEn,
            description: "Voeg hier je volledige markdown beschrijving toe...",
            descriptionEn: "Add your full markdown description here...",
            role: "Mijn rol...",
            roleEn: "My role...",
            highlights: "- Highlight 1\n- Highlight 2",
            highlightsEn: "- Highlight 1\n- Highlight 2",
            category: category,
            status: "COMPLETED",
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date().toISOString().split('T')[0],
            repositoryUrl: "",
            techStack: [],
            features: [],
            featuresEn: [],
            images: uploadedImages,
            showcases: [],
            documents: [],
            links: {},
            skillIds: [],
            courseName: null,
            documentUrl: null,
            highlighted: true
        };

        const detailFilePath = path.join(PROJECTS_DETAIL_DIR, `${slug}.json`);
        fs.writeFileSync(detailFilePath, JSON.stringify(newProjectDetail, null, 2), 'utf8');
        console.log(`✅ Project detail aangemaakt: ${detailFilePath}`);

        // 4. Project List JSON updaten
        let projectsList = [];
        if (fs.existsSync(PROJECTS_LIST_FILE)) {
            projectsList = JSON.parse(fs.readFileSync(PROJECTS_LIST_FILE, 'utf8'));
        }

        // Check of slug al bestaat om dubbelingen te voorkomen
        if (projectsList.some(p => p.slug === slug)) {
            console.log(`⚠️ Waarschuwing: Een project met slug '${slug}' bestond al in de lijst. Het is bijgewerkt in de details, maar zorg dat er geen conflicten in projects.json zijn.`);
        } else {
            const newListItem = {
                slug: slug,
                title: title,
                titleEn: titleEn,
                shortDescription: shortDesc,
                shortDescriptionEn: shortDescEn,
                category: category,
                status: "COMPLETED",
                courseName: null,
                courseNameEn: null,
                highlighted: true,
                sortOrder: projectsList.length > 0 ? Math.max(...projectsList.map(p => p.sortOrder || 0)) + 1 : 1
            };
            projectsList.push(newListItem);
            fs.writeFileSync(PROJECTS_LIST_FILE, JSON.stringify(projectsList, null, 2), 'utf8');
            console.log(`✅ Toegevoegd aan projectenlijst: ${PROJECTS_LIST_FILE}`);
        }

        console.log('\n🎉 Project succesvol toegevoegd!');
        console.log(`Vergeet niet om de bestanden in /public/data/projects/${slug}.json verder aan te vullen (zoals je lange beschrijving en tech stack) en daarna te committen naar git.\n`);

    } catch (error) {
        console.error('\n❌ Fout bij het toevoegen van het project:', error.message);
    } finally {
        rl.close();
    }
}

run();
