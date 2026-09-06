# Wandered & Found — Production Project Spec

## Product

**Brand:** Wandered & Found  
**Domain:** wanderedandfound.org  
**Primary product:** a physical monthly adventure-by-post package containing an adventure/story, original artwork, stickers, and found objects/keepsakes.  
**Visual source of truth:** Wendy's supplied website mockups and original artwork. These are the design specification, not loose inspiration.

## Definition of Done

V1 is complete only when a first-time visitor can:

1. Understand the product immediately on desktop and mobile.
2. See Wendy's supplied photography/artwork presented beautifully and responsively.
3. Understand what arrives each month and how the subscription works.
4. Purchase a monthly subscription and be charged immediately.
5. Purchase a one-time gift.
6. Purchase a gift subscription that renews until canceled.
7. Provide the correct recipient name and shipping address for gifts.
8. Pay securely through Stripe Checkout without card data ever passing through or being stored by our application.
9. Have applicable taxes calculated through Stripe Tax.
10. Receive purchase/subscription confirmation.
11. Manage or cancel an active subscription through Stripe Customer Portal.
12. Reach clear Privacy, Terms, Shipping/Returns, FAQ, About, Contact, and purchase information.
13. Use the site with strong mobile UX, accessibility, keyboard navigation, semantic markup, responsive images, and sensible reduced-motion behavior.
14. Receive clear success, cancellation, validation, payment-failure, and server-error states.

V1 is also complete only when Wendy can:

1. Sign into a private, invite-only admin area.
2. View current subscribers and gift orders.
3. See who needs the current month's package.
4. See recipient name, shipping address, order type, payment/subscription status, and fulfillment status.
5. Mark an edition/order as shipped.
6. View basic fulfillment history.
7. Use the admin area comfortably on desktop and mobile.
8. Replace/add product imagery later without redesigning the site architecture.
9. Receive a handoff-ready codebase with setup documentation, environment-variable documentation, deployment instructions, and operational notes.

## Commerce Rules

- Standard subscription: recurring monthly, charged immediately.
- Cancellation: allowed anytime through Stripe Customer Portal.
- One-time gift: supported at launch.
- Gift subscription: recurring monthly until canceled.
- Gift purchaser email is the billing/receipt email.
- Gift recipient name and shipping address are stored for fulfillment.
- Pricing: placeholder until finalized.
- Shipping pricing/coverage: placeholder until finalized.
- Capacity: no hard subscriber cap at launch.
- Marketing/newsletter signup: not included in V1; customer email collection is tied to paid purchases/subscriptions only.

## Data Ownership / Sources of Truth

- **Stripe** is authoritative for customers, payments, subscriptions, invoices, billing status, tax calculation, and recurring-payment lifecycle.
- **Application database** stores fulfillment-specific state and Stripe identifiers needed to reconcile data.
- The application must never store raw card details.

## Data Schema

### AdminUser

- id
- auth_provider_id
- email
- role (`admin`)
- created_at
- last_login_at

### CustomerProfile

- id
- stripe_customer_id (unique)
- email
- name
- created_at
- updated_at

### Recipient

- id
- customer_profile_id (nullable for gift recipient separation)
- name
- address_line_1
- address_line_2 (nullable)
- city
- state_region
- postal_code
- country
- created_at
- updated_at

### Purchase

Represents either a subscription purchase or one-time gift checkout.

- id
- stripe_checkout_session_id (unique)
- stripe_customer_id
- stripe_payment_intent_id (nullable for subscription-only flows)
- stripe_subscription_id (nullable for one-time purchases)
- purchase_type (`subscription`, `gift_once`, `gift_subscription`)
- purchaser_customer_profile_id
- recipient_id
- status
- currency
- subtotal_amount
- tax_amount
- shipping_amount
- total_amount
- created_at
- updated_at

### SubscriptionMirror

Local fulfillment-oriented mirror of Stripe subscription state.

- id
- stripe_subscription_id (unique)
- stripe_customer_id
- purchase_id
- status
- current_period_start
- current_period_end
- cancel_at_period_end
- canceled_at (nullable)
- updated_at

### Edition

Represents each monthly mailed release.

- id
- slug
- title
- release_month
- status (`draft`, `open`, `closed`, `archived`)
- created_at
- updated_at

### Fulfillment

