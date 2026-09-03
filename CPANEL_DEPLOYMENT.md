# Standalone NMS cPanel Deployment

This repository is configured to run **NMS as an independent Node.js application**. It does not depend on DukeBox or Executive Suite and does not modify their files.

## Standalone deployment values

The repository’s production database layer now targets PostgreSQL/Supabase through Drizzle and the `postgres` driver. For Vercel, use the project’s Vite settings and the serverless API entrypoint under `api/index.ts`. The cPanel values below remain only as a reference for any future non-Vercel deployment.

## cPanel Selector values

| Field | Value |
|---|---|
| Application root | The server path where this repository is cloned, for example `/home/appjbaic/repositories/NMS_Manus` |
| Application URL | `https://app.jb3ai.com/` |
| Application mode | `Production` |
| Node.js version | Node `22.x` or the highest supported version available in the account |
| Startup file | `startup.js` |

The application root must be the exact directory containing `package.json` and `startup.js`. Do not point the Selector at `dist/`.

## Build and start

Install dependencies through the cPanel Selector’s **Run NPM Install** action after the new application is registered. Then build the production assets from the application root:

```bash
pnpm run build
```

The build creates the browser bundle under `dist/public/`, the existing general server bundle at `dist/index.js`, and the standalone cPanel server bundle at `dist/cpanel-index.js`. cPanel starts the application through `startup.js`, which loads `dist/cpanel-index.js`.

## Required server configuration

The standalone server requires the following values:

- `NODE_ENV=production`
- `JWT_SECRET`: a long random secret used for protected session cookies
- `NMS_PORTAL_PIN`: the portal access PIN
- Either `DATABASE_URL` or `NMS_DATA_FILE`; for Vercel production, use the persistent PostgreSQL `DATABASE_URL` from the NMS Supabase project

Use `.env.example` as the variable-name reference. Populate secrets only in cPanel environment variables or a server-side `.env` file. Never commit a populated `.env` file.

## Health and API checks

After the Selector reports the application as started, verify only public, non-authenticated behavior:

```bash
curl -fsS https://app.jb3ai.com/healthz
curl -sS -D - -o /dev/null https://app.jb3ai.com/
curl -sS -D - -o /dev/null https://app.jb3ai.com/api/trpc
```

The root response should be the NMS portal HTML, and `/healthz` should return JSON with `ok: true`. Do not submit the portal PIN or any protected document request during automated checks.

## Rollback

Stopping or removing the new Selector record does not delete this repository. Preserve the existing DukeBox rollback files and the Executive Suite directory. If the new application does not start, inspect the cPanel application log and restore the prior Selector record only after recording the error.
