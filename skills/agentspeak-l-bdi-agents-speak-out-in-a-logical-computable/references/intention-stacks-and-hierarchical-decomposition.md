# Intention Stacks and Hierarchical Goal Decomposition: How Agents Maintain Coherent Action Under Complexity

## The Stack as Memory of Commitment

In AgentSpeak(L), an intention is not a simple task pointer or a flat list of actions. An intention is a **stack of partially instantiated plans** — a data structure that preserves the full causal history of why the agent is doing what it is doing at every moment.

Rao defines this formally: "Each intention is a stack of partially instantiated plans, i.e., plans where some of the variables have been instantiated. An intention is denoted by [p₁ ⋮ ... ⋮ pₙ], where p₁ is the bottom of the stack and pₙ is the top of the stack."

When an agent executes an achievement goal `!g(t)` within a plan body, it does not simply look up how to achieve `g(t)` and start executing. Instead, it generates an *internal event* `<+!g(t), i>` where `i` is the *current intention*. The selected plan for this sub-goal is then pushed onto the top of the existing intention stack. The previous plan waits, partially executed, beneath it.

This stack discipline creates a profound property: **at every moment, the agent's full reasoning chain is preserved in the stack**. The top of the stack is what the agent is currently doing. The frames below it are the chain of goals that caused it to be doing this. When the top frame completes (its body reduces to `true`), it is popped, and the frame below resumes.

## Hierarchical Decomposition in Practice

The traffic-world example demonstrates this beautifully. Consider the robot's goal to clear waste from lane `b`. Following plan P1, the body is: