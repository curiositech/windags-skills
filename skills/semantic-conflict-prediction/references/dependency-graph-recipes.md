# Dependency Graph Recipes

Bound the graph aggressively:

1. Start from directly claimed symbols.
2. Add first-order callers/importers.
3. Optionally add one more hop for public helpers.
4. Stop when the signal becomes too diffuse to drive action.

Treat config-string references as soft dependencies unless you can map them structurally.
