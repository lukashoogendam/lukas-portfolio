const fs = require('fs');
const path = require('path');
const https = require('https');

const DATA_DIR = path.join(__dirname, 'frontend', 'public', 'data');
const ASSETS_DIR = path.join(__dirname, 'frontend', 'public', 'assets', 'uploads');
const BASE_API_URL = 'https://lukasportfolio.site';

if (!fs.existsSync(ASSETS_DIR)) {
    fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(dest)) {
            // resolve(); // Let's re-download to ensure completeness
        }
        const file = fs.createWriteStream(dest);
        
        // Encode URL spaces
        const encodedUrl = encodeURI(url);
        
        https.get(encodedUrl, (response) => {
            if (response.statusCode !== 200) {
                fs.unlink(dest, () => reject(`Failed to download ${encodedUrl}: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => reject(err));
        });
    });
}

async function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find all occurrences of /api/uploads/filename including spaces
    const regex = /(?:https:\/\/lukasportfolio\.site)?\/api\/uploads\/([a-zA-Z0-9_.\-% ]+)/g;
    let match;
    const downloads = [];
    
    while ((match = regex.exec(content)) !== null) {
        const fullMatch = match[0];
        let filename = match[1];
        
        const decodedFilename = decodeURIComponent(filename);
        
        const downloadUrl = fullMatch.startsWith('http') ? fullMatch : `${BASE_API_URL}${fullMatch}`;
        
        const savePath = path.join(ASSETS_DIR, decodedFilename);
        
        console.log(`Found asset: ${decodedFilename}`);
        downloads.push({
            url: downloadUrl,
            dest: savePath,
            originalMatch: fullMatch,
            // encode the new path so that spaces become %20
            newPath: `/assets/uploads/${encodeURIComponent(decodedFilename)}`
        });
    }

    if (downloads.length > 0) {
        for (const dl of downloads) {
            try {
                console.log(`Downloading ${dl.url}...`);
                await downloadFile(dl.url, dl.dest);
                // Replace in content
                content = content.replace(new RegExp(dl.originalMatch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), dl.newPath);
            } catch (err) {
                console.error(err);
            }
        }
        
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
    }
}

async function run() {
    // We need to re-run the previous script first to restore the broken json paths
    // Wait, the previous script replaced '/api/uploads/1a70315b_Software' with '/assets/uploads/1a70315b_Software'.
    // And left ' ontwerp.pdf' alone. So now it is '/assets/uploads/1a70315b_Software ontwerp.pdf'.
    // Let me fix that. If it starts with /assets/uploads/ and has spaces, we can just download it.
    
    // Actually, let's restore the JSONs first by running the `migrate-data.js` script logic again, or just matching `/assets/uploads/` too.
}
