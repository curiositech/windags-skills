# Hierarchical Task Decomposition: Choosing the Right Grain of Analysis

## The Problem of Granularity

One of the most practically important contributions of Grassi's thesis is its demonstration of how to choose the right level of decomposition for a complex task. Too coarse, and the model cannot capture the decisions that matter. Too fine, and the model becomes brittle, over-specified, and unable to handle the natural variability of real-world execution.

The thesis uses three levels of decomposition, each serving a different purpose:

> "In accordance with the CMN-GOMS notation, three model levels were utilized in this thesis: the Unit Task Level, the Functional Task Level, and the Detailed Task Level. The lowest level of detail is presented at the Unit Task Level. Here the primary goal is identified along with its immediate sub-goals or operators. The Functional Task Level decomposes the Unit Task Level and represents the next level of detail. The Detailed Task Level, much like its name, provides the greatest degree of detail among the three models." (p. 21)

**Unit Task Level** (5 sub-goals for Getting Underway):
- Complete Brief Phase
- Ensure Ship and Crew Ready
- Complete Clearing the Pier
- Complete Exiting the Pier Area
- Complete Entering Channel Phase

**Functional Task Level** (15-20 sub-goals per evolution):
- Each Unit Task expands into operational phases with named checkpoints

**Detailed Task Level** (operator sequences with selection rules):
- Each Functional Task expands into specific commands, with explicit branch conditions and method selections

This three-level structure is not arbitrary. Each level serves a distinct cognitive and operational function.

## What Each Level Is For

### The Unit Task Level: Strategic Awareness

The Unit Task level is for maintaining **situational awareness at the highest level**. A conning officer who knows they are in "Complete Clearing the Pier" phase versus "Complete Exiting the Pier Area" phase has a fundamentally different orientation to their immediate decisions. The phase name activates a whole cluster of expectations, concerns, and priorities.

In agent orchestration terms, the Unit Task level is where the orchestrator operates. The orchestrator does not need to know whether the helmsman is currently using 15 degrees or 20 degrees of rudder. It needs to know which phase of the evolution is active, whether that phase is proceeding normally, and what the transition condition to the next phase is.

### The Functional Task Level: Operational Coordination

The Functional Task level is for **coordination between sub-agents or specialists**. At this level, the key questions are: What needs to happen in what order? What must be verified before proceeding? What parallel activities can occur simultaneously?

Note that the thesis's Functional Level includes specific inter-agent coordination points:
> "goal: Complete_Tie_Up_Of_Tug_In_Required_Position"
> "goal: Receive_Order_From_CO_To_Get_Underway"
> "goal: Ensure_Harbor_Pilot_Onboard"

These are not the conning officer's own actions — they are coordination checkpoints where the conning officer's progress depends on the actions of other agents (the tugboat, the commanding officer, the pilot). The model explicitly represents inter-agent dependencies.

### The Detailed Task Level: Operator Specification

The Detailed Task level is where execution actually occurs. This level specifies the exact command syntax, the confirmation protocols, and the fallback options when primary methods fail.

The structure at this level is remarkably consistent throughout the thesis:
1. **Determine parameters** (which engine? which direction? what speed?)
2. **Issue verbal order** (with specific syntax)
3. **Receive acknowledgment** (repeat-back confirmation)
4. **Verify execution** (perceptual check that the order was carried out)
5. **Receive execution report** (formal acknowledgment of completion)

This five-step pattern — Determine → Issue → Acknowledge → Verify → Report — appears at virtually every detailed operator. It is a **micro-protocol for reliable command execution** that builds in redundant confirmation at each step.

## The Selection Rule as the Key to Decomposition Quality

The most important element at the Detailed Level is the **selection rule**: the condition under which one method is chosen over another. Selection rules are where expertise lives at the procedural level — they capture the "when to use what" knowledge that distinguishes expert practitioners from novices who know the same methods.

A well-constructed selection rule has three components:
1. **The alternatives** (multiple methods for achieving the same sub-goal)
2. **The conditions** (when each alternative is appropriate)
3. **The default** (what to do when conditions are ambiguous)

From the thesis, the selection rule for determining rudder direction: