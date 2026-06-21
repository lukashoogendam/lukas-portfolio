# Docs

Projectdocumentatie en ops-plannen. Bestandsnamen dragen de datum waarop ze zijn
opgesteld/geïnventariseerd (`JJJJ-MM-DD-...`). Server-plannen zijn bedoeld om uit te
voeren op de DigitalOcean-droplet (`root@lukasportfolio.site`), niet in deze repo.

## Referentie (levend)

| Doc | Waarover |
|-----|----------|
| [angular-best-practices](2026-06-21-angular-best-practices.md) | Coderichtlijnen voor de Angular-frontend. Repo draait op Angular 22.0.2. |
| [beheerscripts](2026-06-21-beheerscripts.md) | `add-asset.js` / `add-project.js` — content beheren zonder handmatig JSON te editen. |
| [content-instructie-claude-desktop](2026-06-21-content-instructie-claude-desktop.md) | Prompt + regels om de portfolio-content (de `{nl,en}`-JSON) te verbeteren. |

## Server (DigitalOcean droplet)

| Doc | Status |
|-----|--------|
| [server-analyse](2026-06-21-server-analyse.md) | Levende analyse van de droplet (3 apps, nginx, TLS). Hardening afgehandeld. |
| [server-plan-reverse-proxy](2026-06-21-server-plan-reverse-proxy.md) | ✅ Uitgevoerd — per-site nginx-configs + hardening. Bewaard als record. |
| [server-plan-backend-opruiming](2026-06-21-server-plan-backend-opruiming.md) | ⏳ Open — portfolio-backend + `portfolio_db` verwijderen (site is nu frontend-only). |
| [server-plan-mapstructuur](2026-06-21-server-plan-mapstructuur.md) | ⏳ Open — `/root` herstructureren naar map-per-app + `proxy/` + `data/`. |
| [server-plan-backup](2026-06-21-server-plan-backup.md) | ⏳ Open — nachtelijke off-site backup naar Google Drive via rclone. |
