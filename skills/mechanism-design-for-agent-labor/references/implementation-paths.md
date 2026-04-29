# Implementation Paths

Use this reference when the mechanism is already defined and the next question is how to settle or escrow it in production.

## Path 1: Stripe Integration (Fiat)

```text
Bond posting: Stripe PaymentIntent with capture_method='manual'
Escrow: Stripe Connect destination charges
Settlement: capture on failure or cancel on success, then transfer payment
Dispute: Stripe disputes plus internal arbitration
```

Pros:

- regulatory compliance mostly delegated to Stripe
- familiar user experience

Cons:

- transaction fees
- settlement delay for new accounts
- regionally constrained

## Path 2: Crypto Escrow (Programmable Money)

```text
Bond posting: L2 smart contract deposit
Escrow: the contract is the escrow
Settlement: oracle posts the outcome and contract releases funds
Dispute: on-chain arbitration or bonded council
```

Pros:

- instant programmable settlement
- global access

Cons:

- smart-contract risk
- wallet friction
- regulatory and volatility concerns

## Path 3: Hybrid (Internal Ledger + Settlement Rails)

```text
Bond posting: internal credits funded via Stripe or crypto deposit
Escrow: database ledger entries
Settlement: ledger debit/credit, with optional payout or bridge on withdrawal
```

Pros:

- zero in-market transaction cost
- fast internal settlement
- flexible external rails

Cons:

- operator counterparty risk
- possible money-transmitter obligations
