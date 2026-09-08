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

## Deploy to Wendy's Netlify account

1. Sign in to Wendy's Netlify account.
2. Choose **Add new project** / **Import an existing project**.
3. Connect GitHub and grant Netlify access to this repository.
4. Select `cbw29512/wendywebsite` (or the new repository location if ownership has already been transferred to Wendy).
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

## GitHub handoff

Recommended final ownership model:

- Wendy owns or has administrator access to the production GitHub repository.
- Wendy's Netlify account is connected directly to that repository.
- `main` is the production source branch.
- GitHub Actions remains enabled so every push to `main` runs the quality gate.

Do not copy Netlify credentials, Stripe secrets, webhook secrets, database credentials, or other secrets into the repository.

## Verification before handoff

Before giving Wendy the final repository access, confirm:

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
