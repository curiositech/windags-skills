# Coordination Integration

Integrate this skill into a daemon by exposing:

- `claim(symbol, kind, sessionId)`
- `predict(conflictsForClaim)`
- `list(readersAndWritersForSymbol)`

Keep the daemon authoritative for active claims, but keep AST analysis explainable and cacheable.
