# Instructie voor Claude Desktop — portfolio-content verbeteren

Kopieer alles onder de streep naar Claude Desktop en sleep de map
`frontend/public/data/` (met de submap `projects/`) erbij in het gesprek.

---

Je helpt me de **content van mijn portfolio-website** te verbeteren. De site is een
frontend-only Angular-app die zijn data uit deze statische JSON-bestanden laadt. Jouw taak
is de **teksten** beter te maken — niet de structuur.

## Hoe de data eruitziet (belangrijk)
Alle vertaalbare velden zijn objecten met **twee talen**:
```json
"title": { "nl": "Webshop", "en": "Webshop" }
```
Op dit moment is de `en`-kant vaak gewoon een kopie van het Nederlands. `highlights` is een
object met twee arrays:
```json
"highlights": { "nl": ["Punt 1", "Punt 2"], "en": ["Point 1", "Point 2"] }
```

## Wat ik wil dat je doet
1. **Engels echt vertalen.** Vul bij elk `{nl, en}`-veld de **`en`**-kant met natuurlijk,
   vloeiend Engels (geen letterlijke vertaling). Laat de **`nl`**-kant staan zoals hij is,
   tenzij je daar ook een verbetering ziet.
2. **Typo's en namen fixen** in beide talen. Bekende fouten: databse→database,
   Yupiter notebook→Jupyter Notebook, Springboot→Spring Boot, gilab→GitLab,
   clasifier→classifier, markstandaarden→marktstandaarden, authorisatie→autorisatie,
   jwt→JWT, prive→privé, "powerlift webshop"→powerlifting.
   > Let op: als je een skill-naam in `techStack` wijzigt, moet exact dezelfde naam ook
   > in `skills.json` staan (anders faalt de build-validatie). Wijzig skill-namen dus
   > consequent in beide, of laat ze staan.
3. **Zwakke teksten aanscherpen.** Maak korte beschrijvingen pakkend en concreet. Leg
   afkortingen uit (bijv. "MIZ"). Schrijf actief en vanuit mij (ik-vorm).
4. **Lege velden vullen waar logisch:**
   - `portfolio-website` heeft een lege `shortDescription` ({nl:"",en:""}) — schrijf er een.
   - `profile.json` heeft een lege `summary` — schrijf een korte bio (NL + EN).
   - `skills.json`: `description` is `null` — vul kort `{nl,en}` in (1 zin), of laat `null`.
   - Vul GEEN `timeline.json` (leeg) of `featured-skills.json` met verzonnen data — vraag
     mij eerst welke opleidingen/werkervaring of uitgelichte skills erin moeten.
5. **Toon:** professioneel maar persoonlijk, student Informatica / beginnend backend
   developer. Niet opscheppen, wel zelfverzekerd. Nederlands netjes, Engels vlot.

## Harde regels — NIET aan komen (anders breekt de site)
- **Bewerk NOOIT `projects.json` direct** — dat bestand wordt automatisch gegenereerd uit
  de losse `projects/<slug>.json`. Pas alleen de detailbestanden in `projects/` aan.
- Verander de **structuur** niet: elk `{nl,en}`-object houdt exact die twee keys; arrays
  blijven arrays; voeg geen keys toe en gooi er geen weg.
- Raak deze velden NIET aan: `slug`, `repositoryUrl`, `imageUrl`/`url` (links, afbeeldingen,
  documenten), `icon`, `type`.
- Enum-waarden blijven exact en worden niet vertaald:
  - project `category`: `SCHOOL_PROJECT`, `PERSONAL_PROJECT`
  - project `status`: `COMPLETED`, `IN_PROGRESS`
  - skill `category`: `BACKEND`, `FRONTEND`, `DATABASE`, `DATA`, `DEVOPS`, `TOOLS`, `MOBILE`, `CLOUD`
- In `description`-velden staat Markdown (`\n`, `---`, `**vet**`). Behoud die opmaak.
- Het blijft **geldige JSON**.
- **Verzin geen feiten.** Weet je iets niet, vraag het mij of laat het veld staan.

## Aanpak
Loop de bestanden één voor één door. Geef per bestand eerst kort wat je verandert en
waarom, en lever daarna het volledige verbeterde JSON-bestand terug zodat ik het 1-op-1
kan terugzetten. Begin met `profile.json` en de projectbestanden met veel tekst
(`chatbot-dashboard`, `firsfs`, `youtube-dashboard`).

> Na het terugzetten kan ik lokaal `npm run validate:data` draaien — dat controleert of de
> structuur nog klopt (geldige enums, `{nl,en}`-velden, bestaande techStack-namen).
