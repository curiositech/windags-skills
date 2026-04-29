# Fractionated Expertise: Why Competence Has Sharp Edges

## The Myth of Uniform Expertise

One of the most practically important findings in Kahneman and Klein's synthesis is what they call "fractionated expertise" — the observation that genuine skill in one area of a professional's domain does not transfer uniformly to adjacent areas, even when those areas are closely related. This is not a minor qualification. It is a structural feature of expertise that fundamentally changes how any system — human organizational or AI agent — should route problems to specialized handlers.

The authors write: "We refer to such mixed grades for professionals as 'fractionated expertise,' and we believe that the fractionation of expertise is the rule, not an exception."

Shanteau's (1992) original review found that nurses, physicians, and auditors — three professions that appeared on his "competent experts" list — also appeared on his "poor judgment" list. The same professionals were experts and non-experts depending on the task. The resolution: they were experts in some tasks and not others within the same professional role.

The examples are striking:
- **Auditors**: expert at "hard" data (accounts receivable, numerical verification) but no better than chance at "soft" data (detecting fraud through behavioral cues)
- **Physicians**: skilled at routine diagnoses in their specialty but no better than novices at novel presentations or diagnoses outside their subspecialty
- **Weather forecasters**: reliably accurate for temperature and precipitation; significantly less accurate for hail (rare, local, low learning opportunity even in a high-validity physical environment)
- **Financial analysts**: may accurately predict a company's commercial success but cannot reliably judge whether the stock is underpriced (different information structure, different validity)

## Why Fractionation Occurs

Fractionation is not random. It follows directly from the two conditions for skilled intuition:

1. **Environmental validity varies within a domain.** A single professional domain may contain high-validity subtasks (clear cues, stable patterns) and low-validity subtasks (chaotic outcomes, no reliable cues). The physician's domain contains both: interpreting a chest X-ray has high validity (stable anatomical patterns); predicting whether a patient will adhere to a treatment regimen has low validity (depends on psychological, social, and economic factors without stable, learnable cues).

2. **Learning opportunity varies within a domain.** Even in high-validity subtasks, if a practitioner rarely encounters certain case types, they cannot build the pattern library required for skilled performance. Weather forecasters don't see enough hail events in any location to build strong hail-prediction intuitions, even though hail has physical causes that are in principle predictable.

The combination produces a fine-grained map of expertise: not "this professional is an expert" or "this professional is not an expert" but "this professional is an expert at tasks A, C, and F within their domain, but not at tasks B, D, and E."

## The Overconfidence Consequence

Fractionation becomes dangerous when it is invisible — when the professional (or the system relying on the professional) doesn't know where the competence boundaries are.

Kahneman and Klein identify two different failure patterns:

**Pattern 1 (Klein's focus)**: The expert encounters a task that falls outside their pattern library — a novel situation. Good experts recognize this: they notice that the situation doesn't fit any familiar category, and they shift to deliberate investigation. "The ability to recognize that a situation is anomalous and poses a novel challenge is one of the manifestations of authentic expertise." Poor experts in the same situation don't recognize the novelty — they force the situation into the nearest familiar category and apply inappropriate patterns with high confidence.

**Pattern 2 (Kahneman's focus)**: The expert is asked to apply their genuine competence to a different but superficially similar task. A financial analyst who is genuinely skilled at assessing commercial viability is asked about stock valuation. Their knowledge about the company is real and accurate. But stock valuation requires additional information about market pricing efficiency that they don't have and haven't learned. They answer the asked question using skills developed for a different question, and neither they nor their audience notices. "Finance professionals, psychotherapists, and intelligence analysts may know a great deal about a particular company, patient, or international conflict, and they may have received ample feedback supporting their confidence in the performance of some tasks — typically those that deal with the short term — but the feedback they receive from their failures in long-term judgments is delayed, sparse, and ambiguous."

The feedback asymmetry is critical: the professional gets rapid, clear feedback on their high-validity tasks (the diagnosis was right or wrong; the fire was contained or not). They get delayed, ambiguous feedback on their low-validity tasks (the long-term forecast was wrong, but by then the causal chain is opaque). This reinforces confidence in their high-validity skills and produces no corrective signal for their low-validity overreach.

## Self-Awareness as a Marker of Real Expertise

Kahneman and Klein note an empirical finding that is both reassuring and sobering: professionals who operate in domains with clear feedback, standard methods, and direct personal consequences for error tend to develop accurate self-maps of their competence.

"Weather forecasters, engineers, and logistics specialists typically resist requests to make judgments about matters that fall outside their area of competence. People in professions marked by standard methods, clear feedback, and direct consequences for error appear to appreciate the boundaries of their expertise. These experts know more knowledgeable experts exist. Weather forecasters know there are people in another location who better understand the local dynamics."

This suggests that domain structure — not just individual character — shapes whether experts develop accurate competence self-maps. High-accountability, rapid-feedback domains produce experts who know their limits. Low-accountability, delayed-feedback domains produce experts who don't.

True expertise, the authors suggest, includes knowing when you don't know. "True experts, it is said, know when they don't know. However, nonexperts (whether or not they think they are) certainly do not know when they don't know."

## Application to Agent System Design

### Explicit Competence Scoping

Every skill in a WinDAGs agent system should have an explicit competence scope — not just a description of what it does, but a map of the subtask space where it is reliable vs. unreliable: