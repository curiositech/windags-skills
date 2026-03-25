---
license: Apache-2.0
name: webapp-paywall-implementation
description: Implement paywalls, subscription billing, and feature gating in web applications. Covers Stripe/Lemon Squeezy/Paddle integration, subscription lifecycle management, React/Next.js gating patterns, webhook handling, and pricing page design. Activate on 'paywall', 'subscription', 'billing', 'Stripe integration', 'feature gating', 'pricing tier', 'payment', 'monetize', 'charge users', 'Stripe Checkout', 'webhook handler', 'subscription state'. NOT for pricing strategy decisions (use indie-monetization-strategist), not for payment UI design only (use web-design-expert), not for in-app mobile purchases (App Store/Play Store rules are a different beast).
allowed-tools: Read,Write,Edit,Bash,Glob,Grep,WebSearch,WebFetch
metadata:
  category: Monetization & Infrastructure
  tags:
    - paywall
    - stripe
    - subscription
    - billing
    - monetization
    - feature-gating
    - saas
    - webhook
    - checkout
    - lemon-squeezy
    - paddle
  pairs-with:
    - skill: indie-monetization-strategist
      reason: Pricing strategy decisions that inform what to gate and how
    - skill: nextjs-app-router-expert
      reason: Implementation patterns for Next.js App Router middleware and server-side gating
    - skill: supabase-admin
      reason: RLS policies for plan-gated database access
    - skill: modern-auth-2026
      reason: Auth state carries subscription tier for gating decisions
    - skill: oauth-oidc-implementer
      reason: Identity layer that the paywall sits on top of
category: Backend & Infrastructure
tags:
  - paywall
  - payments
  - stripe
  - subscription
  - authentication
---

# Web App Paywall Implementation

Full-stack guide to putting a paywall around your web app -- from choosing a payment provider to handling failed payments at 3 AM. This is the implementation skill: it assumes you have already decided *what* to charge for (if not, start with **indie-monetization-strategist**) and focuses on *how* to build it correctly.

## When to Use

**Use for:**
- Integrating Stripe Checkout, Lemon Squeezy, or Paddle into a web app
- Building subscription lifecycle management (create, upgrade, downgrade, cancel, resume)
- Implementing feature gating in React/Next.js (middleware, server-side, client-side)
- Designing the database schema for subscription state
- Handling webhooks reliably (signature verification, idempotency, race conditions)
- Building pricing pages, upgrade flows, and customer portal redirects
- Managing edge cases: failed payments, grace periods, refunds, proration

**Do NOT use for:**
- Pricing strategy and what to charge --> use **indie-monetization-strategist**
- Payment page visual design only --> use **web-design-expert**
- In-app mobile purchases (iOS/Android) --> App Store rules are a separate domain
- Auth implementation --> use **modern-auth-2026** (this skill assumes auth exists)
- Database RLS policies --> use **supabase-admin** (this skill provides the schema, not the policies)

---

## Payment Provider Decision Tree

```
What are you building?
│
├── SaaS with recurring subscriptions?
│   ├── Want full control + lowest fees? ──────────> STRIPE
│   ├── Don't want to handle tax/VAT? ────────────> PADDLE or LEMON SQUEEZY
│   └── Need usage-based billing? ─────────────────> STRIPE (metered billing)
│
├── Digital product (one-time purchase)?
│   ├── Developer tool / code? ────────────────────> LEMON SQUEEZY
│   ├── Want your own checkout page? ──────────────> STRIPE
│   └── Want zero setup, hosted storefront? ───────> GUMROAD
│
├── Marketplace / platform with payouts?
│   └── ─────────────────────────────────────────> STRIPE CONNECT
│
└── Selling to enterprises (invoices, POs)?
    └── ─────────────────────────────────────────> STRIPE INVOICING
```

### Provider Comparison (2025-2026)

| Feature | Stripe | Paddle | Lemon Squeezy | Gumroad |
|---------|--------|--------|---------------|---------|
| **Transaction fee** | 2.9% + 30c | 5% + 50c | 5% + 50c | 10% flat |
| **Merchant of Record** | No (you handle tax) | Yes | Yes | Yes |
| **Tax/VAT handling** | Stripe Tax add-on (+0.5%) | Included | Included | Included |
| **Subscription billing** | Full control | Full control | Good | Basic |
| **Usage-based billing** | Native metered billing | Limited | No | No |
| **Developer experience** | Best-in-class API | Good API | Good API | Minimal API |
| **Checkout customization** | Full (embedded or hosted) | Overlay widget | Overlay widget | Hosted only |
| **Customer portal** | Built-in | Built-in | Built-in | N/A |
| **Webhook reliability** | 72hr retry, signatures | Good | Good | Basic |
| **Payout schedule** | 2-day rolling | Monthly | Monthly | Weekly |
| **Best for** | Full control, scale | Global SaaS, EU-heavy | Indie devs, digital | Simple digital sales |

**Key insight on Merchant of Record (MoR):** When Paddle or Lemon Squeezy is MoR, *they* are the legal seller -- they handle VAT registration, collection, and remittance in 100+ countries. With Stripe, *you* are the seller and must handle this yourself (or add Stripe Tax). For a solo dev selling globally, MoR saves hundreds of hours of tax compliance. For a funded startup wanting full control, Stripe + Stripe Tax is the move.

**Lemon Squeezy note (2025):** Acquired by Stripe. Still operates independently but long-term strategy is unclear. Fee structures can climb to 10-18% with add-ons beyond the advertised 5% + 50c base.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      YOUR WEB APP                           │
│                                                             │
│  ┌──────────┐    ┌──────────────┐    ┌──────────────────┐  │
│  │ Pricing  │───>│ Checkout     │───>│ Success/Cancel   │  │
│  │ Page     │    │ (Stripe)     │    │ Redirect         │  │
│  └──────────┘    └──────────────┘    └──────────────────┘  │
│                         │                                   │
│                         │ (redirect)                        │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Stripe Hosted Checkout                   │  │
│  │  (payment form, tax calc, 3DS, Apple/Google Pay)     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         │ (webhook)                         │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Webhook Handler                          │  │
│  │  POST /api/webhooks/stripe                           │  │
│  │  1. Verify signature                                 │  │
│  │  2. Check idempotency                                │  │
│  │  3. Update subscription state in DB                  │  │
│  │  4. Return 200 immediately                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Database (subscription state)            │  │
│  │  users.stripe_customer_id                            │  │
│  │  subscriptions.{status, plan, period_end, ...}       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Feature Gating Layer                     │  │
│  │  Middleware → Server Components → Client Guards       │  │
│  │  "Can this user access this feature?"                │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Critical rule:** Never fulfill access based on the Checkout success redirect URL alone. The redirect can fail, the user can close the tab, or someone can forge the URL. Always use webhooks for fulfillment.

---

## Database Schema for Subscription State

This schema works with Supabase/Postgres. Adapt for your database.

```sql
-- Extend your existing users/profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id text UNIQUE;

-- Core subscription table
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE NOT NULL,
  stripe_price_id text NOT NULL,
  plan_id text NOT NULL,                    -- e.g., 'pro', 'team', 'enterprise'
  status text NOT NULL DEFAULT 'incomplete', -- mirrors Stripe status
  quantity integer DEFAULT 1,
  current_period_start timestamptz NOT NULL,
  current_period_end timestamptz NOT NULL,
  cancel_at_period_end boolean DEFAULT false,
  canceled_at timestamptz,
  ended_at timestamptz,
  trial_start timestamptz,
  trial_end timestamptz,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Webhook event log (for idempotency)
CREATE TABLE stripe_webhook_events (
  id text PRIMARY KEY,                      -- Stripe event ID (evt_xxx)
  type text NOT NULL,                       -- e.g., 'checkout.session.completed'
  processed_at timestamptz DEFAULT now(),
  payload jsonb
);

-- Usage tracking (for metered/usage-based billing)
CREATE TABLE usage_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  feature text NOT NULL,                    -- e.g., 'api_calls', 'storage_mb'
  quantity integer NOT NULL DEFAULT 1,
  recorded_at timestamptz DEFAULT now()
);

CREATE INDEX idx_usage_user_feature ON usage_records(user_id, feature, recorded_at);

-- Plan definitions (optional -- can also live in code)
CREATE TABLE plans (
  id text PRIMARY KEY,                      -- 'free', 'pro', 'team'
  name text NOT NULL,
  stripe_price_id_monthly text,
  stripe_price_id_annual text,
  features jsonb NOT NULL DEFAULT '{}',     -- {"api_calls": 1000, "storage_mb": 5120}
  sort_order integer DEFAULT 0,
  is_active boolean DEFAULT true
);

-- Seed your plans
INSERT INTO plans (id, name, stripe_price_id_monthly, stripe_price_id_annual, features, sort_order) VALUES
  ('free', 'Free', NULL, NULL, '{"api_calls": 100, "storage_mb": 512, "projects": 3}', 0),
  ('pro', 'Pro', 'price_monthly_pro_xxx', 'price_annual_pro_xxx', '{"api_calls": 10000, "storage_mb": 51200, "projects": -1}', 1),
  ('team', 'Team', 'price_monthly_team_xxx', 'price_annual_team_xxx', '{"api_calls": 100000, "storage_mb": 512000, "projects": -1, "seats": 10}', 2);
```

**Valid subscription statuses** (mirrors Stripe):
- `incomplete` -- initial payment pending
- `incomplete_expired` -- initial payment failed after 23 hours
- `trialing` -- in free trial period
- `active` -- paid and current
- `past_due` -- payment failed, retrying
- `canceled` -- canceled but may still have access until period end
- `unpaid` -- all retry attempts exhausted
- `paused` -- manually paused (Stripe Billing feature)

---

## Stripe Integration: Step by Step

### 1. Install and Configure

```bash
npm install stripe @stripe/stripe-js
```

```typescript
// lib/stripe/server.ts -- Server-side Stripe client
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-18.acacia', // Pin your API version
  typescript: true,
});
```

```typescript
// lib/stripe/client.ts -- Client-side Stripe.js (for redirects)
import { loadStripe } from '@stripe/stripe-js';

let stripePromise: ReturnType<typeof loadStripe>;

export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
}
```

### 2. Create Checkout Session (Server Action)

```typescript
// app/actions/checkout.ts
'use server';

import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(priceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get or create Stripe customer
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  let customerId = profile?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customerId })
      .eq('id', user.id);
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
    subscription_data: {
      metadata: { supabase_user_id: user.id },
    },
    allow_promotion_codes: true,
    billing_address_collection: 'required',
    tax_id_collection: { enabled: true },
    // Uncomment for free trial:
    // subscription_data: {
    //   trial_period_days: 14,
    //   trial_settings: {
    //     end_behavior: { missing_payment_method: 'cancel' },
    //   },
    // },
  });

  if (!session.url) {
    throw new Error('Failed to create checkout session');
  }

  redirect(session.url);
}
```

### 3. Webhook Handler (The Critical Path)

```typescript
// app/api/webhooks/stripe/route.ts
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe/server';
import { createClient } from '@supabase/supabase-js';
import type Stripe from 'stripe';

// Use service role -- webhooks are server-to-server, no user context
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// Events you MUST handle for subscriptions
const RELEVANT_EVENTS = new Set([
  'checkout.session.completed',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'invoice.payment_succeeded',
  'invoice.payment_failed',
  'customer.subscription.trial_will_end',
]);

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return new Response('Missing stripe-signature header', { status: 400 });
  }

  // 1. VERIFY SIGNATURE -- non-negotiable
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  // 2. IDEMPOTENCY CHECK -- prevent double processing
  const { data: existing } = await supabase
    .from('stripe_webhook_events')
    .select('id')
    .eq('id', event.id)
    .single();

  if (existing) {
    // Already processed -- return 200 so Stripe stops retrying
    return new Response('Already processed', { status: 200 });
  }

  // 3. PROCESS THE EVENT
  if (RELEVANT_EVENTS.has(event.type)) {
    try {
      await handleWebhookEvent(event);

      // Record successful processing
      await supabase.from('stripe_webhook_events').insert({
        id: event.id,
        type: event.type,
        payload: event.data.object,
      });
    } catch (err) {
      console.error(`Error processing ${event.type}:`, err);
      // Return 500 so Stripe retries
      return new Response('Processing error', { status: 500 });
    }
  }

  // 4. RETURN 200 QUICKLY -- Stripe expects response within 20 seconds
  return new Response('OK', { status: 200 });
}

async function handleWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.mode === 'subscription' && session.subscription) {
        // Fetch the full subscription object
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string,
        );
        await upsertSubscription(subscription);
      }
      break;
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      await upsertSubscription(subscription);
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase
        .from('subscriptions')
        .update({
          status: 'canceled',
          ended_at: new Date(subscription.ended_at! * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscription.id);
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        await supabase
          .from('subscriptions')
          .update({
            status: 'past_due',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_subscription_id', invoice.subscription as string);
        // TODO: Send email to user about failed payment
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.subscription) {
        // Payment recovered -- reactivate
        const subscription = await stripe.subscriptions.retrieve(
          invoice.subscription as string,
        );
        await upsertSubscription(subscription);
      }
      break;
    }

    case 'customer.subscription.trial_will_end': {
      const subscription = event.data.object as Stripe.Subscription;
      // TODO: Send email warning trial ends in 3 days
      console.log(`Trial ending for subscription ${subscription.id}`);
      break;
    }
  }
}

async function upsertSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.supabase_user_id;
  if (!userId) {
    // Fall back to looking up by customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', subscription.customer as string)
      .single();

    if (!profile) {
      throw new Error(`No user found for customer ${subscription.customer}`);
    }
  }

  const priceId = subscription.items.data[0]?.price.id;

  // Look up plan by price ID
  const { data: plan } = await supabase
    .from('plans')
    .select('id')
    .or(`stripe_price_id_monthly.eq.${priceId},stripe_price_id_annual.eq.${priceId}`)
    .single();

  await supabase.from('subscriptions').upsert(
    {
      user_id: userId || (await getUserIdByCustomer(subscription.customer as string)),
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      plan_id: plan?.id || 'unknown',
      status: subscription.status,
      quantity: subscription.items.data[0]?.quantity || 1,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      canceled_at: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000).toISOString()
        : null,
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' },
  );
}

async function getUserIdByCustomer(customerId: string): Promise<string> {
  const { data } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!data) throw new Error(`No user for customer ${customerId}`);
  return data.id;
}
```

### 4. Customer Portal (Manage Subscription)

```typescript
// app/actions/billing.ts
'use server';

import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function createPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    redirect('/pricing');
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: profile.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  redirect(session.url);
}
```

---

## Feature Gating: Three Layers

Feature gating must happen at multiple layers. Never rely on a single layer.

```
Layer 1: Middleware (route-level)     -- "Can they even see this page?"
Layer 2: Server Components (data)    -- "Can they access this data?"
Layer 3: Client Components (UI)      -- "Should we show this button?"
```

### Layer 1: Next.js Middleware (Route Gating)

```typescript
// middleware.ts
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

// Routes that require a paid plan
const PAID_ROUTES = ['/dashboard/analytics', '/dashboard/exports', '/api/v1'];
const PRO_ROUTES = ['/dashboard/analytics'];
const TEAM_ROUTES = ['/dashboard/team-settings'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)),
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in? Redirect to login
  if (!user && isPaidRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (user && isPaidRoute(request.nextUrl.pathname)) {
    // Check subscription -- use a lightweight query
    const { data: sub } = await supabase
      .from('subscriptions')
      .select('plan_id, status')
      .eq('user_id', user.id)
      .in('status', ['active', 'trialing'])
      .single();

    const plan = sub?.plan_id || 'free';

    if (isProRoute(request.nextUrl.pathname) && plan === 'free') {
      return NextResponse.redirect(new URL('/pricing?upgrade=pro', request.url));
    }

    if (isTeamRoute(request.nextUrl.pathname) && plan !== 'team') {
      return NextResponse.redirect(new URL('/pricing?upgrade=team', request.url));
    }
  }

  return response;
}

function isPaidRoute(path: string) {
  return PAID_ROUTES.some(route => path.startsWith(route));
}
function isProRoute(path: string) {
  return PRO_ROUTES.some(route => path.startsWith(route));
}
function isTeamRoute(path: string) {
  return TEAM_ROUTES.some(route => path.startsWith(route));
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/v1/:path*'],
};
```

**Security note (CVE-2025-29927):** Next.js middleware had a critical authorization bypass vulnerability in 2025. Never rely *solely* on middleware for access control. Always verify at the data layer too.

### Layer 2: Server-Side Data Gating

```typescript
// lib/subscriptions/gate.ts
import { createClient } from '@/lib/supabase/server';

export type PlanId = 'free' | 'pro' | 'team' | 'enterprise';

interface SubscriptionInfo {
  plan: PlanId;
  status: string;
  isActive: boolean;
  periodEnd: Date | null;
  isTrial: boolean;
  features: Record<string, number>;
}

export async function getSubscription(): Promise<SubscriptionInfo> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return {
      plan: 'free',
      status: 'none',
      isActive: false,
      periodEnd: null,
      isTrial: false,
      features: { api_calls: 100, storage_mb: 512, projects: 3 },
    };
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_id, status, current_period_end, trial_end, plans(features)')
    .eq('user_id', user.id)
    .in('status', ['active', 'trialing', 'past_due'])
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sub) {
    return {
      plan: 'free',
      status: 'none',
      isActive: true, // Free tier is always "active"
      periodEnd: null,
      isTrial: false,
      features: { api_calls: 100, storage_mb: 512, projects: 3 },
    };
  }

  const isActive = ['active', 'trialing'].includes(sub.status);
  // Grace period: treat past_due as active for up to 7 days
  const isPastDueGrace = sub.status === 'past_due' &&
    new Date(sub.current_period_end) > new Date();

  return {
    plan: sub.plan_id as PlanId,
    status: sub.status,
    isActive: isActive || isPastDueGrace,
    periodEnd: sub.current_period_end ? new Date(sub.current_period_end) : null,
    isTrial: sub.status === 'trialing',
    features: (sub.plans as any)?.features || {},
  };
}

// Use in Server Components:
export async function requirePlan(minimumPlan: PlanId) {
  const sub = await getSubscription();
  const planHierarchy: Record<PlanId, number> = {
    free: 0,
    pro: 1,
    team: 2,
    enterprise: 3,
  };

  if (planHierarchy[sub.plan] < planHierarchy[minimumPlan]) {
    throw new Error(`Requires ${minimumPlan} plan`);
  }

  return sub;
}

// Check specific feature limits
export async function checkFeatureLimit(
  feature: string,
  requested: number = 1,
): Promise<{ allowed: boolean; current: number; limit: number }> {
  const sub = await getSubscription();
  const limit = sub.features[feature] ?? 0;

  // -1 means unlimited
  if (limit === -1) {
    return { allowed: true, current: 0, limit: -1 };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Count current usage this billing period
  const { count } = await supabase
    .from('usage_records')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user!.id)
    .eq('feature', feature)
    .gte('recorded_at', sub.periodEnd
      ? new Date(sub.periodEnd.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString()
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

  const current = count || 0;
  return {
    allowed: current + requested <= limit,
    current,
    limit,
  };
}
```

```typescript
// Example: Server Component with plan gating
// app/dashboard/analytics/page.tsx
import { requirePlan } from '@/lib/subscriptions/gate';
import { redirect } from 'next/navigation';

export default async function AnalyticsPage() {
  try {
    const sub = await requirePlan('pro');
    // User has pro or higher -- render the page
    return <AnalyticsDashboard subscription={sub} />;
  } catch {
    redirect('/pricing?upgrade=pro&reason=analytics');
  }
}
```

### Layer 3: Client-Side UI Guards

```typescript
// components/FeatureGate.tsx
'use client';

import { useSubscription } from '@/hooks/useSubscription';
import type { PlanId } from '@/lib/subscriptions/gate';

interface FeatureGateProps {
  requiredPlan: PlanId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ requiredPlan, children, fallback }: FeatureGateProps) {
  const { plan, isActive } = useSubscription();
  const planHierarchy: Record<PlanId, number> = {
    free: 0, pro: 1, team: 2, enterprise: 3,
  };

  if (!isActive || planHierarchy[plan] < planHierarchy[requiredPlan]) {
    return fallback ?? (
      <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
        <p className="text-sm text-gray-500">
          This feature requires the {requiredPlan} plan.
        </p>
        <a
          href={`/pricing?upgrade=${requiredPlan}`}
          className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
        >
          Upgrade to {requiredPlan}
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

// Usage:
// <FeatureGate requiredPlan="pro">
//   <AdvancedAnalytics />
// </FeatureGate>
```

**Important:** Client-side guards are for UX only -- they hide UI elements but do not enforce access. A determined user can bypass client-side checks. The server-side data layer (Layer 2) is the real enforcement boundary.

---

## Subscription State Machine

