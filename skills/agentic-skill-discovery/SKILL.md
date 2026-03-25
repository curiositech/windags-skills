---
license: Apache-2.0
name: agentic-skill-discovery
description: Automated discovery and matching of agent skills for dynamic task routing and capability assessment
category: Agent & Orchestration
tags:
  - skill-discovery
  - agents
  - automation
  - search
  - matching
---

# Agentic Skill Discovery

**Version:** 1.0  
**Domain:** Autonomous Learning Systems, AI Architecture, Reinforcement Learning

## Core Concept

Autonomous skill discovery solves the chicken-egg problem: learning what constitutes success while learning how to achieve it. The system must be both student and teacher, creating circular dependencies that require architectural separation of proposal and validation.

## Decision Points

### Architecture Selection Decision Tree

**If task has ground-truth success criteria (e.g., navigation, manipulation with clear goals)**
→ Use Single-Model Architecture with fast LLM evaluation
→ Cost: Low | Precision: ~75% | Use case: Predetermined tasks

**If task requires open-ended skill discovery (e.g., creative tasks, exploration)**
→ Use Dual-Process Architecture (System 1/System 2)
→ System 1: Fast LLM evaluation for training loops
→ System 2: Independent VLM validation for library admission
→ Cost: High | Precision: ~76% | Use case: Autonomous learning

**If complex multi-step behavior is desired**
→ Top-Down Quest Decomposition
→ Start with failed complex task → decompose into subtasks → learn missing prerequisites
→ Success rate: 43.75% vs 12.50% for bottom-up chaining

**If building skill library from primitives**
→ Bottom-Up Skill Chaining only if primitives are well-matched to end goals
→ Risk: Combinatorial explosion and missing "middle skills"
→ Fallback: Switch to top-down when composition fails

**If performance plateaus with existing approach**
→ Check for circular dependencies (same model proposing and evaluating)
→ If detected: Implement architectural separation
→ If not detected: Add RAG with successful skill patterns for environmental knowledge distillation

### Validation Strategy Decision Table

| Scenario | Fast Eval (System 1) | Slow Eval (System 2) | Library Admission Rule |
|----------|---------------------|----------------------|------------------------|
| Training loops | LLM-generated success functions | None | Not applicable |
| Skill validation | LLM evaluation | VLM verification | Require both to pass |
| Library contamination risk | High tolerance | Zero tolerance | System 2 override required |
| Cost constraints | Optimize for speed | Optimize for accuracy | Asymmetric cost acceptance |

## Failure Modes

### 1. Rubber Stamp Evaluation
**Symptoms:** High reported success rates but poor task completion, library growing rapidly
**Detection Rule:** If same model generates rewards AND evaluates success, you have circular dependency
**Root Cause:** LLM acting as both player and referee creates evaluation bias
**Fix:** Implement architectural separation with independent validator (e.g., VLM for visual tasks)

### 2. Primitive Explosion Paralysis
**Symptoms:** Large skill library but inability to solve complex tasks, skills don't compose effectively
**Detection Rule:** If skill count grows but complex task success rate stays flat, you have the "middle skills" problem
**Root Cause:** Bottom-up chaining can't discover skills between primitives and complex goals
**Fix:** Switch to top-down quest decomposition from desired complex behaviors

### 3. Context-Free RAG Waste
**Symptoms:** RAG retrieval happening but no performance improvement, treating retrieval as generic examples
**Detection Rule:** If RAG doesn't improve constraint learning (e.g., physics understanding), it's just expensive prompting
**Root Cause:** Missing the environmental knowledge distillation mechanism
**Fix:** Structure skill library as progressive model of environmental affordances, not just example collection

### 4. Library Contamination Cascade
**Symptoms:** Performance degrades over time as library grows, false positives compound
**Detection Rule:** If library admission uses same evaluation as training loops, contamination will cascade
**Root Cause:** Bad skills enable bad compositions; library errors compound unlike training noise
**Fix:** Use expensive independent validation for library admission, cheap evaluation for training only

### 5. Manual Granularity Override
**Symptoms:** Skills feel disconnected from natural semantic boundaries, forced abstraction levels
**Detection Rule:** If manually specifying skill granularity contradicts LLM proposals, check domain alignment
**Root Cause:** LLMs encode semantic task boundaries from training data
**Fix:** Let system propose skills freely, observe discovered granularity, adjust only for domain-specific needs

## Worked Examples

### Example 1: Robotic Drawer Opening with Dual-Process Validation

**Scenario:** Agent must learn to open various drawer types without predefined success criteria.

**System 1 (Fast) Process:**
1. LLM generates skill proposal: "grasp_drawer_handle"
2. LLM creates success function: `drawer_handle_grasped = gripper_distance < 0.02`
3. RL training uses this function for 100 episodes
4. LLM evaluates: "Success! Gripper consistently reaches handle"
5. **Decision Point:** Admit to library? NO - requires System 2

**System 2 (Slow) Process:**
1. VLM analyzes final video frames from 10 best episodes
2. VLM verdict: "Gripper touches handle but doesn't maintain grasp - fingers don't close"
3. **Detection:** System 1 false positive caught
4. **Action:** Reject library admission, refine success function
5. **Iteration:** Add grasp pressure requirement to success function

**Expert vs Novice:**
- **Novice misses:** Trusts LLM self-evaluation, admits poorly learned skill
- **Expert catches:** Same model can't evaluate what it proposed; needs independent validation

**Outcome:** Library maintains 76% precision vs 46% without System 2

### Example 2: Top-Down Quest Decomposition for Multi-Step Task

**Scenario:** "Prepare coffee" fails with bottom-up skill chaining despite having primitives like "grasp_cup", "pour_liquid"

**Bottom-Up Failure Analysis:**
- Available skills: grasp_cup, pour_liquid, move_arm, detect_object
- Composition attempts: All 16 possible 2-skill chains tried
- **Missing middle skills:** "align_cup_with_spout", "detect_liquid_level", "coordinate_bimanual_pouring"
- **Decision Point:** Bottom-up can't discover these - they're not primitive compositions

**Top-Down Decomposition:**
1. Failed task: "prepare_coffee"
2. Decompose into: [heat_water] → [grind_beans] → [align_cup] → [pour_water] → [add_beans]
3. **Gap analysis:** "align_cup" missing from library
4. **On-demand learning:** Learn "align_cup" with initial state = end state of "grind_beans"
5. **Chaining:** Each subtask's success state becomes next task's initial condition

**Trade-off Analysis:**
- Bottom-up: 12.50% success rate, explores unnecessary skill combinations
- Top-down: 43.75% success rate, learns only needed prerequisites
- **Cost:** Top-down requires task decomposition capability, bottom-up requires exhaustive exploration

**When Top-Down Backfires:**
- If task decomposition is wrong, learns skills for incorrect subtasks
- If initial states can't be reliably set, chaining breaks
- **Mitigation:** Validate decomposition before skill learning, implement state-setting verification

### Example 3: RAG Environmental Knowledge Distillation

**Scenario:** Agent must learn manipulation skills in new environment without explicit physics constraints

**Without RAG (25% success rate):**
1. LLM generates reward: `reward = distance_to_target`
2. Agent learns to approach but doesn't account for collision boundaries
3. **Failure:** No knowledge that gripper must be 5cm from surface before grasping

**With RAG (46% success rate):**
1. Retrieve previous success: "reach_cube_A" reward function
2. **Pattern detected:** All successful reaches include `gripper_height > 0.05` constraint
3. LLM incorporates: `reward = distance_to_target if gripper_height > 0.05 else -10`
4. **Knowledge distilled:** Environmental affordance learned implicitly

**Expert vs Novice:**
- **Novice misses:** Treats RAG as example provision, doesn't recognize constraint learning
- **Expert catches:** RAG enables environmental knowledge distillation through pattern recognition

**When RAG Backfires:**
- If retrieved patterns are from different environments, wrong constraints learned
- If successful examples are too sparse, patterns not statistically significant
- **Mitigation:** Filter retrieval by environment similarity, require minimum sample size for pattern extraction

## Quality Gates

- [ ] Proposal and validation use different model capabilities (e.g., LLM proposes, VLM validates)
- [ ] Fast evaluation precision >45% and slow evaluation precision >75% measured on held-out test set
- [ ] Library admission requires independent validation, not just training loop success
- [ ] Complex task decomposition generates 3-7 meaningful subtasks with clear dependency ordering
- [ ] RAG retrieval improves constraint learning by >15% over no-RAG baseline
- [ ] Skill granularity analysis shows semantic clustering, not parametric enumeration
- [ ] System can detect and recover from circular dependency failure modes
- [ ] Library contamination rate <25% verified through independent evaluation
- [ ] Top-down decomposition outperforms bottom-up chaining by >2x on complex tasks
- [ ] Environmental knowledge distillation demonstrates constraint learning from success patterns

## NOT-FOR Boundaries

**Do NOT use this skill for:**
- **Predetermined tasks with known success criteria** → Use standard RL with hand-crafted rewards instead
- **Single-step manipulation tasks** → Use supervised learning with demonstration data instead
- **Tasks requiring real-time performance** → Dual-process validation too slow; use cached skill library instead
- **Domains without visual feedback** → VLM validation unavailable; design domain-specific independent validators instead
- **Resource-constrained environments** → System 2 validation expensive; accept lower precision or use hierarchical validation

**Delegate to these skills instead:**
- **Standard reward engineering** → For tasks with clear success metrics
- **Imitation learning** → For tasks with abundant demonstration data  
- **Hierarchical RL** → For tasks with known skill decomposition
- **Meta-learning** → For rapid adaptation to new task distributions
- **Constitutional AI** → For tasks requiring value alignment and safety constraints