# Author for WinDAGs search and grafting

Use this guide when a skill must be found by users who describe a task in their own words. The WinDAGs cascade uses lexical matching and, when data and models are available, usage-vector similarity, rank fusion, reranking, and attribution. A full graft loads primary skill instructions and exposes supporting file names. The skill's start and stop conditions apply once an agent reads and executes the instructions.

## Write the search inputs

- Write the frontmatter description around the job, outcome, natural task language, and the most relevant neighboring boundary. The description and existing catalog fields support lexical selection and provide a readable candidate summary.
- Put positive use-case sentences into `references/tool2vec-queries.json` as a JSON array of unique, nonempty strings. Each should sound like an actual request. Cover different operations, objects, and vocabulary. Include implicit intent and vary specificity. Use concrete completions of “I'd ask an agent to…” rather than descriptions of what the skill contains.
- Keep exclusion cues in the description or body and store near misses in the evaluation cases. A Tool2Vec centroid moves toward every sentence given to it. Keep paraphrases of indexed examples out of the held-out set and omit personal data and secrets.
- Prefer a single skill with a clear job, or focused skills connected by well-defined artifacts. Compare against nearest existing skills before adding another entry.

## Rebuild and verify

The standalone skill pack and Homebrew distribution read the packed catalog vector. From a linked worktree in this repository, build only the row for the changed skill.

```bash
node mcp-server/scripts/build-embeddings.mjs --skill skill-architect
```

Verify that the rest of the packed corpus is preserved and compare a held-out set through the plugin's MCP search and graft tools. The full release builder also uses authored examples when present. Keep positive examples in source to make the packed vector reproducible.

If you are working in the WinDAGs source repository rather than this distribution, use its cache builder with an isolated path.

```bash
pnpm exec tsx scripts/build-tool2vec-cache.ts --skill skill-architect --cache-path ./tmp/tool2vec-check.json
```

The builder uses the same local MiniLM task embedder used by the matcher. It embeds each authored positive example and L2-normalizes their mean into a 384-dimensional Tool2Vec entry. Skills without authored examples use the existing provider-generated query path. Use this builder for the MiniLM runtime cache. Benchmark builders may use a different embedding model and vector dimension. [Tool2Vec primary paper](https://arxiv.org/abs/2409.02141) A test cache keeps a baseline intact. Copy the normal cache to a worktree path before a paired evaluation if testing against the full catalog. Omit `--cache-path` when intentionally refreshing `~/.windags/tool2vec-embeddings.json`. Set `WINDAGS_TOOL2VEC_CACHE_PATH` to the same absolute file path before starting a fresh WinDAGs MCP or CLI process that should read the test cache. Set `WINDAGS_SKILLS_DIR` to the intended catalog when testing over MCP. Search services load the cache when instantiated.

1. Check the cache's entry for the target ID. The saved query array should equal the authored file. Verify a finite, nonzero vector of the expected dimension and a hash matching the resolved skill body.
2. Run the same held-out requests on a fresh search instance against the original and updated cache. Record lexically routed neighbors, the selected rank, whether the semantic stage was used, and what happens when the local embedder falls back. Record the catalog and cache inputs used for each run.
3. Request `windags_skill_graft` in full mode for representative positives. Verify the correct skill ID, current entrypoint, and exposed reference names. Verify representative near misses route elsewhere. Vector and ranking checks measure selection. Test instruction use or resulting artifacts separately.
4. Install or publish the exact checked bundle through the intended channel. A local cache refresh can change matching on this machine before installation or publication elsewhere.

The bundle's [authored examples](tool2vec-queries.json) and [routing cases](graft-evaluation.json) are kept separate so the latter can check generalization. See the [evaluation guide](skill-evaluation-evidence.md) for a paired evaluation protocol and limitations.
