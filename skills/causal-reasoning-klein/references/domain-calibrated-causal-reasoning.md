# Domain-Calibrated Causal Reasoning: Why the Same Event Gets Different Explanations in Different Contexts

## The Domain Dependency of Causal Forms

One of the most striking empirical findings in Klein and Hoffman's study is the systematic variation in causal explanation forms across domains. Sports, economics, politics, and military analysis don't just have different content — they have systematically different explanation *structures*. Sports generates event explanations (counterfactual, reversible, recent). Economics generates story explanations (mechanistic, complex, involving interacting conditions). Politics generates list explanations (multiple contributing factors, no clear primary cause). This isn't random noise — it reflects both the actual causal structure of different domains and the explanatory conventions that have evolved within them.

This domain-calibration finding has major implications for multi-agent systems that operate across multiple domains.

---

## The Empirical Pattern

From Klein and Hoffman's data (Table 1, 74 incidents, 219 individual causes):

**Sports (38 incidents):**
- Heavy use of Event explanations (17 events) and Abstractions (55 — the highest of any domain)
- Significant use of Conditions (29) and Lists (14)
- Notable use of countervailing forces (12 of 38 sports incidents cited countervailing causes)
- Short causal chains when stories were used

**Economics (18 incidents):**
- Heavy use of Conditions (25) and Stories (14 — the highest proportion of any domain)
- Relatively few Abstractions (3) and almost no Lists (2)
- Very few countervailing forces cited (3 of 18)
- Complex, multi-factor stories with parallel and interacting causes

**Politics (7 incidents):**
- Heavy use of Events (17) and Conditions (14)
- All political incidents used Lists — 100%
- No Stories identified
- Some countervailing forces (2)

**Military (3 incidents):**
- Balanced Event (4) and Condition (4) use
- No Lists, no Stories identified

---

## Why Sports Generates Event Explanations

Sports has several features that make event explanations natural and appropriate:

1. **Discrete temporal structure**: Games have beginnings and ends; outcomes are decided at specific moments. The causal structure has natural event-boundaries.

2. **High counterfactuality**: Many game outcomes are genuinely contingent on specific plays. If the play had gone differently, the outcome would have been different. This makes reversibility a valid criterion, not just a cognitive bias.

3. **Observable decisions**: Player and coach decisions are visible and discrete. Attribution to specific agents is straightforward.

4. **Causal proximity**: The cause (the play) and the effect (the score change) are temporally proximate. Time-lag complications are minimal.

5. **Cultural convention**: Sports media has developed conventions for game explanation that privilege the dramatic moment, the clutch performance, the critical error. These conventions shape what explanations are offered and accepted.

**The limits of sports-style explanation:** Event explanations work for discrete contests. They fail for complex systemic outcomes. When sports-style thinking is applied to non-sports domains (explaining a company's failure as "the CEO made a bad decision" or explaining a military defeat as "the commander made a tactical error"), the structural conditions that made the system vulnerable to that decision are suppressed.

---

## Why Economics Generates Story and Condition Explanations

Economics has features that make event explanations inadequate and demand story/condition accounts:

1. **Structural causation**: Economic outcomes are heavily determined by structural features — market dynamics, regulatory frameworks, demographic trends — that operate over long time horizons and don't lend themselves to the near-miss framing that makes events salient.

2. **Nonlinear dynamics**: Housing bubbles, financial contagion, and currency crises all involve feedback loops and threshold effects that are intrinsically story-requiring phenomena. A list or event account can't capture "rising prices increase demand, which raises prices further" — this requires a story that represents the feedback.

3. **Long time lags**: The Fed's rate decisions in 2002 had their primary effects in 2007-2008. The time lag makes reversibility a poor criterion — it's not easy to imagine the 2002 rate cut "not happening" in the way it's easy to imagine the last-second basketball shot not happening.

4. **Multiple interacting causes**: Economic phenomena typically have multiple interacting causes, none sufficient alone. The mortgage crisis required: low rates + housing bubble dynamics + loosened lending standards + global capital flows + regulatory gaps. Remove any one: the crisis may not have occurred (or would have been less severe). The interaction is causally essential; only a story can capture it.

**The dangerous illusion of inevitability in economics stories:** Because economic stories must represent complex mechanisms, they tend to create strong impressions of inevitability. "Given these conditions, the crisis had to happen." This is epistemically dishonest — it suppresses the countervailing forces that almost prevented the crisis. Klein and Hoffman note this as a domain-specific failure: economics stories almost never cite countervailing factors.

---

## Why Politics Generates List Explanations

Political outcomes are genuinely multi-causal in a way that resists story construction:

1. **Many equally weighted factors**: A candidate losing a primary doesn't typically have one cause or even a few interacting causes — it has many independent factors (fundraising, media coverage, debate performance, demographic appeal, opposition research, policy positioning) that contributed in proportion but didn't strongly interact.

2. **Contested causal claims**: Political analysts with different values and perspectives will emphasize different factors. A list is a way of including multiple perspectives without forcing a consensus on their relative importance.

3. **High indeterminacy**: Political outcomes are highly contingent — similar conditions have produced different outcomes in different elections. This makes confident causal attribution implausible.

4. **Limited mechanism knowledge**: We don't have good causal models of why voters make the decisions they do. Without mechanism knowledge (propensity), stories are hard to construct with confidence.

**The danger of political list explanations:** Because lists don't show interactions, they support the false belief that political outcomes are determined by additive factors. "If Clinton had better messaging AND better ground game AND lower unfavorables, she would have won." But these factors may interact: better messaging might have improved her unfavorables, which would have improved her ground game effectiveness. The list suppresses these interactions.

---

## Implications for Multi-Domain Agent Systems

An agent system that operates across multiple domains needs domain-aware causal reasoning. Specifically:

### 1. Default Frame Selection by Domain
Before beginning causal analysis, an agent should consult a domain registry that indicates the typical explanation form appropriate for this domain type.