- id
- edition_id
- purchase_id
- recipient_id
- fulfillment_type (`subscriber`, `gift_once`, `gift_subscription`)
- payment_eligible (boolean)
- status (`pending`, `ready`, `packed`, `shipped`, `held`, `canceled`)
- carrier (nullable)
- tracking_number (nullable)
- shipped_at (nullable)
- admin_notes (nullable)
- created_at
- updated_at

### StripeWebhookEvent

Provides idempotency and an audit trail for webhook processing.

- id
- stripe_event_id (unique)
- event_type
- processed_at
- processing_status
- error_message (nullable)

## Recommended Architecture

### Frontend

- Astro
- TypeScript
- Componentized layouts and content sections
- Responsive image pipeline using modern formats where appropriate
- Progressive enhancement; avoid client JavaScript unless interaction requires it

### Hosting / Runtime

- Netlify
- Netlify Functions for Stripe checkout creation, customer portal sessions, webhook handling, and protected admin APIs
- Netlify Database (managed Postgres) for fulfillment/admin data
- Netlify Identity configured invite-only for Wendy/admin access

### Payments

- Stripe Checkout
- Stripe Billing
- Stripe Customer Portal
- Stripe Tax
- Signed Stripe webhooks with idempotent event processing

## Security Requirements

- No Stripe secret keys or webhook secrets in source control.
- Secrets stored only in Netlify environment variables.
- Verify Stripe webhook signatures before processing.
- All admin APIs must verify authenticated admin identity server-side.
- Admin registration must be invite-only.
- Strict validation on all request payloads.
- CSRF-safe architecture for authenticated mutations.
- Rate limiting / abuse controls on public serverless endpoints where appropriate.
- Secure headers including CSP, HSTS after production HTTPS is stable, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, and clickjacking protection.
- No sensitive data in client-side logs or analytics.
- Meaningful server-side error logging without leaking secrets or personal information.

## Page / Route Architecture

Public:

- `/` — Home
- `/whats-inside` — What's Inside
- `/how-it-works` — How It Works
- `/about` — About Wendy / Wandered & Found story
- `/faq` — FAQ
- `/subscribe` — Standard subscription + gift options
- `/contact` — Contact
- `/privacy` — Privacy Policy
- `/terms` — Terms
- `/shipping-returns` — Shipping / Returns
- `/checkout/success` — Post-checkout success state
- `/checkout/cancelled` — Checkout cancellation state

Private:

- `/admin` — dashboard
- `/admin/fulfillment` — current edition fulfillment
- `/admin/orders` — purchase history
- `/admin/subscribers` — active subscription view
- `/admin/editions` — monthly edition management

## Visual Rules

- Wendy's supplied mockup is the primary design reference.
- Preserve the parchment, dark wood, postal correspondence, red stamp, typewriter, handwritten, exploration aesthetic.
- Use Wendy's original supplied artwork rather than regenerating replacements.
- Do not flatten the real site into one giant background image; build semantic responsive sections so content remains accessible, fast, editable, and mobile-friendly.
- New imagery must be replaceable through clear asset conventions/components without page rewrites.
- Desktop and mobile should feel intentionally composed, not merely scaled versions of one another.

## Delivery Phases

### Phase 1 — Foundation
- Project scaffolding
- TypeScript/configuration
- routing/layout system
- asset conventions
- environment schema
- Netlify configuration
- test/lint/typecheck baseline

### Phase 2 — Visual Build
- Header/navigation
- hero
- monthly contents section
- CTA/purchase section
- responsive mobile menu
- supporting pages
- accessibility and performance passes

### Phase 3 — Commerce
- Stripe products/prices via environment-configured IDs
- standard subscription checkout
- one-time gift checkout
- recurring gift checkout
- Stripe Tax
- customer portal
- webhooks

### Phase 4 — Admin / Fulfillment
- invite-only admin authentication
- protected admin APIs
- database migrations
- edition and fulfillment views
- shipped-state workflow

### Phase 5 — Production Certification
- unit/integration tests
- webhook regression tests
- checkout success/cancel/failure paths
- responsive QA
- accessibility QA
- security headers
- SEO/OpenGraph/schema metadata
- image optimization
- production smoke test
- handoff documentation

## Deployment Discipline

- Do not connect the site to production Netlify until the local/static foundation is substantially ready.
- Avoid unnecessary production deploys and credit consumption.
- Use local tests and deploy previews deliberately.
- Production deploys should happen only at meaningful, high-confidence checkpoints.
