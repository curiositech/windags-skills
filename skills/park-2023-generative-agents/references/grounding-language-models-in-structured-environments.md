# Grounding Language Models in Structured Environments: The Tree Representation Pattern

## The Grounding Problem

Large language models reason in natural language, but most computational environments are structured: hierarchical file systems, object trees in GUIs, spatial layouts in physical worlds, nested scopes in code. How do you bridge the gap?

The naive approach: describe everything in natural language and hope the model figures it out. "There is a kitchen. The kitchen contains a stove, refrigerator, and sink. The stove is currently off. The refrigerator contains milk and eggs..."

This scales poorly. With hundreds of objects and locations, the description becomes unwieldy. The model must parse structure from flat text. Ambiguities arise (which stove? which kitchen?).

The paper presents a elegant solution: **represent the environment as a tree data structure, maintain a natural language description in sync with that structure, and provide algorithms for translating between language-based agent reasoning and structured environment updates**.

## The Environment Tree Structure

The environment is represented as a tree where:
- **Root node**: The entire world
- **Internal nodes**: Areas (houses, buildings, rooms)
- **Leaf nodes**: Objects (stove, desk, bed)
- **Edges**: Containment relationships (kitchen contains stove)

**Example from Figure 2**:
```
Smallville (root)
├── The Lin family's house
│   ├── Mei and John Lin's bedroom
│   │   ├── Bed
│   │   ├── Closet
│   │   └── Desk
│   ├── Eddy Lin's bedroom
│   │   └── Desk
│   ├── Common room
│   ├── Kitchen
│   │   ├── Stove
│   │   └── Refrigerator
│   └── Bathroom
├── Hobbs Cafe
│   ├── Counter
│   │   └── Coffee machine
│   └── Tables
└── Johnson Park
    └── Garden
```

Each node has:
- **Name**: String identifier
- **Type**: "area" or "object"
- **State**: Natural language description (for leaf nodes)
- **Children**: Nodes contained within this node

## Agent-Specific Environment Views

Critical architectural decision: **Agents don't have global knowledge of the environment—they maintain individual subgraphs** based on what they've perceived.

**Initial knowledge**: When an agent is initialized, it receives a subtree containing:
- Their living quarters (all rooms and objects)
- Their workplace (structure and objects)
- Common areas (stores, cafes, parks they know about)

**Dynamic updates**: As agents navigate, their trees expand:
- Entering a new area adds that area and its immediate children to their tree
- Objects in the area become visible
- The agent's tree is a **personal map** that can be outdated (if they haven't visited recently)

**Why this matters**: Agents are not omniscient. They operate on incomplete, potentially stale information. This produces realistic behavior—agents can't respond to changes in areas they haven't visited.

**Design implication**: For agent systems, maintain per-agent world models, not a single shared model. This creates:
- **Realistic limitations**: Agents don't know what they haven't observed
- **Information seeking behavior**: Agents must explore or ask others for information
- **Emergent communication**: Agents share information to sync world models

## Tree-to-Language Conversion

To pass environment information to language models, the tree is converted to natural language by traversing it:

**Traversal algorithm**:
1. Start at the agent's current location
2. Recursively describe the subtree rooted at that location
3. For each node, output: "there is a [name] in the [parent name]"
4. For leaf nodes, append state: "[name] is [state]"

**Example output** for an agent in the Lin family's kitchen:
```
The Lin family's house has Mei and John Lin's bedroom, 
Eddy Lin's bedroom, common room, kitchen, bathroom, and garden.

The kitchen has a stove, refrigerator, and sink.
The stove is turned off.
The refrigerator is empty.
The sink is filled with dirty dishes.
```

This natural language description is included in prompts when agents need to reason about locations or objects.

**Key properties**:
- **Hierarchical**: The description preserves the containment structure
- **Selective**: Only the relevant subtree is described, not the entire world
- **Stateful**: Object states are included, making the description actionable

## Language-to-Tree Action Grounding

When an agent's reasoning produces an action in natural language ("take a short walk in the garden"), the system must ground that action in the environment tree—selecting specific locations and objects.

### Location Selection Algorithm

**Goal**: Given an action description, find the appropriate leaf node in the environment tree.

**Algorithm** (recursive traversal):

1. **Start at root** of the agent's known environment tree
2. **Generate prompt**:
   ```
   [Agent's Summary Description]
   [Agent] is currently in [current location]
   [Agent] is planning to [action].
   Which area should [Agent] go to?
   
   Options: [list of areas the agent knows about]
   * Prefer to stay in current area if the activity can be done there.
   ```

3. **Language model selects** high-level area (e.g., "The Lin family's house")
4. **Recurse** into that area's children:
   ```
   [Agent] is planning to [action].
   The Lin family's house has: bedroom, kitchen, bathroom, garden.
   Which specific area should [Agent] go to?
   ```

5. **Language model selects** sub-area (e.g., "garden")
6. **Recurse** until reaching a leaf node (the final location)

**Example from paper**: Eddy wants to "take a short walk around his workspace." The algorithm:
- Selects "The Lin family's house" from known areas
- Selects "garden" from house areas
- Terminates at leaf node: "The Lin family's house: garden"

**Why recursive traversal works**:
- **Hierarchical prompting**: At each level, options are contextually appropriate
- **Preference for local**: The prompt includes "prefer to stay in current area," preventing unnecessary movement
- **Grounded selection**: Each choice is from actual children in the tree, preventing hallucination

### Object Interaction Grounding

When an agent acts on an object, the system updates the object's state by querying the language model:

**Prompt**:
```
[Agent] is [action] at [location: object].
What is the new state of [object]?
```

**Example**: Isabella is "making espresso for a customer" at "Hobbs Cafe: counter: coffee machine."

**Query**: "What is the new state of the coffee machine?"

**Response**: "brewing coffee"

**System action**: Update the coffee machine node's state field to "brewing coffee"

**Display effect**: The sandbox game engine renders this visually (coffee machine shows as active)

### Path Planning and Movement

Once a location is selected, the system uses traditional pathfinding (the paper doesn't specify the algorithm, likely A* or similar) to calculate a walking path from the agent's current position to the target location.

The agent's avatar then animates along this path, creating smooth movement in the game environment.

**Key insight**: High-level reasoning (language model selecting location) combines with low-level planning (pathfinding algorithm) to produce realistic navigation.

## Handling Statefulness and Persistence

The environment tree is **stateful**—object states persist and change over time based on agent actions and environmental events.

### State Update Examples

**Agent action causes state change**:
- Agent: "making breakfast"
- Object: kitchen stove
- State transition: "off" → "heating food"

**Time causes state change** (if modeled):
- Object: brewed coffee
- State transition: "hot" → "cold" (after time passes)

**Environmental event** (user-initiated):
- User sets: "<Isabella's apartment: kitchen: stove> is burning"
- State becomes: "burning"
- Agent perceives: "the stove is burning" (on next observation)
- Agent reacts: turns off stove, remakes breakfast

### State Consistency Challenges

The paper notes several failure modes related to state:

**1. Temporal constraints not enforced**: Stores close at 5pm, but agents sometimes enter after hours because closure state isn't explicitly represented.

**Fix needed**: Objects should have time-dependent states:
```
Oak Hill Store
  hours: "9am-5pm"
  current_state: "closed" (if current time > 5pm)
```

**2. Capacity constraints not represented**: Dorm bathrooms have implicit occupancy limits, but agents don't check if occupied before entering.

**Fix needed**: Objects should have capacity states:
```
Dorm bathroom
  capacity: 1
  current_occupants: [agent_id] or []
```

**3. Physical norms not encoded**: The bathroom is single-person, but agents assume multi-person because "dorm bathroom" typically means multi-person.

**Fix needed**: Explicit state descriptions override implicit assumptions:
```
Dorm bathroom
  description: "single-person bathroom"
  capacity: 1
```

## Advantages of the Tree Representation

### 1. Efficient Retrieval and Reasoning

The tree structure enables efficient queries:
- **Find all objects in location X**: Get X's children
- **Find location of object Y**: Traverse from Y to root
- **Find nearby objects**: Get siblings or parent's children

Without this structure, answering these queries requires parsing natural language descriptions repeatedly.

### 2. Partial Observability

Each agent maintains their own subtree, enabling:
- **Knowledge limitations**: Agents only know areas they've visited
- **Stale information**: Agent's tree may be outdated if they haven't returned recently
- **Information seeking**: Agents must explore or ask others to expand their knowledge

This creates realistic cognitive limitations and information-seeking behaviors.

### 3. Structured Prompts

Converting the tree to natural language for prompts produces hierarchical, parseable descriptions rather than flat enumerations. Compare:

**Flat description**: "There is a stove. There is a refrigerator. There is a sink. There is a bedroom. There is a bathroom. There is a desk. There is a bed..."

**Hierarchical description**: "The house has a kitchen and bedroom. The kitchen has a stove, refrigerator, and sink. The bedroom has a desk and bed."

The hierarchical form is more interpretable and mirrors how humans describe spaces.

### 4. State Isolation

Each leaf node has an independent state field, enabling:
- **Concurrent state changes**: Multiple objects can change state simultaneously
- **State verification**: Check if object is in valid state before action
- **State history**: Could extend to track state transitions over time

## Limitations and Extensions

### Limitation 1: No Relational Constraints

The tree represents containment (X in Y) but not other spatial relations:
- "The stove is next to the refrigerator"
- "The painting is above the desk"
- "The door connects the kitchen and living room"

**Extension needed**: Add relation edges between nodes beyond parent-child. These would be queried during "what can I see?" prompts.

### Limitation 2: No Dynamic Structure

The tree structure is mostly static (nodes don't move, containment doesn't change). Real environments need:
- Doors that open/close
- Objects that move between containers
- Temporary structures (pop-up tents, construction zones)

**Extension needed**: Allow structural updates: moving nodes between parents, adding/removing nodes dynamically.

### Limitation 3: No Physical Constraints

The tree doesn't enforce physical laws:
- An agent could be in two places simultaneously (if the tree allows)
- An object could be in an impossible state
- Spatial relationships could be paradoxical

**Extension needed**: Validation rules that check state consistency. Enforce mutual exclusion (agent can't be in two places), capacity limits (only N agents in a space), physical laws (can't cook with a broken stove).

### Limitation 4: Flat Leaf Nodes

Objects are leaf nodes with simple state strings. This doesn't capture:
- Object properties (weight, temperature, materials)
- Object affordances (what actions are possible)
- Object inventory (a refrigerator contains food items, each with properties)

**Extension needed**: Objects could themselves be subtrees, with properties as children. This creates arbitrarily deep hierarchies (world > house > kitchen > refrigerator > shelf > milk bottle > expiration date).

## Implications for Agent System Design

### For Code-Based Agents

A codebase can be represented as a tree:
```
Repository (root)
├── src/
│   ├── auth/
│   │   ├── login.ts
│   │   │   ├── LoginForm component
│   │   │   └── validateCredentials function
│   │   └── signup.ts
│   └── database/
│       └── connection.ts
├── tests/
└── docs/
```

Agents reasoning about code can:
- Navigate the tree to find relevant files
- Understand containment (which functions in which files)
- Retrieve code selectively (only include relevant subtrees in prompts)

**Design pattern**: Maintain a semantic tree where leaf nodes are functions/classes, internal nodes are files/modules, annotated with summaries of contents.

### For Multi-Agent Coordination

When agents coordinate, they need shared understanding of what exists and where. The tree provides:
- **Common grounding**: Both agents can refer to "kitchen: stove"
- **Division of labor**: "You handle objects in the kitchen, I'll handle bedroom"
- **Resource awareness**: "The coffee machine is in use; use the other one"

**Design pattern**: Agents share tree structure but may have different state information (A knows stove is on, B hasn't observed it yet).

### For Task Decomposition

Complex tasks can be decomposed by reasoning over environment structure:

**High-level goal**: "Clean the house"

**Decomposition via tree**:
1. For each room (children of house node):
   1. For each object in room (children of room node):
      1. If object state is "dirty", add "clean [object]" to task list

The tree structure provides natural decomposition boundaries.

### For State Management in Long-Running Agents

Agents that persist across sessions need environment state to persist. The tree provides:
- **Serialization format**: Export tree as JSON, load on restart
- **Delta updates**: Record only state changes, not full tree each time
- **Versioning**: Track tree structure changes over time
- **Merge conflicts**: When multiple agents update same object state, resolve conflicts

**Design pattern**: Persist tree to database with timestamps on state updates. On load, reconstruct agent's world view from their last session.

## The Broader Pattern: Structured Environments with Language Interfaces

The paper demonstrates a general pattern applicable beyond spatial environments:

**Principle**: **Maintain structured representations of the world, generate natural language views on-demand for reasoning, translate natural language actions back to structure updates**.

This applies to:
- **File systems**: Tree of directories/files, language descriptions of contents, file operations as actions
- **APIs**: Tree of endpoints/parameters, language descriptions of functionality, API calls as actions
- **Databases**: Tree of tables/columns, language descriptions of schema, queries as actions
- **UI hierarchies**: Tree of screens/components, language descriptions of affordances, interactions as actions

The key components:

1. **Structured representation**: Enables efficient querying and state management
2. **Language view generation**: Makes structure accessible to language models
3. **Action grounding**: Translates language-based plans to structure updates
4. **Agent-specific views**: Partial knowledge creates realistic limitations
5. **State persistence**: Environment changes accumulate over time

## The Deeper Insight on Representation

The paper's grounding architecture embodies a fundamental principle: **Language models reason in language, but structured representations enable reliable interaction with complex environments**.

Pure language approaches (describe everything in text, parse everything from text) are brittle:
- Parsing errors when model generates invalid object references
- Ambiguity when multiple objects have similar descriptions
- Inefficiency when repeatedly regenerating full environment descriptions
- Inconsistency when state updates don't propagate properly

Pure structured approaches (symbolic AI, rule-based systems) are inflexible:
- Cannot handle novel situations not covered by rules
- Cannot leverage world knowledge from language model training
- Cannot reason about ambiguous or underspecified scenarios

The hybrid approach combines strengths:
- **Structure** provides grounding, efficiency, consistency
- **Language** provides flexibility, world knowledge, natural interaction

For agent system designers, this suggests: **Build structured backbones, generate language views dynamically, use language models for reasoning, translate outputs back to structure**.

The tree representation is one instantiation of this principle. Other structures—graphs, tables, formal specifications—could follow the same pattern: maintain structure, generate language on-demand, ground actions in structure.

The art is in choosing the right structure for your domain and designing the translation layer between structure and language. The paper provides a concrete, working example of how to do this for spatial environments—an example that can guide similar implementations in other domains.