```
                           ┌───────────────────────────────┐
                           │         INCOMPLETE             │
                           │  (initial payment pending)     │
                           └──────────┬────────────────────┘
                                      │
                          ┌───────────┴───────────┐
                          ▼                       ▼
                ┌──────────────────┐    ┌─────────────────────┐
                │    TRIALING      │    │ INCOMPLETE_EXPIRED   │
                │  (free trial)    │    │ (payment failed)     │
                └────────┬─────────┘    └─────────────────────┘
                         │
                         ▼
                ┌──────────────────┐
                │     ACTIVE       │◄─────────── payment recovered
                │  (paid, current) │
                └───┬──────┬───────┘
                    │      │
          payment   │      │ user cancels
          fails     │      │
                    ▼      ▼
          ┌─────────────┐  ┌──────────────────────────────┐
          │  PAST_DUE   │  │  CANCELED                    │
          │  (retrying) │  │  (cancel_at_period_end=true) │
          └──────┬──────┘  │  Still active until period   │
                 │         │  end, then access revoked     │
        retries  │         └──────────────────────────────┘
        exhaust  │
                 ▼
          ┌─────────────┐
          │   UNPAID     │
          │  (dead)      │──────── revoke access immediately
          └─────────────┘

  Upgrade:   ACTIVE(free) ──> checkout ──> ACTIVE(pro)
  Downgrade: ACTIVE(pro)  ──> portal   ──> ACTIVE(free) at period end
  Resume:    CANCELED     ──> if before period_end, can resume
```

### Handling Upgrades and Downgrades

```typescript
// app/actions/subscription.ts
'use server';

import { stripe } from '@/lib/stripe/server';
import { createClient } from '@/lib/supabase/server';

// Upgrade: immediate, prorated
export async function upgradeSubscription(newPriceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .single();

  if (!sub) throw new Error('No active subscription');

  const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);

  // Prorate: charge difference immediately
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'always_invoice', // Charge difference now
  });
}

// Downgrade: at period end, no proration
export async function downgradeSubscription(newPriceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .single();

  if (!sub) throw new Error('No active subscription');

  const subscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id);

  // Schedule downgrade at period end
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    items: [{
      id: subscription.items.data[0].id,
      price: newPriceId,
    }],
    proration_behavior: 'none', // No refund, change at period end
    // Stripe applies the new price at next billing cycle
  });
}

// Cancel: access until period end
export async function cancelSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user!.id)
    .in('status', ['active', 'trialing'])
    .single();

  if (!sub) throw new Error('No active subscription');

  // Cancel at period end -- user keeps access until then
  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: true,
  });
}

// Resume: undo a pending cancellation
export async function resumeSubscription() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_subscription_id')
    .eq('user_id', user!.id)
    .eq('cancel_at_period_end', true)
    .single();

  if (!sub) throw new Error('No subscription to resume');

  await stripe.subscriptions.update(sub.stripe_subscription_id, {
    cancel_at_period_end: false,
  });
}
```

---

## Webhook Best Practices (The Hard-Won List)

### 1. Always Verify Signatures

```typescript
// NEVER skip this. Anyone can POST to your webhook URL.
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

Stripe signs every webhook with your endpoint secret. The signature includes a timestamp -- verification will fail if the payload is older than 5 minutes (replay attack protection).

### 2. Idempotency is Non-Negotiable

Stripe retries failed webhooks for up to 72 hours with exponential backoff. Your handler WILL receive duplicate events. Use the `stripe_webhook_events` table from the schema above to deduplicate.

```typescript
// Check BEFORE processing
const { data: existing } = await supabase
  .from('stripe_webhook_events')
  .select('id')
  .eq('id', event.id)
  .single();

if (existing) return new Response('OK', { status: 200 });
```

### 3. Return 200 Within 20 Seconds

Stripe expects a 200 response fast. If your processing takes longer, acknowledge receipt and process asynchronously:

```typescript
// For heavy processing, use a queue
export async function POST(request: Request) {
  // ... verify signature ...

  // Acknowledge immediately
  await enqueueWebhookJob(event); // Redis, SQS, Inngest, etc.
  return new Response('OK', { status: 200 });
}
```

### 4. Handle Event Ordering

Stripe does not guarantee event delivery order. You may receive `invoice.payment_succeeded` before `customer.subscription.created`. Design your handlers to be order-independent:

```typescript
// Use upsert, not insert-only
await supabase.from('subscriptions').upsert(
  { stripe_subscription_id: sub.id, ...data },
  { onConflict: 'stripe_subscription_id' },
);
```

### 5. Serialize Per-Customer Processing

If you process webhooks in parallel (multiple serverless function instances), two events for the same customer can race:

```typescript
// Option A: Use a database advisory lock
await supabase.rpc('pg_advisory_xact_lock', {
  lock_key: hashCode(customerId),
});

