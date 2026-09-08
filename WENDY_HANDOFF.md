# Wandered & Found — Wendy Handoff Guide

This repository is the source of truth for the Wandered & Found website.

It is prepared so Wendy can deploy it in **her own Netlify account**. It does not depend on Chris's Netlify account, Netlify site IDs, Netlify environment variables, or Netlify credentials.

## Current handoff status

### Ready now

- Static visual-review website
- Wendy's current hero artwork and content icons
- Responsive desktop, tablet, and mobile layout
- Accessible navigation and semantic markup
- Netlify build configuration
- Security headers
- Safe preview deployment with search indexing disabled by default
- GitHub quality gate for build integrity and Lighthouse checks
- Contact, Shipping & Returns, Privacy, Terms, FAQ, About, and subscription-preview content

### Intentionally not live commerce yet

The current site is a handoff-ready **visual/prelaunch build**, not a finished commerce launch.

Before taking real orders, Wendy still needs final business inputs and the production commerce layer described in `PROJECT_SPEC.md`, including:

- final subscription and gift pricing
- shipping rates/coverage
- Stripe Checkout / Billing / Tax / Customer Portal
- Stripe webhook handling
- fulfillment database
- private authenticated admin area backed by real data
- final legal/policy copy
- end-to-end production checkout and fulfillment testing

No raw card data should ever be stored by this application.

## No-GitHub handoff — easiest path for Wendy now

Wendy does **not** need a GitHub account just to review or receive the site.

The quality workflow creates two handoff ZIP files:

- `wandered-found-preview.zip` — the built, safe, noindex review site ready for manual Netlify deployment
- `wandered-found-source.zip` — the editable source code Chris should keep and give Wendy for ownership/backups

### Chris's handoff steps

1. Open the latest successful **Quality Gate** run in GitHub Actions.
2. Download the **wendy-handoff** artifact.
3. Unzip that artifact once. It contains the two ZIP files above.
4. Put both ZIP files in OneDrive, Dropbox, Google Drive, on a USB drive, or another file-sharing method Wendy can access.
5. Send Wendy the share link or hand her the USB drive. Email is not required.

### Wendy's visual-review deployment without GitHub

1. Sign in to Wendy's Netlify account.
2. Unzip `wandered-found-preview.zip` to a folder on her computer.
3. Use Netlify's manual deploy / drag-and-drop flow and upload that folder.
4. Netlify will give Wendy a temporary review URL.
5. This preview remains intentionally non-indexed by search engines.

The manual preview is enough for Wendy to inspect the site and request design changes. For long-term production updates, keeping the source in version control is still recommended; Wendy can create a GitHub account later, but she does not need one for this handoff.

## GitHub-connected Netlify deployment — optional later

If Wendy later wants automatic deploys from source control:

1. Sign in to Wendy's Netlify account.
2. Choose **Add new project** / **Import an existing project**.
3. Connect GitHub and grant Netlify access to the production repository.
4. Select the Wandered & Found repository.
5. Netlify should read `netlify.toml` automatically.
6. Confirm the detected settings:
   - Build command: `node scripts/build-netlify.mjs`
   - Publish directory: `_site`
   - Node version: `22`
7. Deploy.

No Netlify environment variables are required for the first visual-review deployment.

## Safe first-deploy behavior

The first Netlify deployment is intentionally **not indexed by search engines**.

The build defaults to:

- `noindex,nofollow` on public pages
- `Disallow: /` in `robots.txt`
- no requirement for the production domain to be connected yet

This lets Wendy inspect the Netlify URL safely before launch.

## When wanderedandfound.org is ready to go public

After the production domain is connected and verified in Wendy's Netlify account, set these Netlify environment variables:

- `PUBLIC_INDEXING=enabled`
- `PUBLIC_SITE_URL=https://wanderedandfound.org`

Then trigger a new production deploy.

That build will:

- enable public indexing on public pages
- keep `/admin/` and `404.html` non-indexed
- add canonical URLs using `PUBLIC_SITE_URL`
- add Open Graph page URLs
- generate production `robots.txt` with the sitemap URL

Do **not** enable `PUBLIC_INDEXING` before the intended public launch.

## Domain ownership

The intended production domain is:

`wanderedandfound.org`

Domain registration/DNS ownership should ultimately live under Wendy's control. Netlify hosting and DNS can be configured under Wendy's account independently of Chris's Netlify account.

## Recommended long-term ownership model

- Wendy owns the production source code and backups.
- Wendy's Netlify account owns the production deploy.
- If GitHub is adopted later, Wendy owns or has administrator access to the production repository.
- `main` remains the production source branch.
- Automated quality checks remain enabled for production changes.

Do not copy Netlify credentials, Stripe secrets, webhook secrets, database credentials, or other secrets into the repository or the handoff ZIPs.

## Verification before handoff

Before giving Wendy the final package, confirm:

- latest `main` Quality Gate is green
- homepage hero matches Wendy's approved art
- the four "What's Inside" icons match Wendy's supplied motifs
- wording says **Start your adventure** where previously requested
- desktop, tablet, and mobile layouts are visually checked
- first Netlify preview deploy remains noindex
- no secrets are committed

## Launch gate

A successful Netlify preview means the **website package is handed off successfully**. It does not by itself mean paid commerce is ready.

Paid launch is complete only after the production requirements in `PROJECT_SPEC.md` are implemented, configured in Wendy's accounts, and tested end to end.
