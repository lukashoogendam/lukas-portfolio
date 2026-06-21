# Implementatieplan — Nachtelijke off-site backup naar Google Drive

> **Voor:** Claude Code op `root@lukasportfolio.site` + één eenmalige browser-stap door Lukas.
> **Doel:** elke nacht de échte data (databases + uploads) versleuteld-over-TLS naar
> Google Drive, met retentie en een geteste restore. Zonder creditcard, zonder tweede server.
> **Waarom:** `/root/backups/` staat nu alleen op de droplet zelf — droplet weg = data weg.

---

## Wat wordt er geback-upt
| Bron | Hoe | Waarom |
|------|-----|--------|
| `memories_db` (postgres:15, container `db`) | `pg_dump` | échte, onvervangbare data |
| `b4llrz` database (postgres:16, `b4llrz_postgres`) | `pg_dump` | échte data |
| volume `root_uploads` | tar | memories-uploads |
| volume `root_portfolio-uploads` | tar | behouden portfolio-uploads |
| config-bundle: compose-files + `.env`'s | tar | nodig om alles te kunnen herbouwen (disaster recovery) |

> De config-bundle bevat secrets (`.env`). Drive is privé voor jouw account; de bundle
> blijft daarbinnen. rclone praat over TLS. Geen secrets in git.

---

## Auth-model (belangrijk)
- rclone's **ingebouwde, gepubliceerde** OAuth-client → token verloopt niet.
- Scope **`drive.file`**: rclone ziet/raakt alléén bestanden die het zelf aanmaakt.
  Het krijgt GEEN toegang tot de rest van je Drive. Veiligste optie.
- Token + config staan in `/root/.config/rclone/rclone.conf` (perms 600), nooit in git.

---

## Eenmalige stap die JIJ doet (browser, ~5 min)
Op je Mac:
```bash
brew install rclone
rclone authorize "drive" --drive-scope=drive.file
```
- Er opent een browser → kies je Google-account → sta toe.
- rclone print een **token-blok** (JSON tussen `--->` en `<---`).
- Plak dat token-blok aan mij (of in de server-config). Het is gevoelig maar kortlevend
  van vorm; ik zet het meteen met perms 600 op de server.

> Dit is de enige stap die een browser nodig heeft. Al het andere doe ik op de server.

---

## Wat IK daarna op de server doe
### 1. rclone installeren + remote configureren
```bash
curl https://rclone.org/install.sh | bash      # of via apt
# remote "gdrive" aanmaken met het geplakte token, scope drive.file
```
Verificatie: `rclone lsd gdrive:` werkt + `rclone mkdir gdrive:lukasportfolio-backups`.

### 2. Backup-script `/root/scripts/backup.sh`
```
TS=YYYYMMDD-HHMMSS, werkmap /root/backups/$TS
- pg_dump memories_db          -> memories_db.sql.gz   (gzip)
- pg_dump b4llrz               -> b4llrz_db.sql.gz
- tar root_uploads             -> uploads.tar.gz
- tar root_portfolio-uploads   -> portfolio-uploads.tar.gz
- tar compose+.env             -> config.tar.gz
- integriteitscheck: gzip -t op elk bestand + grootte > 0  (faalt hard bij 0 bytes)
- rclone copy /root/backups/$TS  gdrive:lukasportfolio-backups/$TS
- log naar /root/backups/backup.log
```
DB-credentials komen uit de bestaande `.env`'s; niets gehardcode.

### 3. Retentie (lokaal + op Drive)
- Drive: `rclone delete --min-age 14d gdrive:lukasportfolio-backups` + `rclone rmdirs`
- Lokaal: alleen de laatste 3 dagen op de droplet houden (schijf netjes).

### 4. Cron (dagelijks 03:30)
```
30 3 * * * /root/scripts/backup.sh >> /root/backups/backup.log 2>&1
```

### 5. Restore-test (bewijs dat het werkt)
Direct na de eerste run, geautomatiseerd:
```
- nieuwste memories_db.sql.gz van Drive halen
- restoren in een WEGWERP-database (memories_db_restoretest)
- SELECT count(*) FROM users  -> moet > 0 zijn
- wegwerp-db droppen
```
Daarna documenteer ik de handmatige full-restore in `SERVER_README.md`.

---

## Faalveilig / werkregels
- Script stopt hard als een dump 0 bytes is (geen lege backup uploaden).
- `set -euo pipefail`; elke stap gelogd met tijdstempel.
- rclone.conf perms 600, eigenaar root, nooit in git.
- Eerste run draai ik handmatig en controleer ik in jouw Drive vóór ik de cron aanzet.

---

## Samenvatting
| Stap | Wie | Risico |
|------|-----|--------|
| `rclone authorize` in browser | **Lukas** | geen |
| rclone install + remote config | ik | geen |
| backup-script schrijven | ik | geen |
| eerste run handmatig + check in Drive | ik | geen (leest alleen) |
| retentie + cron aanzetten | ik | laag |
| restore-test | ik | geen (wegwerp-db) |

**Eindresultaat:** elke nacht een verse, geverifieerde kopie van al je data buiten de
droplet, 14 dagen historie, en een bewezen restore. Kosten: €0.
