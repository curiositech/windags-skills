---
license: Apache-2.0
name: mobile-payment-integration-specialist
description: "Mobile payment integration for Stripe, Apple Pay, Google Pay, in-app purchases, and subscription management. Activate on: mobile payments, Stripe SDK, Apple Pay, Google Pay, in-app purchase, StoreKit 2, Google Play Billing, subscription management, payment sheet. NOT for: backend payment processing (use api-architect), general e-commerce (use frontend-architect), financial compliance (use security-auditor)."
allowed-tools: Read,Write,Edit,Bash(docker:*,kubectl:*,terraform:*,npm:*,npx:*)
category: Mobile Development
tags:
  - payments
  - stripe
  - in-app-purchase
  - mobile
pairs-with:
  - skill: react-native-architect
    reason: Payment integration is a common React Native feature requirement
  - skill: mobile-biometric-auth-expert
    reason: High-value payments should require biometric confirmation
---

# Mobile Payment Integration Specialist

Expert in integrating mobile payments including Stripe, Apple Pay, Google Pay, in-app purchases, and subscription lifecycle management.

## Activation Triggers

**Activate on:** "mobile payments", "Stripe SDK mobile", "Apple Pay integration", "Google Pay", "in-app purchase", "StoreKit 2", "Google Play Billing", "subscription management", "payment sheet", "RevenueCat"

**NOT for:** Backend payment processing → `api-architect` | General e-commerce → `frontend-architect` | Financial compliance → `security-auditor`

## Quick Start

1. **Choose payment model** — direct payments (Stripe) vs. in-app purchases (App Store/Play Store) based on product type
2. **Integrate payment SDK** — Stripe Mobile SDK, StoreKit 2, or Google Play Billing Library
3. **Implement server-side verification** — never trust client-side payment confirmations
4. **Handle subscription lifecycle** — trials, renewals, cancellations, grace periods, upgrades
5. **Add Apple Pay / Google Pay** — express checkout for returning customers

## Core Capabilities

| Domain | Technologies |
|--------|-------------|
| **Direct Payments** | Stripe Mobile SDK 23.x, Payment Sheet, Braintree |
| **iOS IAP** | StoreKit 2, App Store Server API, Server Notifications V2 |
| **Android IAP** | Google Play Billing 7.x, BillingClient, PurchaseFlow |
| **Subscriptions** | RevenueCat, Superwall, Qonversion, custom server logic |
| **Express Pay** | Apple Pay, Google Pay, Link (Stripe) |

## Architecture Patterns

### Payment Model Decision

```
What are you selling?
  │
  ├─ Digital content consumed IN the app (stickers, coins, premium features)
  │   └─ MUST use In-App Purchases (Apple/Google mandatory)
  │       ├─ Apple: StoreKit 2 + App Store Server API
  │       └─ Android: Google Play Billing Library
  │
  ├─ Physical goods or real-world services (food, rides, consulting)
  │   └─ CAN use direct payment (Stripe, Braintree)
  │       └─ No 30% commission
  │
  └─ Reader/media apps (Netflix, Kindle, Spotify)
      └─ CAN link to web for signup (US/EU/KR as of 2026)
          └─ External purchase entitlement via App Store Server API
```

### Stripe Payment Sheet (React Native)

```typescript
import { useStripe } from '@stripe/stripe-react-native';

function CheckoutScreen({ amount }: { amount: number }) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  async function checkout() {
    // 1. Create PaymentIntent on your server
    const { clientSecret, ephemeralKey, customerId } = await api.post(
      '/create-payment-intent',
      { amount, currency: 'usd' }
    );

    // 2. Initialize Payment Sheet
    const { error: initError } = await initPaymentSheet({
      merchantDisplayName: 'My Store',
      paymentIntentClientSecret: clientSecret,
      customerEphemeralKeySecret: ephemeralKey,
      customerId,
      applePay: { merchantCountryCode: 'US' },
      googlePay: { merchantCountryCode: 'US', testEnv: __DEV__ },
      defaultBillingDetails: { name: 'Jane Doe' },
    });

    if (initError) return handleError(initError);

    // 3. Present Payment Sheet
    const { error: payError } = await presentPaymentSheet();

    if (payError) {
      if (payError.code === 'Canceled') return; // User dismissed
      handleError(payError);
    } else {
      // Payment succeeded — server confirms via webhook
      navigation.navigate('OrderConfirmation');
    }
  }

  return <Button onPress={checkout} title={`Pay $${amount}`} />;
}
```

### StoreKit 2 Subscription Lifecycle

```swift
// Modern StoreKit 2 (async/await)
import StoreKit

class SubscriptionManager {
    func purchase(_ product: Product) async throws -> Transaction {
        let result = try await product.purchase()

        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await transaction.finish()
            // Notify server of purchase for server-side validation
            await api.verifyPurchase(transactionId: transaction.id)
            return transaction

        case .pending:
            throw SubscriptionError.pendingApproval // Ask-to-Buy

        case .userCancelled:
            throw SubscriptionError.cancelled

        @unknown default:
            throw SubscriptionError.unknown
        }
    }

    // Listen for subscription status changes
    func observeTransactionUpdates() async {
        for await result in Transaction.updates {
            guard let transaction = try? checkVerified(result) else { continue }
            await handleTransactionUpdate(transaction)
            await transaction.finish()
        }
    }
}
```

## Anti-Patterns

1. **Client-side payment verification** — trusting the mobile app's report that payment succeeded. Always verify on the server via Stripe webhooks or App Store Server Notifications.
2. **Using In-App Purchase for physical goods** — Apple and Google require IAP only for digital content consumed in-app. Physical goods, real-world services, and person-to-person payments should use Stripe/Braintree.
3. **Ignoring subscription grace period** — when a renewal fails, Apple/Google grant a grace period. If you revoke access immediately, users churn unnecessarily.
4. **Not handling pending transactions** — Ask-to-Buy (Family Sharing) results in pending state. Show a "pending approval" UI instead of failing.
5. **Hardcoded product IDs** — product IDs and pricing embedded in the app. Fetch products from the store at runtime so pricing and availability can change without app updates.

## Quality Checklist

```
[ ] Server-side payment verification via webhooks (never trust client)
[ ] Correct payment model chosen (IAP for digital, Stripe for physical)
[ ] Apple Pay and Google Pay configured as express checkout options
[ ] Subscription lifecycle handled: trial, renewal, cancellation, grace period
[ ] Pending transactions (Ask-to-Buy) handled gracefully
[ ] Product IDs fetched from store at runtime (not hardcoded)
[ ] Restore purchases implemented for app reinstalls
[ ] Receipt validation on server (App Store Server API / Google Developers API)
[ ] Refund handling via server notifications
[ ] Price displayed in user's local currency
[ ] Subscription management screen links to platform settings
[ ] PCI DSS compliance: no raw card data touches your servers (use Stripe tokenization)
```
