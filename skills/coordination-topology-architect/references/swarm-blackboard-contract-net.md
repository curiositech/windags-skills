# Swarm, Blackboard, and Contract Net

These three are easy to confuse because all three are non-DAG and nontrivial. They are not the same.

## Swarm

Use swarm when:

- discovery is decentralized
- agents react to findings, not assignments
- the system converges through message flow, quorum, timeout, or inactivity

Good question:
- "What new work becomes visible when this finding is published?"

Bad sign:
- one coordinator is assigning everything anyway

## Blackboard

Use blackboard when:

- specialists read and write one shared state model
- agent activation depends on board conditions
- the central artifact is the important thing, not the message transcript

Good question:
- "What does the board now know, and which specialist does that trigger?"

Bad sign:
- there is no board, only linear handoff

What the classic blackboard literature adds:

- Hearsay-II is a classic example of coordinating multiple independent knowledge sources to resolve uncertainty
- Hayes-Roth's blackboard control architecture separates domain/control knowledge and lets the system adapt to unexpected problem-solving situations
- Corkill emphasizes that blackboard systems fit ill-defined, complex problems where diverse expertise accumulates around one evolving workspace

## Contract Net

Use contract-net style planning when:

- tasks must be announced
- candidates bid or volunteer based on suitability
- manager and contractor roles are dynamic
- the same node may manage one task while contracting on another

Good question:
- "Who should hear this task announcement, and how will bids be evaluated?"

Bad sign:
- you have full shared information and fixed routing already; that is workflow, not contract net

What Smith 1980 adds:

- task distribution is a negotiation problem
- manager and contractor are roles, not fixed identities
- roles can change dynamically during problem solving
- task partitioning can recur recursively

## Sources

- Reid G. Smith, "The Contract Net Protocol: High-Level Communication and Control in a Distributed Problem Solver", IEEE Transactions on Computers, 1980. Public PDF: https://reidgsmith.com/The_Contract_Net_Protocol_Dec-1980.pdf
- Barbara Hayes-Roth, "A blackboard architecture for control", Artificial Intelligence 26(3), 1985. Abstract page: https://www.sciencedirect.com/science/article/abs/pii/0004370285900633
- Lee D. Erman, Frederick Hayes-Roth, Victor Lesser, D. Raj Reddy, "The Hearsay-II Speech-Understanding System: Integrating Knowledge to Resolve Uncertainty", ACM Computing Surveys 12(2), 1980.
- Daniel Corkill, "Blackboard Systems", AI Expert 6(9), 1991. Abstract page: https://mas.cs.umass.edu/paper/218
