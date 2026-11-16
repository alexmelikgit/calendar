# calendar.bardzunk.am on cPanel

This branch exports Next.js to static files. The hosting account needs Apache
with mod_rewrite, HTTPS and explicit FTPS; Node.js runs only in GitHub Actions.
Content remains in src/content. All existing calendar years (1900–2200), both
languages, feast pages and query filters remain supported. Only the dates
actually present in the content files are displayed as feasts.

## One-time cPanel setup

1. Create calendar.bardzunk.am with its own empty document root. Turn OFF
   sharing bardzunk.am's document root. Enable HTTPS using the host's SSL tools.
2. Point the calendar DNS record to this shared hosting server if needed.
3. Create a dedicated FTP user jailed to the calendar document root. Do not use
   the main account, and do not point deployment at bardzunk.am's WordPress root.
4. Find the FTP server hostname with a valid TLS certificate and confirm the
   provider supports explicit FTPS on port 21. This script does not support
   plain FTP, implicit FTPS or SFTP. Keep certificate verification enabled.

## GitHub setup (alexmelikgit/calendar)

Settings → Secrets and variables → Actions → Secrets: add repository secrets:

| Secret | Value |
| --- | --- |
| FTP_HOST | Provider's FTP hostname, without a URL scheme |
| FTP_USER | Dedicated FTP user's full username |
| FTP_PASSWORD | Dedicated user's password |
| FTP_REMOTE_DIR | `/` for an account jailed directly to the subdomain root; otherwise its verified subdomain directory |

First merge the reviewed PR. The workflow builds on main pushes and PRs, and
uploads a `calendar-static` artifact. Deployment is initially OFF.

After confirming the destination and secrets, add repository VARIABLE
`DEPLOY_ENABLED` = `true` in the Variables tab. Open Actions → Build and deploy
static calendar → Run workflow → main. Future main pushes build and deploy.
Forks may require enabling Actions first.

The upload includes `.htaccess` and only the `out/` output. No source, Git
history, node_modules, credentials or database is uploaded. Existing remote
files are never deleted; obsolete hashed assets can be cleaned up separately.
The complete original year range generates about 7,200 month pages, so the
first FTPS upload can take a while.

## Verify after deployment

- `/` opens Armenian and selects the current month in Asia/Yerevan at visit time.
- `/2027/01?day=2027-01-06` redirects to Armenian, retaining query parameters.
- `/hy/2027/01/` and `/en/2027/01/` load directly and survive refresh.
- Filters, highlighted dates, feast pages, language switching and navigation work.
- Illustrations and fonts load; invalid localized URLs return a 404.

`npm run build` generates `out/`; `npm run lint` checks the source.
For a local preview use an Apache server configured to allow the supplied
`.htaccess`. A plain static server can preview localized paths, but cannot
exercise the Apache redirects.

## Rollback

Set DEPLOY_ENABLED to false to pause automatic uploads. Revert the faulty code
commit in GitHub, let the build pass, re-enable deployment and run main again.
Keep the previous workflow artifact for a manual upload if needed.
