# Server Analyse — lukasportfolio.site

**Datum analyse:** 2026-06-21
**Host:** `serverlukas` · DigitalOcean droplet · `root@lukasportfolio.site`

---

## 1. Samenvatting

Op de server draaien **drie applicaties** in Docker, allemaal via één centrale
nginx reverse-proxy met Let's Encrypt TLS:

| App | Domein | Stack | Status |
|-----|--------|-------|--------|
| **Portfolio** | `lukasportfolio.site` | Angular + Spring Boot + Postgres | ✅ Live (HTTP 200) |
| **Memories** | `robinenlukas.nl` | Angular + Spring Boot + Postgres | ✅ Live (HTTP 200) |
| **b4llrz** | `lukasportfolio.site/b4llrz/api/` | Spring Boot + Postgres 16 | ✅ Draait (alleen API) |

Alle containers draaien stabiel: **0 restarts**, uptime 2–3 weken, server-uptime 26 dagen.
Load is verwaarloosbaar (0.00). Geen acute problemen, wel een aantal aandachtspunten
(zie §6).

---

## 2. Infrastructuur

| Onderdeel | Waarde |
|-----------|--------|
| OS | Ubuntu 24.04.3 LTS (Noble) |
| Kernel | 6.8.0-117-generic |
| CPU | 1 vCPU (DO-Regular @ 2.0 GHz) |
| RAM | 1.9 GiB totaal — **1.4 GiB in gebruik**, ~524 MiB beschikbaar |
| Swap | **0 B (geen swap)** ⚠️ |
| Disk | 48 GB — 7.6 GB gebruikt (16%), ruim voldoende |
| Docker | v29.1.3 · Compose v5.0.1 |

**Geheugendruk:** drie Java/Spring-backends + twee Postgres-instances vullen het
geheugen behoorlijk (~1.4 GiB van 1.9 GiB). Zonder swap is er weinig marge bij pieken.

---

## 3. Draaiende containers

```
NAME                   IMAGE                               STATUS         CPU     MEM
b4llrz_backend         b4llrz-backend                      Up 2 weeks     0.09%   307 MiB
b4llrz_postgres        postgres:16-alpine                  Up 2w healthy   0%      38 MiB
portfolio-backend      lukas05/portfolio-backend:latest    Up 2 weeks     0.20%   290 MiB
portfolio-frontend     lukas05/portfolio-frontend:latest   Up 2 weeks      0%      3 MiB
memories-backend       lukas05/myapp-backend:latest        Up 3 weeks     0.11%   265 MiB
memories-frontend      lukas05/myapp-frontend:latest       Up 3 weeks      0%      4 MiB
db (postgres:15)       postgres:15-alpine                  Up 3 weeks      0%      63 MiB
nginx                  nginx:alpine                        Up 3 weeks      0%      7 MiB
certbot                certbot/certbot                     Up 3 weeks      0%      5 MiB
portfolio-watchtower   containrrr/watchtower               Up 3w healthy   0.27%  10 MiB
```

Twee compose-projecten:
- **`/root/docker-compose.yml`** — portfolio + memories + nginx + certbot + watchtower + gedeelde `db`
- **`/root/b4llrz/docker-compose.yml`** — eigen Postgres 16 + backend, gekoppeld aan het nginx-netwerk

---

## 4. Netwerk & routing

nginx (`/root/nginx-proxy/conf.d/app.conf`) is het enige dat poorten 80/443 naar
buiten publiceert. Alle apps draaien intern via Docker-netwerk (`expose`, niet
`ports`) — netjes afgeschermd.

**Routing-overzicht:**

| Inkomend | → Doorgestuurd naar |
|----------|--------------------|
| `robinenlukas.nl/` | `frontend:80` (memories-frontend) |
| `robinenlukas.nl/api` | `backend:8080` (memories-backend) |
| `lukasportfolio.site/` | `portfolio-frontend:80` |
| `lukasportfolio.site/api` | `portfolio-backend:8080` |
| `lukasportfolio.site/b4llrz/api/` | `b4llrz_backend:8080/api/` |
| `:80` (beide domeinen) | 301 redirect → HTTPS |

b4llrz hangt via een external network (`root_default`) aan dezelfde nginx.
Upload-limiet 50 MB op alle API-routes.

---

## 5. TLS-certificaten

Beheerd door certbot, auto-renewal elke 12 uur:

| Certificaat | Vervalt | Geldig |
|-------------|---------|--------|
| `lukasportfolio.site` | 2026-08-10 | 49 dagen |
| `robinenlukas.nl-0001` | 2026-08-10 | 49 dagen |

Beide ruim binnen de renewal-window — geen actie nodig.

---

## 6. Aandachtspunten & aanbevelingen

> **Update 2026-06-21:** punten 1–4 en het SSH-risico zijn afgehandeld tijdens de
> reverse-proxy-refactor (zie `IMPLEMENTATIEPLAN_portfolio_reverse_proxy.md` en
> `/root/SERVER_README.md` op de server). Backup: `/root/backups/20260621-131201/`.

### ⚠️ Belangrijk
1. ✅ **AFGEHANDELD — Geen swap.** 2 GiB swapfile toegevoegd (`/swapfile`,
   `vm.swappiness=10`, persistent in fstab). Werd direct gebruikt (~46 MiB) — de box
   zat dus echt krap.

2. ✅ **AFGEHANDELD — UFW-regel poort 8080.** Verwijderd (v4 + v6). Alleen poort 22
   staat nu open; 80/443 lopen via Docker's eigen iptables-regels.

3. ✅ **AFGEHANDELD — fail2ban + SSH.** fail2ban geïnstalleerd en geactiveerd
   (sshd-jail). **Belangrijke bevinding:** SSH was géén key-only — `PermitRootLogin yes`
   én `PasswordAuthentication yes` (geforceerd door DigitalOcean cloud-init dropfiles
   via first-match-wins). Dichtgezet via `/etc/ssh/sshd_config.d/00-hardening.conf`:
   `PasswordAuthentication no` + `PermitRootLogin prohibit-password` (root = key-only).
   Geverifieerd met een verse key-verbinding.

### 🔧 Opruimen / netjes maken
4. ✅ **AFGEHANDELD — Orphan-container `b4llrz_nginx`** verwijderd. Raakte de
   werkende b4llrz-app (`b4llrz_backend` + `b4llrz_postgres`) niet.

   *Extra opgeruimd:* verweesde certbot renewal-config `robinenlukas.nl.conf`
   (parsefail) verwijderd; de echte cert `robinenlukas.nl-0001` vernieuwt prima.

5. ℹ️ **Watchtower watcht alleen portfolio** — **bewuste keuze**, nu gedocumenteerd in
   `/root/SERVER_README.md`. Memories en b4llrz worden handmatig gedeployd.

6. 🔭 **OPEN (later) — Twee aparte Postgres-versies** (15 voor portfolio/memories,
   16 voor b4llrz). Werkt prima, maar twee instances kosten extra geheugen.
   Consolideren naar één Postgres kan RAM besparen — vergt datamigratie, niet urgent.

### ℹ️ Log-observaties (geen acute fouten)
7. **memories-backend:** eenmalige `HttpMediaTypeNotAcceptableException` (29 mei) —
   een losse foutieve request, niet terugkerend. Benigne.
8. **b4llrz_backend:** `IllegalArgumentException: The character [_] is never valid
   in a domain name` — Tomcat weigert een Host-header met underscore (waarschijnlijk
   scanner/probe-verkeer). Wordt na de eerste keer op DEBUG-niveau gelogd. Benigne,
   maar het bevestigt dat de server publiek gescand wordt.

---

## 7. Conclusie

De server is **gezond en stabiel**. Drie productie-apps draaien zonder restarts,
TLS is in orde, routing is netjes opgezet met interne Docker-netwerken en een enkele
reverse-proxy.

**Stand na 2026-06-21:** de reverse-proxy is opgesplitst naar één conf per site en
de operationele hardening is doorgevoerd — swap toegevoegd, fail2ban actief, SSH
gehardend (password-auth uit, root key-only), de overbodige 8080-firewallregel
gesloten en de orphan-container opgeruimd. Daarmee staat de krappe 1-vCPU / 2-GiB
droplet er een stuk steviger op. Enige resterende verbeterpunt: Postgres
consolideren (niet urgent, vergt datamigratie).
