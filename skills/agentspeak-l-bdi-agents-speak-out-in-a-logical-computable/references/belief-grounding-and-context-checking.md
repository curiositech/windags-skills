# Belief Grounding and Context Checking: Why Agent Plans Must Be Anchored to Current World State

## The Central Role of Context

In AgentSpeak(L), the *context* of a plan is not an optional annotation — it is the mechanism by which plans are anchored to reality. A plan is only applicable when its context "is a logical consequence of the set of base beliefs B." This grounding requirement has profound implications for how intelligent systems should behave under uncertainty and in dynamic environments.

The context is a conjunction of belief literals — positive or negative ground atoms — that must hold in the agent's current belief state. From the traffic world example, plan P3's context requires: