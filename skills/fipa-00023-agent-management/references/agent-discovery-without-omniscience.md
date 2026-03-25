# Agent Discovery Without Omniscience: The White Pages / Yellow Pages Architecture

## The Core Problem

When building systems where multiple AI agents coordinate to solve problems, a brutal question emerges immediately: **How does Agent A find Agent B when it needs a capability that B provides?** 

The naive answer—"maintain a central registry of all agents and their capabilities"—works in toy systems but collapses under real-world conditions:
- Agents may join and leave dynamically
- Capabilities may change as agents learn or fail
- No single entity can maintain complete, current knowledge of all agents
- The central registry becomes a bottleneck and single point of failure
- Different organizational domains may run separate agent platforms

The FIPA Agent Management specification (sections 4.1-4.2) solves this through a fundamental architectural distinction that has profound implications for how intelligent systems coordinate: **separate the question "who exists?" from the question "who can do what I need?"**

## The Two-Registry Architecture

### Agent Management System (AMS): The White Pages

The AMS is the **authority on identity and presence**. Every agent must register with the AMS of its home Agent Platform (AP). The AMS maintains:

- **Agent Identifiers (AIDs)**: Globally unique names, typically `agentname@platform.com`
- **Transport Addresses**: Where messages can be physically delivered (e.g., `iiop://foo.com/acc`)
- **Life Cycle State**: Is the agent active, suspended, waiting, in transit, or unknown?
- **Resolver Chains**: Where else to look if an address has changed

When an agent registers with the AMS, it's making a claim: "I exist, I'm reachable at these addresses, and I'm in this state." The AMS is authoritative for its platform—only one AMS exists per AP.

**Key insight**: The AMS doesn't need to know what you can do, only that you exist and where you are. This is like DNS for agents—it maps names to locations, nothing more.

### Directory Facilitator (DF): The Yellow Pages

The DF is the **marketplace for capabilities**. Agents register service descriptions with the DF: