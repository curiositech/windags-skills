# Deadlock, Divergence, and Failure Modes in Concurrent Agent Systems

## Overview

Chapter 6 of Agha's thesis is a catalogue of the pathological behaviors that plague concurrent systems — and, critically, a demonstration of how the actor model either eliminates or contains each one. For WinDAGs, this is a handbook of failure modes and architectural countermeasures.

## Divergence: Infinite Loops That Don't Block

**What it is**: A divergence is a computation that runs forever, generating an infinite sequence of internal events. In a non-actor system, this typically blocks a process entirely — it loops forever and never processes another message.

**The actor model's key advantage**: Because actors specify replacement behaviors, a diverging actor never holds a resource lock. The replacement is computed and begins accepting messages even as the current computation continues its infinite loop.

Agha's stop-watch example is the canonical illustration: