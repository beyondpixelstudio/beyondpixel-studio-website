# Deployment

Every push to `main` builds the site and uploads it to Hostinger. It also
rebuilds itself once a day, so a video added to a YouTube playlist appears on
the Work page without anyone touching the code.

The workflow is `.github/workflows/deploy.yml`.

---

## The five secrets

Add these at **Settings → Secrets and variables → Actions → New repository
secret**. Nothing here is ever written into the repository, and GitHub masks
these values in the logs.

| Secret | Where it comes from |
|---|---|
| `FTP_SERVER` | hPanel → Files → FTP Accounts → **FTP hostname**. Usually `ftp.beyondpixel.studio` or an IP. |
| `FTP_USERNAME` | The FTP account username on that same page. |
| `FTP_PASSWORD` | The password for that FTP account. If you do not know it, change it there — do not reuse your hPanel login. |
| `FTP_SERVER_DIR` | Where the site lives on the server, **with a trailing slash**. For a primary domain this is `/public_html/`. |
| `YOUTUBE_API_KEY` | console.cloud.google.com → APIs & Services → Credentials. See the warning below. |

### The YouTube key needs one specific setting

Application restrictions must be **None**, and API restrictions set to
**YouTube Data API v3**.

An HTTP-referrer restriction cannot work here. Referrer restrictions only apply
to requests made by a browser, and this key is used by Node during the build —
which sends no `Referer` header at all, so every call returns 403. That is the
state the key is in today, which is why the playlist grids currently fall back
to the seeded list.

Setting it to "None" sounds like loosening security and is not. The key never
reaches a visitor's browser: the build runs on GitHub's machine, and the only
other consumer is the Apps Script proxy, which is also server-side. The worst a
leak costs is quota on a read-only public-data API.

---

## What happens on a push

1. `npm ci` — installs exactly what `package-lock.json` pins.
2. `npm run verify` — contrast, NAP, build, audit.
3. Upload `dist/` over FTP.

**Step 2 is a gate, not a formality.** If a colour pair drops below AA, a phone
number appears outside `business.ts`, an internal link dies, a title runs past
60 characters, an FAQ answer stops matching its schema, or a credential reaches
`dist/`, the run fails and **nothing is uploaded**. The live site stays exactly
as it was.

A pipeline that deploys whatever compiles is worse than deploying by hand,
because it removes the moment where someone looks.

---

## Deploying without pushing

**Actions → Build and deploy → Run workflow.** Use it after uploading a video
when you do not want to wait for the 08:00 IST rebuild.

---

## If a deploy fails

Open the run in the **Actions** tab. The failing step names the problem
directly — the audit prints what broke and on which page.

- **Verify failed** — a real defect. Fix it; the live site is untouched.
- **FTP step failed** — almost always credentials or `FTP_SERVER_DIR`. Confirm
  the directory exists in hPanel's File Manager and that the path ends in `/`.
- **Deploy succeeded, site unchanged** — the action keeps a sync manifest on the
  server. Delete `.ftp-deploy-sync-state.json` from the remote directory and
  re-run to force a full upload.

---

## What is not in this repository

`dist/` and `node_modules/` are ignored — the first is generated, the second is
installed. `.env` is ignored too; it holds the YouTube key for local builds, and
its committed counterpart `.env.example` documents the variable with no value in
it.
