# Wandered & Found — visual review build

This repository is the source of truth for Wendy's Wandered & Found website. It is intentionally a dependency-free static site for visual review and prelaunch deployment.

The project is prepared to be deployed from **Wendy's own Netlify account**. It does not require Chris's Netlify account or an existing Netlify site ID.

Wendy does **not** need a GitHub account for the initial handoff. Every successful `main` Quality Gate creates a **wendy-handoff** artifact containing:

- `wandered-found-preview.zip` — built, safe, noindex site for manual Netlify review
- `wandered-found-source.zip` — editable source code for ownership and backup

Chris can download those ZIPs and pass them to Wendy through OneDrive, Dropbox, Google Drive, USB, or another file-sharing method.

For the complete handoff and Netlify sequence, see **`WENDY_HANDOFF.md`**.

## Preview behavior

- No payment is collected.
- No customer information is submitted.
- Checkout buttons show a preview message.
- `/admin/` contains demo fulfillment data only.
- Search indexing is disabled by default for safe handoff/preview deployments.

## Netlify handoff

For Wendy's first visual review, unzip `wandered-found-preview.zip` and use Netlify's manual deploy / drag-and-drop flow.

If Wendy later adopts GitHub, `netlify.toml` defines the build command, `_site` publish directory, Node 22 runtime, and baseline security headers for connected automatic deploys.

The first deployment requires no environment variables and remains non-indexed. When the production domain is ready for public launch, follow `WENDY_HANDOFF.md` to enable public indexing deliberately.

## Before paid launch

1. Finalize price and shipping inputs.
2. Connect Stripe Checkout, Billing, Tax, and Customer Portal.
3. Add authenticated `/admin/` access and live fulfillment storage.
4. Replace demo admin rows with real records.
5. Finalize Privacy, Terms, and Shipping/Returns.
6. Connect and verify `wanderedandfound.org` in Wendy's hosting/DNS ownership.
7. Add any remaining Wendy artwork under `assets/images/` and update the relevant sections.
8. Run production checkout, webhook, mobile, accessibility, and fulfillment tests.
9. Enable public indexing only at the intended public launch.

See `PROJECT_SPEC.md` for the locked production requirements and data model.
