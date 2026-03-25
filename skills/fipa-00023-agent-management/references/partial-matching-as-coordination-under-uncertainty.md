# Partial Matching: How Agents Search When They Don't Know Exactly What They Need

## The Search Problem in Multi-Agent Systems

A fundamental challenge in agent coordination: **Agent A needs a capability, but it doesn't know the exact specification of agents that provide it.** 

Agent A might know:
- "I need something that understands the meeting-scheduler ontology"
- "I need a service that does user profiling"
- "I need an agent that speaks FIPA-SL0"

But Agent A probably doesn't know:
- Exactly what the service will be called
- What other capabilities the providing agent might have
- What specific properties the service implementation has
- What other ontologies or languages the agent supports

Traditional database queries fail here. If you search for an exact match, you get nothing unless you perfectly specify every field. If you do OR queries across missing fields, you get too many results. The FIPA specification (section 6.2.4) solves this with a **partial matching** semantic that formalizes "close enough."

## The Matching Rules: Structured Subsumption

The core principle: **A registered object matches a template if every constraint in the template is satisfied by the object, but the object can have additional properties beyond what's in the template.**

### Rule 1: Class Names Must Match