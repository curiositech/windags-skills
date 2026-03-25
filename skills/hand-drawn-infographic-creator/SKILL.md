---
license: Apache-2.0
name: hand-drawn-infographic-creator
description: Generate hand-drawn style diagrams and infographics for recovery education articles. Creates anatomist's notebook aesthetic visuals - brain diagrams, timelines, social comparisons, and process flows using continuous line art, semantic color coding, and margin annotations.
allowed-tools: Read, Write, Edit, mcp__stability-ai__*, mcp__ideogram__*, WebFetch, WebSearch, mcp__firecrawl__*
category: Design & Creative
tags:
  - infographics
  - hand-drawn
  - diagrams
  - education
  - recovery
  - neuroscience
  - ai-image-generation
  - accessibility
---

# Hand-Drawn Infographic Creator

**Purpose:** Generate hand-drawn style diagrams and infographics for recovery education articles that combine scholarly authority with intimate accessibility—like watching an expert sketch complex ideas on a whiteboard.

## DECISION POINTS

### Primary Content Classification Tree

```
Content Request
├── Is it anatomical/neuroscience?
│   ├── Shows brain structure/function → Brain Anatomy Template
│   │   ├── Mechanism (dopamine, receptors) → Sagittal section + color highlights
│   │   ├── Damage patterns (addiction effects) → Comparative views + coral coding  
│   │   └── Recovery processes (healing) → Before/after + gold progression
│   └── Shows body systems → Body diagram with organ focus
├── Is it temporal/progression?
│   ├── Recovery timeline → Timeline Graph Template
│   │   ├── Symptom progression → Multi-curve graph + semantic colors
│   │   ├── Treatment phases → Staged timeline + milestone markers
│   │   └── Relapse patterns → Cyclical diagram + warning points
│   └── Process sequence → Process Flow Template
├── Is it social/interpersonal?
│   ├── Communication patterns → Social Comparison Template
│   │   ├── Conflict scenarios → Side-by-side contrast + gesture language
│   │   ├── Support responses → Empathy vs judgment comparison
│   │   └── Group dynamics → Multi-figure interaction mapping
│   └── Relationship effects → Network diagram with connection quality
└── Is it abstract concept?
    ├── Psychological mechanisms → Process Flow Template
    ├── Systemic effects → Cascade diagram with feedback loops
    └── Theoretical frameworks → Conceptual mapping with metaphors
```

### Color Strategy Decision Matrix

| Content Type | Primary Issue | Healing/Progress | Activity/Function | Problem/Risk |
|--------------|---------------|------------------|-------------------|--------------|
| **Brain diagrams** | Coral highlights | Gold regions | Cyan activation | Coral damage |
| **Timelines** | Coral peaks | Gold improvement | Teal stability | Coral crisis points |
| **Social scenarios** | Coral conflict panel | Gold connection panel | Teal positive flow | Coral negative spiral |
| **Process flows** | Coral problem boxes | Gold solution boxes | Cyan active pathways | Coral breakdown points |

### Visual Complexity Decision Tree

```
Audience Assessment
├── General public (family members, friends)
│   ├── Use simple metaphors → "Brain's alarm system"
│   ├── Minimal technical labels → Common language only
│   └── Focus on emotional impact → What does this feel like?
├── Recovering individuals
│   ├── Include personal relevance → "You might recognize this"
│   ├── Balance hope with realism → Show both struggle and recovery
│   └── Avoid stigmatizing imagery → Focus on healing, not pathology
└── Healthcare providers/counselors
    ├── Include technical accuracy → Proper anatomical terms
    ├── Show clinical relevance → How does this inform treatment?
    └── Reference evidence base → Include research context
```

## FAILURE MODES

### 1. "Medical Textbook Drift"
**Symptoms:** Overly clinical aesthetic, sterile precision, loss of warmth
**Detection Rule:** If the output looks like it belongs in a medical textbook rather than a caring conversation, you've hit this anti-pattern
**Fix Strategy:** 
- Add organic line variation and hand-drawn imperfections
- Include margin notes with conversational explanations
- Ensure parchment background and ink aesthetic
- Test: Would this feel welcoming to someone seeking help?

### 2. "Rainbow Vomit Highlighting"
**Symptoms:** Using too many colors, decorative rather than semantic color use, visual chaos
**Detection Rule:** If you're using more than 3 highlight colors or color doesn't convey meaning, you've hit this anti-pattern
**Fix Strategy:**
- Limit to 1-2 semantic colors per diagram
- Use color coding table: cyan=activity, coral=problem, gold=healing
- Start with line-only version, add color strategically
- Ask: What specific meaning does each color communicate?

### 3. "Jargon Overload Annotation"
**Symptoms:** Technical terms without explanation, assumption of prior knowledge, inaccessible language
**Detection Rule:** If someone's family member couldn't understand the margin notes, you've hit this anti-pattern
**Fix Strategy:**
- Translate every technical term: "Anterior cingulate cortex (brain's alarm center)"
- Use conversational margin notes: "This is why everything feels like a threat"
- Include emotional context: "This can feel scary, but it's normal healing"
- Test: Would this help someone explain to their worried parent?

### 4. "Photorealism Creep"
**Symptoms:** Smooth gradients, perfect lines, digital aesthetic, stock photo appearance
**Detection Rule:** If the AI output looks digitally rendered rather than hand-sketched, you've hit this anti-pattern
**Fix Strategy:**
- Strengthen negative prompts: "photorealistic, 3D render, smooth gradients, digital art"
- Emphasize hand-drawn keywords: "continuous line art, organic variation, slight imperfections"
- Specify ink medium: "charcoal ink on parchment, hand-sketched"
- Check technical settings: CFG scale too high causes over-rendering

### 5. "Layout Cramming"
**Symptoms:** No white space, overcrowded elements, margin notes competing with main content
**Detection Rule:** If the diagram feels visually overwhelming or hard to parse at first glance, you've hit this anti-pattern
**Fix Strategy:**
- Follow 60/20/15/5 grid strictly: 60% main content, 20% margins, 15% title, 5% bottom
- Preserve negative space around key elements
- Limit annotations to 4-5 key points maximum
- Ask: Can someone understand the main point in 3 seconds?

## WORKED EXAMPLES

### Example 1: Meth-Induced Paranoia Brain Diagram

**Initial Request:** "Show why meth causes paranoia"

**Content Analysis Decision Path:**
- Content type: Anatomical/neuroscience → Brain Anatomy Template
- Mechanism focus (salience network overactivity) → Sagittal section + color highlights
- Audience: Recovering individuals + families → Balance technical accuracy with accessibility
- Complexity: Moderate → Include proper terms with plain-language explanations

**Template Selection Reasoning:**
- Brain anatomy template chosen because we're explaining a neurological mechanism
- Sagittal section provides clear view of anterior cingulate cortex and insula
- Color strategy: Cyan highlights for hyperactivity (semantic meaning: abnormal activation)

**AI Prompt Construction:**
```
"Sagittal section of human brain, continuous line art, anatomical drawing style, 
ink on parchment (#faf8f3 background), charcoal lines (#1a2332), 
highlight anterior cingulate cortex and insula in cyan glow (#4a9d9e, 40% opacity), 
margin notes on right side in ocean blue (#2d5a7b) reading 'Pattern detector 
gone haywire - seeks threats everywhere', scale bar showing 5cm at bottom right, 
Leonardo da Vinci anatomical study aesthetic, engineer's notebook style"

Negative: "photorealistic, 3D render, stock photo, modern clinical, smooth gradients"
```

**Layout Decisions:**
- 60% for brain structure (center-left positioning for natural reading flow)
- 20% for margin explanations (right side, engineer's notebook style)
- Labels pointing from structures to margin area (avoids crowding the anatomy)
- Title space includes context: "Why Meth Causes Paranoia"

**Expert vs Novice Catches:**
- **Novice miss:** Would just show "brain damage" in general terms
- **Expert catch:** Specifically identifies salience network (ACC + insula) as the pattern-detection system gone haywire
- **Novice miss:** Might use scary, stigmatizing language about "drug brain"
- **Expert catch:** Frames as treatable neurological symptom, not moral failing
- **Novice miss:** Would use medical jargon without translation
- **Expert catch:** "Anterior cingulate cortex (brain's alarm center)" provides both accuracy and accessibility

### Example 2: PAWS Timeline Graph

**Initial Request:** "Show how long withdrawal symptoms last"

**Content Analysis Decision Path:**
- Content type: Temporal/progression → Timeline Graph Template
- Symptom progression over months → Multi-curve graph + semantic colors
- Audience: Newly recovering individuals → Balance realism with hope
- Complexity: Moderate → Show multiple symptom types with different recovery trajectories

**Color Strategy Decisions:**
- Anxiety curve: Coral (represents struggle, peaks at "The Wall")
- Mood stability: Gold (represents healing, inverse relationship to anxiety)
- Sleep quality: Teal (represents improvement, first system to normalize)
- Strategic use of color to show that different systems heal at different rates

**Critical Trade-offs Navigated:**
- **Realism vs Hope:** Show the difficulty of "The Wall" (weeks 4-8) while emphasizing the "Turning Point" (month 6)
- **Accuracy vs Simplicity:** Include variation disclaimer while maintaining clear general trajectory
- **Individual vs Universal:** Show common patterns while noting "timeline varies by drug, duration, individual"

**Revision Reasoning:**
- Initial version focused too much on pathology (what's wrong)
- Revision emphasized that "these symptoms are HEALING, not failure"
- Added empowering frame: "If you make it past 'The Wall,' recovery accelerates"

## QUALITY GATES

- [ ] **Style Authenticity:** Output has hand-drawn aesthetic (organic lines, slight imperfections, parchment background)
- [ ] **Color Semantics:** Every color conveys specific meaning (cyan=activity, coral=problem, gold=healing)
- [ ] **Layout Hierarchy:** Follows 60/20/15/5 grid with clear visual hierarchy
- [ ] **Accessibility Compliance:** Alt text written, color not sole information carrier, WCAG AA contrast
- [ ] **Scientific Accuracy:** Anatomical structures correctly labeled and positioned
- [ ] **Language Accessibility:** Technical terms explained in margin notes using conversational language
- [ ] **Emotional Appropriateness:** Tone is hopeful and non-stigmatizing while being realistic about challenges
- [ ] **Educational Clarity:** Main concept understandable within 3 seconds of viewing
- [ ] **Technical Specifications:** 16:9 aspect ratio, proper hex codes specified, AI generation settings included
- [ ] **Scope Appropriateness:** Diagram serves defined educational purpose without mission creep

## NOT-FOR BOUNDARIES

### What This Skill Should NOT Create:

**Clinical Diagnosis Tools:** 
- For diagnostic flowcharts or assessment instruments → use `medical-assessment-creator` instead
- This skill creates educational explanations, not clinical decision-making tools

**Medication Instructions or Dosage Information:**
- For pharmaceutical guidance or treatment protocols → use `medication-education-designer` instead
- This skill explains mechanisms and processes, not specific medical interventions

**Crisis Intervention Graphics:**
- For suicide prevention resources or emergency protocols → use `crisis-resource-designer` instead
- This skill handles educational content about recovery, not acute crisis situations

**Legal or Regulatory Compliance Materials:**
- For informed consent forms or treatment agreements → use `legal-document-designer` instead
- This skill creates understanding aids, not legally binding materials

### Delegation Guidelines:

**If request involves specific medical recommendations:** "This requires clinical expertise - use `medical-guidance-creator` for treatment-specific content"

**If request needs real-time crisis support:** "This requires immediate professional resources - use `crisis-intervention-designer` for safety-focused materials"

**If request involves legal documentation:** "This requires legal compliance review - use `healthcare-legal-designer` for regulated content"