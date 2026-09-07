# Wandered & Found — visual review build

This repository is intentionally a dependency-free static site for Wendy's first visual review. It can be opened locally or uploaded directly to Netlify with no build tool.

## Preview behavior

- No payment is collected.
- No customer information is submitted.
- Checkout buttons show a preview message.
- `/admin/` contains demo fulfillment data only.
- Search indexing is disabled until launch.

## Netlify handoff

Upload the repository/site folder to Netlify or connect the GitHub repository. `netlify.toml` publishes the repository root and applies baseline security headers.

## Before launch

1. Replace price and shipping placeholders.
2. Connect Stripe Checkout, Billing, Tax, and Customer Portal.
3. Add authenticated `/admin/` access and live fulfillment storage.
4. Replace demo admin rows with real records.
5. Finalize Privacy, Terms, and Shipping/Returns.
6. Replace `noindex` metadata and add a production robots/sitemap policy.
7. Add Wendy's additional artwork under `assets/images/` and update the relevant sections.
8. Run production checkout, webhook, mobile, accessibility, and fulfillment tests.

See `PROJECT_SPEC.md` for the locked product requirements and data model.