// Option B: Use a Redis lock
const lock = await redis.set(`webhook:${customerId}`, '1', 'NX', 'EX', 30);
if (!lock) {
  // Another handler is processing this customer -- retry later
  return new Response('Retry', { status: 503 });
}
```

### 6. Test with Stripe CLI

```bash
# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger specific events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

---

## Environment Variables

```env
# Stripe (required)
STRIPE_SECRET_KEY=sk_live_xxx           # sk_test_xxx for development
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxx  # pk_test_xxx for dev
STRIPE_WEBHOOK_SECRET=whsec_xxx         # From Stripe Dashboard or CLI

# Stripe Price IDs (from your Stripe Dashboard > Products)
STRIPE_PRICE_PRO_MONTHLY=price_xxx
STRIPE_PRICE_PRO_ANNUAL=price_xxx
STRIPE_PRICE_TEAM_MONTHLY=price_xxx
STRIPE_PRICE_TEAM_ANNUAL=price_xxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Never commit Stripe keys.** Add to `.env.local` only. Use `sk_test_` keys in development, `sk_live_` in production.

---

## The Psychology of the Paywall Moment

The moment a user hits the paywall is the most sensitive UX moment in your app. Get it wrong and they leave. Get it right and they convert.

**Principles:**

1. **Show value before the wall.** The user should have already experienced enough of your product to understand what they are paying for. A paywall on first visit converts poorly.

2. **Be specific about what they unlock.** "Upgrade to Pro" is worse than "Unlock unlimited API calls and priority support."

3. **Offer a clear path back.** The paywall should not feel like a dead end. Show what they CAN do on free, and what upgrades unlock.

4. **Use soft walls, not hard walls.** Instead of blocking entirely, show a preview with a blur/overlay: "You have 2 of 5 free reports remaining. Upgrade for unlimited."

5. **Reduce friction at the moment of decision.** The path from "I want to upgrade" to "I am upgraded" should be 2 clicks maximum: choose plan -> enter payment -> done.

6. **Handle the "I just paid but nothing changed" gap.** The time between Checkout completion and webhook processing can be 1-30 seconds. Show an optimistic UI:

```typescript
// On Checkout success redirect, poll for subscription activation
function useCheckoutSuccess(sessionId: string) {
  const [status, setStatus] = useState<'loading' | 'active' | 'timeout'>('loading');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;

    const poll = setInterval(async () => {
      attempts++;
      const res = await fetch(`/api/subscription/status`);
      const data = await res.json();

      if (data.status === 'active' || data.status === 'trialing') {
        setStatus('active');
        clearInterval(poll);
      } else if (attempts >= maxAttempts) {
        setStatus('timeout');
        clearInterval(poll);
      }
    }, 2000);

    return () => clearInterval(poll);
  }, [sessionId]);

  return status;
}
```

---

## Anti-Patterns

### 1. Scattering Stripe Checks Everywhere

**Wrong:**
```typescript
// In every component:
if (user.stripe_subscription_status === 'active') { ... }
```

**Right:** Centralize in `getSubscription()` and `requirePlan()`. Components ask "does the user have access to X?" -- they never touch Stripe directly.

### 2. Trusting the Checkout Success URL

**Wrong:** Granting access when the user lands on `/success?session_id=xxx`.

**Right:** Only grant access when the `checkout.session.completed` webhook fires and you have verified the payment.

### 3. Storing Prices in Your Database

**Wrong:** Hardcoding `$29/month` in your database or frontend.

**Right:** Fetch prices from Stripe at render time (with caching). Prices change. Stripe is the source of truth.

### 4. Not Handling `past_due` Gracefully

**Wrong:** Immediately revoking access when a payment fails.

**Right:** Implement a grace period. Stripe retries failed payments up to 4 times over ~3 weeks. During this time, keep access active but notify the user.

### 5. Ignoring Subscription Quantity

**Wrong:** Treating all subscriptions as single-seat.

**Right:** For team plans, track `quantity` and enforce seat limits. Update quantity via the Stripe API when team members are added/removed.

### 6. Building Your Own Billing Portal

**Wrong:** Spending weeks building update-payment, view-invoices, cancel-subscription UI.

**Right:** Use Stripe's Customer Portal. It handles all of this, is PCI-compliant, and updates automatically when Stripe adds features. One redirect, zero maintenance.

### 7. Not Testing Webhook Failure Scenarios

**Wrong:** Only testing the happy path (successful payment).

**Right:** Test these with `stripe trigger`:
- `invoice.payment_failed` -- what happens when payment fails?
- `customer.subscription.deleted` -- what happens when sub is canceled externally?
- Duplicate events (send the same event twice) -- does your idempotency work?
- Out-of-order events -- does your handler cope?

### 8. Blocking the Webhook Response

**Wrong:** Doing heavy processing (sending emails, updating analytics, notifying Slack) synchronously in the webhook handler.

**Right:** Acknowledge the webhook, then process asynchronously. Stripe times out after 20 seconds.

---

## Free Tier vs. Trial vs. Freemium

These are different strategies. Choose one.

| Model | How It Works | Best For |
|-------|-------------|----------|
| **Free tier** | Permanently free with limits (100 API calls/mo) | Products with clear usage metrics |
| **Free trial** | Full access for N days, then must pay | Products where value takes time to discover |
| **Freemium** | Core free forever, premium features paid | Products where core is useful alone |
| **Reverse trial** | Full access for N days, then drops to free tier | Best of both: users see full value, keep free |

**Recommendation for most SaaS:** Reverse trial (14 days of Pro, then drop to Free tier). Users experience the best version of your product, and the free tier keeps them engaged even if they don't convert immediately.

```typescript
// Implementing a reverse trial
const session = await stripe.checkout.sessions.create({
  mode: 'subscription',
  line_items: [{ price: priceId, quantity: 1 }],
  subscription_data: {
    trial_period_days: 14,
    trial_settings: {
      end_behavior: {
        missing_payment_method: 'cancel', // Drop to free tier, don't block
      },
    },
  },
  // No payment method required during trial
  payment_method_collection: 'if_required',
  // ...
});
```

---

## JWT Claims for Plan Tiers

If your architecture uses JWTs for session management, embed the plan tier as a claim to avoid database lookups on every request:

```typescript
// In your Supabase custom claims hook (or auth middleware)
// supabase/functions/custom-claims/index.ts
import { serve } from 'https://deno.land/std/http/server.ts';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const { user_id } = await req.json();

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_id, status')
    .eq('user_id', user_id)
    .in('status', ['active', 'trialing'])
    .single();

  return new Response(JSON.stringify({
    app_metadata: {
      plan: sub?.plan_id || 'free',
      subscription_status: sub?.status || 'none',
    },
  }));
});
```

**Caveat:** JWT claims are only refreshed when the token is refreshed (typically every hour with Supabase). After an upgrade, either force a token refresh or use a database check for immediate enforcement:

```typescript
// Force token refresh after upgrade
await supabase.auth.refreshSession();
```

---

## Quality Checklist

Before shipping your paywall:

- [ ] **Webhook signature verification** is implemented and tested
- [ ] **Idempotency** -- duplicate webhook events do not cause double charges or state corruption
- [ ] **All subscription statuses handled** -- not just `active` but also `past_due`, `canceled`, `trialing`, `unpaid`
- [ ] **Grace period** for failed payments (do not immediately revoke access)
- [ ] **Cancel flow** preserves access until period end (not immediate revocation)
- [ ] **Upgrade is immediate** with proration; downgrade takes effect at period end
- [ ] **Success redirect** does not grant access -- only webhooks do
- [ ] **Stripe CLI tested** with `stripe listen` and `stripe trigger` for all relevant events
- [ ] **Environment variables** are not committed; `.env.local` is in `.gitignore`
- [ ] **Feature gating works at server level** -- client-side gates are UX only
- [ ] **Customer Portal** is wired up for self-service billing management
- [ ] **Error states** have user-facing messages (payment failed, card expired, subscription lapsed)
- [ ] **Pricing page** shows accurate prices (fetched from Stripe, not hardcoded)
- [ ] **Loading state** between Checkout completion and webhook processing is handled (polling or optimistic UI)
- [ ] **Test mode** uses `sk_test_` / `pk_test_` keys; production uses `sk_live_` / `pk_live_`
- [ ] **Webhook endpoint** is registered in Stripe Dashboard for production AND testing
- [ ] **Rate limiting** on checkout session creation to prevent abuse
- [ ] **No PCI-sensitive data** (card numbers, CVVs) touches your server

---

**Covers:** Stripe Integration | Subscription Billing | Feature Gating | Webhook Handling | Pricing Architecture

**Use with:** indie-monetization-strategist (strategy) | nextjs-app-router-expert (routing) | supabase-admin (RLS) | modern-auth-2026 (auth layer)
