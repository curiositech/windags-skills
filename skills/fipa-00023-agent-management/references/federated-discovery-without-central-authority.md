# Federated Discovery Without Central Authority: How Agents Find Capabilities Across Organizational Boundaries

## The Scaling Problem in Service Discovery

Single-registry service discovery works fine within an organization or platform. But multi-agent systems face a harder problem: **How do agents discover capabilities that exist in systems they don't directly control?**

Consider:
- Organization A runs an agent platform with skills X, Y, Z
- Organization B runs an agent platform with skills P, Q, R
- An agent in A needs a capability that only exists in B
- Neither organization wants to share complete capability listings with the other
- Neither organization can run the other's discovery service

Traditional solutions:
1. **Central registry**: Both organizations report to a global directory (single point of failure, trust boundary issues)
2. **Point-to-point integration**: A and B manually configure discovery (doesn't scale beyond a few partners)
3. **Broadcast discovery**: Query all known platforms (expensive, leaks queries)

The FIPA specification (section 4.1.3) solves this with **federated Directory Facilitators**: DFs register with each other by advertising a special service type, enabling query propagation without central control.

## The Federation Mechanism

### Step 1: DFs Advertise Themselves

A DF can register with another DF by advertising a service of type `fipa-df`: