# Implementatieplan — Server opruiming portfolio-backend

> **Voor:** Claude Code op `root@lukasportfolio.site` (DigitalOcean droplet)
> **Doel:** de portfolio-backend en alles wat eraan hangt netjes van de server
> verwijderen, nu de portfolio een **frontend-only SPA** is (data uit statische
> `/data/*.json`). Zonder de live site, memories of b4llrz te raken.
> **Voorwaarde:** de frontend-only versie is gedeployd via PR #6 (main → deploy)
> en draait bewezen op de server. **Niets afbreken vóór dat bevestigd is.**

---

## ⚠️ Werkregels (live productieserver — lees eerst)

1. **Backup vóór elke wijziging.** Niets verwijderen zonder kopie/dump (Fase 1).
2. **Volgorde is alles.** Backend pas weg **nadat** de frontend-only versie live en
   geverifieerd is (Fase 0). Andersom = kapotte site.
3. **`nginx -t` vóór elke reload; nooit reloaden op een config die niet valideert.**
4. **🔴 = dataverlies/downtime-risico.** Stop, toon de geplande wijziging, wacht op
   expliciete "ja".
5. **Data eerst dumpen, dan pas droppen.** De database en het uploads-volume worden
   eerst veiliggesteld naar de backupmap.
6. **De gedeelde `.env` is van memories én portfolio.** Niets uit `.env` verwijderen
   zonder te checken of memories het nog gebruikt.

---

## 1. Context: wat verandert

De portfolio draaide als Angular-frontend **+** Spring Boot-backend **+** een database
(`portfolio_db`, in de gedeelde `db`). De nieuwe versie is **frontend-only**: de
Angular-app laadt alles uit statische JSON-bestanden in de image. Er zijn geen
`/api`-calls meer.

**Wat hierdoor overbodig wordt op de server:**

| # | Onderdeel | Waar | Actie |
|---|-----------|------|-------|
| 1 | `portfolio-backend` container | compose-project `root` | service + container weg |
| 2 | nginx-route `lukasportfolio.site/api` | `/root/nginx-proxy/conf.d/lukasportfolio.site.conf` | location-blok weg |
| 3 | Watchtower watcht `portfolio-backend` | `--cleanup portfolio-frontend portfolio-backend` | naam eruit |
| 4 | Database `portfolio_db` | gedeelde `db` (postgres:15) | 🔴 dumpen + droppen |
| 5 | Volume `root_portfolio-uploads` | door backend gevulde uploads | 🔴 backuppen + verwijderen |
| 6 | Portfolio-specifieke `.env`-vars | gedeelde `/root/.env` | optioneel opschonen (voorzichtig) |

**Mooie bijvangst:** zodra `portfolio_db` weg is, host de `db`-container alléén nog
`memories_db`. De "gedeelde database" is daarmee geen gedeeld ding meer — dat
vereenvoudigt het latere mapstructuur-plan (de aparte `data/`-map is dan niet meer
nodig; memories kan z'n eigen DB krijgen).

---

## 2. Routing: nu → straks (lukasportfolio.site)

```
NU                                          STRAKS
lukasportfolio.site/            → frontend  lukasportfolio.site/            → frontend
lukasportfolio.site/api         → backend   (weg — nergens meer heen)
lukasportfolio.site/b4llrz/api/ → b4llrz    lukasportfolio.site/b4llrz/api/ → b4llrz   (ongewijzigd)
```

---

## Fase 0 — Voorwaarde: frontend-only is LIVE (gate, geen wijziging)

Pas verdergaan als dit klopt. Verifieer:
```bash
# 1) Is de nieuwe frontend-image gepulld? (watchtower na merge PR #6)
docker inspect -f '{{.Created}} {{.Config.Image}}' portfolio-frontend
docker logs portfolio-watchtower --tail 20 | grep -i portfolio

# 2) Laadt de site en doet hij GEEN /api-calls meer?
curl -s -o /dev/null -w "site:  %{http_code}\n" https://lukasportfolio.site/
# /api mag straks gerust 404 zijn — er hoort niks meer te draaien:
curl -s -o /dev/null -w "/api:  %{http_code}\n" https://lukasportfolio.site/api/

# 3) Statische data bereikbaar? (bewijst frontend-only werkt)
curl -s -o /dev/null -w "data:  %{http_code}\n" https://lukasportfolio.site/data/profile.json
```
**Checkpoint:** `/data/profile.json` → 200 en de site werkt visueel zonder backend.
Zo niet → STOP, eerst PR #6 (laten) mergen en watchtower laten pullen.

---

## Fase 1 — Backup

```bash
TS=$(date +%Y%m%d-%H%M%S); mkdir -p /root/backups/$TS
cp -a /root/docker-compose.yml /root/backups/$TS/
cp -a /root/nginx-proxy/conf.d /root/backups/$TS/conf.d
cp -a /root/.env /root/backups/$TS/ 2>/dev/null
docker ps -a > /root/backups/$TS/docker_ps.txt
echo "Backup: /root/backups/$TS"
```
**Checkpoint:** backup compleet (DB- en volume-dump volgen in Fase 5/6, vlak vóór
het droppen).

---

## Fase 2 — nginx: `/api`-route verwijderen 🔴

In `/root/nginx-proxy/conf.d/lukasportfolio.site.conf` het portfolio-backend-blok weg:
```nginx
    # backend  ← DIT BLOK VERWIJDEREN
    location /api {
        client_max_body_size 50M;
        proxy_pass http://portfolio-backend:8080;
        ...
    }
```
> Laat `location /` (frontend) en `location /b4llrz/api/` (b4llrz) **ongemoeid**.

```bash
docker exec nginx nginx -t            # MOET ok zijn
docker exec nginx nginx -s reload     # pas hierna
curl -s -o /dev/null -w "site: %{http_code}\n" https://lukasportfolio.site/
```
**Checkpoint:** `nginx -t` ok + site nog 200. Faalt `-t` → niet reloaden, herstel
de conf uit de backup.

---

## Fase 3 — Watchtower: scope aanpassen

In `/root/docker-compose.yml` het watchtower-commando:
```yaml
    command: --interval 60 --cleanup portfolio-frontend          # portfolio-backend verwijderd
```
Toepassen:
```bash
cd /root && docker compose up -d portfolio-watchtower
docker logs portfolio-watchtower --tail 5
```

---

## Fase 4 — portfolio-backend service + container verwijderen

Verwijder de hele `portfolio-backend:`-service uit `/root/docker-compose.yml`
(inclusief env, volume-mount, expose). Daarna:
```bash
cd /root
docker compose up -d --remove-orphans       # herleest compose; backend wordt orphan
docker rm -f portfolio-backend 2>/dev/null  # zeker weten weg
docker ps --filter "name=portfolio" --format '{{.Names}} {{.Status}}'
```
**Checkpoint:** alleen `portfolio-frontend` blijft over; site nog 200; memories +
b4llrz ongemoeid.

---

## Fase 5 — Database `portfolio_db`: dumpen, dan droppen 🔴

Eerst veiligstellen, dan pas droppen (kan nu, want geen backend houdt 'm meer open):
```bash
TS=<jouw-backup-timestamp>
USER=$(grep '^DB_USERNAME' /root/.env | cut -d= -f2)
# Dump naar backupmap
docker exec db pg_dump -U "$USER" -d portfolio_db > /root/backups/$TS/portfolio_db.sql
ls -lh /root/backups/$TS/portfolio_db.sql      # niet 0 bytes!
# Pas ná een geslaagde dump:
docker exec db psql -U "$USER" -c 'DROP DATABASE portfolio_db;'
docker exec db psql -U "$USER" -lqt | cut -d'|' -f1   # portfolio_db moet weg, memories_db blijft
```
**Checkpoint 🔴:** toon de dump-grootte vóór het droppen. `memories_db` moet blijven
bestaan. Twijfel? Sla het droppen over en laat de DB staan tot je zeker bent.

> **Alternatief:** wil je de data nog niet kwijt → alleen dumpen, niet droppen.
> Een ongebruikte database kost amper iets; opruimen kan later.

---

## Fase 6 — Volume `root_portfolio-uploads`: BEHOUDEN

> **Beslissing (2026-06-21):** de uploads worden **bewaard, niet verwijderd.**
> Er staat al een lokale kopie op `~/Desktop/portfolio-uploads-backup/`
> (28 bestanden, 13 MB: project-PDF's, afbeeldingen, `sites/`).

Het volume `root_portfolio-uploads` blijft gewoon staan. Het hangt na Fase 4 aan
geen enkele container meer (de backend is weg), maar dat is prima — een los volume
kost vrijwel niks en je data blijft veilig op de server bewaard.

Optioneel, voor een extra server-side kopie in de tijdgestempelde backupmap:
```bash
TS=<jouw-backup-timestamp>
docker run --rm -v root_portfolio-uploads:/v -v /root/backups/$TS:/out alpine \
  sh -c 'tar czf /out/portfolio-uploads.tar.gz -C /v .'
```
> Wil je het volume later (als je zeker weet dat je het niet meer nodig hebt) tóch
> opruimen: `docker volume rm root_portfolio-uploads` — maar **niet** in dit plan.

---

## Fase 7 — `.env` opschonen (optioneel, voorzichtig)

De gedeelde `/root/.env` bevat mogelijk portfolio-only vars (`APP_BASE_URL`,
`CORS_ORIGINS`, eventueel `JWT_*`/`ADMIN_*` die alleen de portfolio-backend las).
**Memories gebruikt dezelfde `.env`** → eerst uitzoeken wat memories nog nodig heeft.

Aanpak: laat dit voorlopig staan (ongebruikte vars zijn ongevaarlijk), of verwijder
alleen wat aantoonbaar uitsluitend portfolio-backend gebruikte. Geen haast.

---

## Fase 8 — Eindverificatie & rollback

### 8.1 Verificatie
```bash
docker ps --format 'table {{.Names}}\t{{.Status}}'         # geen portfolio-backend meer
for url in https://lukasportfolio.site/ https://lukasportfolio.site/data/profile.json \
           https://robinenlukas.nl/ https://lukasportfolio.site/b4llrz/api/ ; do
  echo -n "$url -> "; curl -s -o /dev/null -w "%{http_code}\n" -m 8 "$url"
done
docker exec db psql -U "$USER" -lqt | cut -d'|' -f1        # alleen memories_db (+ postgres)
```
Verwacht: portfolio + memories frontend 200, b4llrz 401, `portfolio_db` weg.

### 8.2 Rollback (als iets stuk is)
```bash
TS=<jouw-backup-timestamp>
# Compose + nginx terug
cp -a /root/backups/$TS/docker-compose.yml /root/docker-compose.yml
cp -a /root/backups/$TS/conf.d/. /root/nginx-proxy/conf.d/
cd /root && docker compose up -d && docker exec nginx nginx -s reload
# Database terug (image bestaat nog op Docker Hub)
docker exec db psql -U "$USER" -c 'CREATE DATABASE portfolio_db;'
docker exec -i db psql -U "$USER" -d portfolio_db < /root/backups/$TS/portfolio_db.sql
# Uploads terug
docker volume create root_portfolio-uploads
docker run --rm -v root_portfolio-uploads:/v -v /root/backups/$TS:/in alpine \
  sh -c 'tar xzf /in/portfolio-uploads.tar.gz -C /v'
```

---

## 3. Samenvatting

| Fase | Wat | Risico |
|------|-----|--------|
| 0 | Gate: frontend-only is live & geverifieerd | geen (stopt anders) |
| 1 | Backup compose + nginx + env | geen |
| 2 | nginx `/api`-route weg + reload | 🔴 reverse proxy |
| 3 | Watchtower-scope aanpassen | laag |
| 4 | portfolio-backend service + container weg | laag (na Fase 0) |
| 5 | `portfolio_db` dumpen → droppen | 🔴 data |
| 6 | `portfolio-uploads` volume **behouden** (lokale kopie gemaakt) | geen |
| 7 | `.env` opschonen | optioneel, voorzichtig |
| 8 | Verificatie + rollback | geen |

**Eindresultaat:** de server draait alleen nog wat nodig is — portfolio = pure
statische frontend, memories en b4llrz ongemoeid, en de `db`-container host nog
uitsluitend `memories_db`. Alle verwijderde data ligt veilig in `/root/backups/<TS>/`.
