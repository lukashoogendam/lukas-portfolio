#!/usr/bin/env node
/**
 * add-asset.js — voeg een afbeelding of document toe aan een bestaand project.
 *
 * Gebruik:
 *   node add-asset.js --project <slug> --file <pad> --title <titel> [--type image|document]
 *
 * Opties:
 *   --project   Slug van het project (bijv. "firsfs")
 *   --file      Lokaal pad naar het bestand (afbeelding of PDF)
 *   --title     Weergavetitel in de portfolio
 *   --type      "image" of "document" (standaard: automatisch op basis van extensie)
 *
 * Voorbeelden:
 *   node add-asset.js --project firsfs --file ~/Downloads/rapport.pdf --title "Onderzoeksrapport"
 *   node add-asset.js --project firsfs --file ~/Desktop/screenshot.png --title "Hoofdscherm"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const FRONTEND_DIR = path.join(__dirname, 'frontend');
const UPLOADS_DIR  = path.join(FRONTEND_DIR, 'public', 'assets', 'uploads');
const PROJECTS_DIR = path.join(FRONTEND_DIR, 'public', 'data', 'projects');

const IMAGE_EXTENSIONS    = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']);
const DOCUMENT_EXTENSIONS = new Set(['.pdf', '.docx', '.xlsx', '.pptx', '.zip']);

// --- CLI args -----------------------------------------------------------

function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i++) {
        if (argv[i].startsWith('--') && i + 1 < argv.length) {
            args[argv[i].slice(2)] = argv[++i];
        }
    }
    return args;
}

function printUsageAndExit(message) {
    if (message) console.error(`\nFout: ${message}`);
    console.error(`
Gebruik:
  node add-asset.js --project <slug> --file <pad> --title <titel> [--type image|document]

Opties:
  --project   Slug van het project (bijv. "firsfs")
  --file      Lokaal pad naar het bestand
  --title     Weergavetitel in de portfolio
  --type      "image" of "document" (optioneel, standaard automatisch)
`);
    process.exit(1);
}

// --- Helpers ------------------------------------------------------------

function shortHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

function isSafePath(basePath, targetPath) {
    const base   = path.resolve(basePath);
    const target = path.resolve(targetPath);
    return target === base || target.startsWith(base + path.sep);
}

function detectType(ext) {
    if (IMAGE_EXTENSIONS.has(ext))    return 'image';
    if (DOCUMENT_EXTENSIONS.has(ext)) return 'document';
    return null;
}

function nextId(items) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(i => i.id || 0)) + 1;
}

function nextSortOrder(items) {
    if (!items || items.length === 0) return 0;
    return Math.max(...items.map(i => i.sortOrder ?? -1)) + 1;
}

// --- Main ---------------------------------------------------------------

function run() {
    const args = parseArgs(process.argv);

    if (!args.project) printUsageAndExit('--project is verplicht.');
    if (!args.file)    printUsageAndExit('--file is verplicht.');
    if (!args.title)   printUsageAndExit('--title is verplicht.');

    const filePath = path.resolve(args.file.replace(/^~/, process.env.HOME));

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        printUsageAndExit(`Bestand niet gevonden: ${filePath}`);
    }

    const ext  = path.extname(filePath).toLowerCase();
    const type = args.type || detectType(ext);

    if (!type) {
        printUsageAndExit(
            `Extensie "${ext}" wordt niet herkend. Geef --type image of --type document mee.`
        );
    }
    if (type !== 'image' && type !== 'document') {
        printUsageAndExit(`--type moet "image" of "document" zijn, niet "${type}".`);
    }

    if (!/^[a-z0-9-]+$/.test(args.project)) {
        printUsageAndExit(
            `Ongeldige slug "${args.project}". Gebruik alleen kleine letters, cijfers en streepjes.`
        );
    }

    const projectFile = path.join(PROJECTS_DIR, `${args.project}.json`);
    if (!isSafePath(PROJECTS_DIR, projectFile)) {
        printUsageAndExit('Onveilig projectpad gedetecteerd.');
    }
    if (!fs.existsSync(projectFile)) {
        printUsageAndExit(
            `Project "${args.project}" niet gevonden. Controleer of ${projectFile} bestaat.`
        );
    }

    // Genereer unieke bestandsnaam: <hash>_<originele naam>
    const hash     = shortHash(filePath);
    // Maak de bestandsnaam URL-veilig: spaties, #, ? e.d. breken de asset-URL.
    const safeName = path.basename(filePath).replace(/[^a-zA-Z0-9._-]/g, '-');
    const destName = `${hash}_${safeName}`;
    const destPath = path.join(UPLOADS_DIR, destName);

    if (!isSafePath(UPLOADS_DIR, destPath)) {
        printUsageAndExit('Onveilig doelpad gedetecteerd.');
    }

    if (fs.existsSync(destPath)) {
        console.log(`Bestand bestaat al in uploads (zelfde inhoud): ${destName}`);
    } else {
        fs.copyFileSync(filePath, destPath);
        console.log(`Gekopieerd naar: ${destPath}`);
    }

    const publicUrl = `/assets/uploads/${destName}`;

    // Laad en update project JSON
    const project = JSON.parse(fs.readFileSync(projectFile, 'utf8'));

    if (type === 'image') {
        if (!Array.isArray(project.images)) project.images = [];
        project.images.push({
            id:        nextId(project.images),
            title:     args.title,
            imageUrl:  publicUrl,
            sortOrder: nextSortOrder(project.images)
        });
        console.log(`Afbeelding toegevoegd aan "${args.project}": ${args.title}`);
    } else {
        if (!Array.isArray(project.documents)) project.documents = [];
        project.documents.push({
            id:        nextId(project.documents),
            title:     args.title,
            url:       publicUrl,
            sortOrder: nextSortOrder(project.documents)
        });
        console.log(`Document toegevoegd aan "${args.project}": ${args.title}`);
    }

    fs.writeFileSync(projectFile, JSON.stringify(project, null, 2), 'utf8');
    console.log(`JSON bijgewerkt: ${projectFile}`);
    console.log(`\nKlaar. Rebuild + deploy om de wijziging live te zetten.`);
}

run();
