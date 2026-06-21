# Portfolio beheerhulpscripts

Snelle referentie voor de Node.js-scripts waarmee je de portfolio-content beheert zonder handmatig JSON te hoeven editen.

> Alle scripts draaien vanuit de **root van de repo** (`lukas-portfolio/`).
> Vereiste: Node.js geïnstalleerd — geen `npm install` nodig, alleen standaard Node-modules.

---

## add-asset.js — asset toevoegen aan een project

Kopieert een lokaal bestand (afbeelding of PDF) naar `frontend/public/assets/uploads/` en voegt het automatisch toe aan de juiste array in het project-JSON.

### Gebruik

```bash
node add-asset.js --project <slug> --file <pad> --title <titel> [--type image|document]
```

| Optie | Verplicht | Omschrijving |
|-------|-----------|--------------|
| `--project` | ✅ | Slug van het project, bijv. `firsfs` of `portfolio-website` |
| `--file` | ✅ | Lokaal pad naar het bestand (`~/` wordt uitgevouwen) |
| `--title` | ✅ | Weergavetitel in de portfolio |
| `--type` | ❌ | `image` of `document` — wordt automatisch bepaald op basis van extensie |

**Ondersteunde extensies:**
- Afbeeldingen: `.png` `.jpg` `.jpeg` `.gif` `.webp` `.svg`
- Documenten: `.pdf` `.docx` `.xlsx` `.pptx` `.zip`

### Voorbeelden

```bash
# PDF document toevoegen
node add-asset.js --project firsfs --file ~/Downloads/rapport.pdf --title "Onderzoeksrapport"

# Screenshot toevoegen
node add-asset.js --project firsfs --file ~/Desktop/scherm.png --title "Hoofdscherm"

# Extensie niet herkend? Geef type mee
node add-asset.js --project mijn-project --file ~/data.csv --title "Dataset" --type document
```

### Wat het script doet

1. Berekent een MD5-hash van de bestandsinhoud en prefixed de bestandsnaam ermee (bijv. `a1b2c3d4_rapport.pdf`) — zo worden dubbele uploads voorkomen en botsen bestandsnamen nooit.
2. Kopieert het bestand naar `frontend/public/assets/uploads/`.
3. Voegt een nieuwe entry toe aan `images` of `documents` in `frontend/public/data/projects/<slug>.json`.
4. Behoudt de bestaande `id`- en `sortOrder`-nummering.

### Na het uitvoeren

De wijziging staat alleen lokaal. Om het live te zetten:

```bash
git add frontend/public/
git commit -m "content: voeg <titel> toe aan <project>"
git push
# Rebuild + deploy het Docker image op de server
```

---

## add-project.js — nieuw project aanmaken

Interactief script dat stap voor stap vraagt om projectgegevens en daarna:
- Een nieuw `frontend/public/data/projects/<slug>.json` aanmaakt
- Het project toevoegt aan `frontend/public/data/projects.json`
- Optioneel direct afbeeldingen uploadt

```bash
node add-project.js
```

Het script stelt vragen in de terminal. Vul daarna het gegenereerde JSON-bestand handmatig aan voor de volledige beschrijving en tech stack.
