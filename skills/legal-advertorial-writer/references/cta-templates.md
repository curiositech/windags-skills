# CTA Block Templates

CTA blocks should come at the end of the article. They are short — 3–5 lines. The article does the persuasion; the CTA just closes the loop.

## Template Structure

```
[Closing sentence that echoes the article's core argument]
[What you get, specifically + price]
[Button label: verb + specific outcome, no hype]
```

---

## Templates by Product Type

### Record Sweep (dispute letter generation)

**Context:** Reader just learned that expungement doesn't automatically reach data brokers.

```html
<div class="cta-block">
  <h3>Your record was cleared in court. Make sure the background check companies know it.</h3>
  <p>
    Record Sweep generates a personalized FCRA dispute letter for every company
    that may have your file — 100+ letters, addressed and ready to send, for $99.
  </p>
  <a href="/record-sweep">Get Your Dispute Letters — $99</a>
</div>
```

**Button variations:**
- "Generate My Dispute Letters — $99"
- "Start Your Record Sweep — $99"
- "Get All 100+ Letters — $99"

---

### DIY Expungement Kit (form auto-fill + instructions)

**Context:** Reader just learned their eligibility and is weighing DIY vs. attorney.

```html
<div class="cta-block">
  <h3>If you're eligible, the forms exist. We've pre-filled them with your answers.</h3>
  <p>
    The DIY Kit includes your pre-filled petition, plain-English filing instructions,
    and a checklist for your court date — $99. Check your eligibility first (free).
  </p>
  <a href="/eligibility">Check My Eligibility — Free</a>
</div>
```

**Button variations:**
- "Check If I Qualify — Free"
- "See My Eligibility — Free"
- "Get the DIY Kit — $99"

---

### General Expungement Article (eligibility focus)

**Context:** Reader is early in their journey — not sure if they qualify.

```html
<div class="cta-block">
  <h3>The first step is finding out if you qualify. It takes five minutes.</h3>
  <p>
    Answer a few questions about your record and state. We'll tell you whether
    expungement is likely an option and what your next steps are.
  </p>
  <a href="/eligibility">Check My Eligibility — Free</a>
</div>
```

---

### State-Specific Guide Article

**Context:** Reader just read a deep-dive on their state's expungement law.

```html
<div class="cta-block">
  <h3>Oregon's process is navigable. You don't have to figure it out alone.</h3>
  <p>
    Our Oregon DIY Kit includes your pre-filled OJD petition, fee waiver form
    if you qualify, and step-by-step filing instructions for $99.
  </p>
  <a href="/oregon#kit">Get the Oregon Kit — $99</a>
</div>
```

---

### "Background Check Myth" Article (awareness/top-of-funnel)

**Context:** Reader just learned something that reframed their situation. High curiosity, lower purchase intent. Don't push a paid product yet.

```html
<div class="cta-block">
  <h3>Ready to find out where you actually stand?</h3>
  <p>
    Check your expungement eligibility in five minutes — free, no account required.
    We'll show you what's possible for your state and record type.
  </p>
  <a href="/eligibility">Check My Eligibility — Free</a>
</div>
```

---

## CTA Block Styling Reference

This project uses a warm copper/terracotta CTA block. For reference:

```jsx
<div className="my-8 rounded-xl bg-[#C4704B] text-white p-6">
  <h3 className="text-xl font-bold mb-2">[Headline]</h3>
  <p className="text-sm text-white/85 leading-relaxed mb-4">
    [Body — what you get + price]
  </p>
  <Link
    href="[destination]"
    className="inline-block bg-white text-[#C4704B] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-white/90 transition-colors"
  >
    [Button label]
  </Link>
</div>
```

---

## CTA Tone Calibration by Emotional State

| Reader's emotional state | Right tone | Wrong tone |
|--------------------------|-----------|-----------|
| Frustrated (system failed them) | Validating + practical | Cheerful, pumped-up |
| Hopeful (found out they qualify) | Direct, action-oriented | Cautious, hedgy |
| Skeptical (been burned before) | Specific, transparent pricing | Vague, salesy |
| Overwhelmed | Simple, one step at a time | Feature list |
| Early research mode | Low commitment (free CTA) | Hard sell for paid |

---

## What Not to Write

| Avoid | Reason |
|-------|--------|
| "Take control of your future today" | Cliché, condescending |
| "Don't let your past hold you back" | Overused, implies weakness |
| "Limited time offer" | Almost always a lie; destroys trust |
| "Life-changing" | Superlative; impossible to prove |
| "Join thousands of people who..." | Social proof without attribution is hollow |
| "Risk-free" without explaining the actual guarantee | Vague; makes people suspicious |

If you're offering a real money-back guarantee, state the actual terms: "If you're not satisfied within 30 days, we'll refund you — no questions asked."
