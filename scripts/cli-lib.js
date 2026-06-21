// Gedeelde helpers voor de CLI-scripts (add-project.js, add-asset.js).
// Eén bron van waarheid voor slug-generatie en pad-veiligheid, zodat de twee
// tools niet uit elkaar lopen.
const path = require('path');

// Genereer een URL-veilige slug. Houdt alleen [a-z0-9-] over, zodat het
// resultaat altijd voldoet aan de slug-validatie in add-asset.js (^[a-z0-9-]+$).
function createSlug(text) {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]+/g, '')
        .replace(/-{2,}/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}

// Directory-traversal preventie: target moet binnen base liggen.
// Resolvet beide paden en eist een echte padgrens (base + sep), zodat een
// zustermap met dezelfde prefix (bv. "uploads-evil") niet doorglipt.
function isSafePath(basePath, targetPath) {
    const base   = path.resolve(basePath);
    const target = path.resolve(targetPath);
    return target === base || target.startsWith(base + path.sep);
}

module.exports = { createSlug, isSafePath };
