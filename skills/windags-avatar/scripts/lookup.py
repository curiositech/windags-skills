#!/usr/bin/env python3
"""
WinDAGs Corpus Lookup — Query the retrieval engine for evidence.

Uses the hybrid search engine (BM25 + semantic) built during the V3
Constitutional Convention to find evidence from 300+ academic papers,
books, V1 reference files, and V2 convention artifacts.

Usage:
    python lookup.py "Thompson sampling skill selection" --context section --max 5
    python lookup.py "Polya four questions" --source v1_reference
    python lookup.py "cascading task failure" --source paper --context paragraph

Requires:
    - Retrieval engine setup (corpus/scripts/retrieval.py)
    - Document store (corpus/outputs/document_store.db)
    - ChromaDB collections (corpus/outputs/chroma_db_v2/)
"""

import argparse
import subprocess
import sys
import os

# Add corpus scripts to path
CORPUS_SCRIPTS = os.path.join(
    os.path.dirname(__file__), '..', '..', '..', '..',
    'corpus', 'scripts'
)
sys.path.insert(0, os.path.abspath(CORPUS_SCRIPTS))

CONSTITUTION_PATH = os.path.join(
    os.path.dirname(__file__), '..', 'references', 'windags-constitution-v3.md'
)


def fallback_grep(query: str, max_results: int = 20):
    """Fall back to grep-based search of the constitution."""
    print(f"\nFalling back to grep search of constitution...")
    try:
        result = subprocess.run(
            ['grep', '-n', '-i', query, CONSTITUTION_PATH],
            capture_output=True, text=True, timeout=10
        )
        lines = result.stdout.strip().split('\n')[:max_results]
        for line in lines:
            if line:
                print(line)
    except (subprocess.TimeoutExpired, FileNotFoundError) as e:
        print(f"Grep fallback failed: {e}")


def main():
    parser = argparse.ArgumentParser(
        description='Query the WinDAGs corpus for evidence'
    )
    parser.add_argument(
        'query',
        help='Search query (natural language)'
    )
    parser.add_argument(
        '--context', '-c',
        choices=['sentence', 'paragraph', 'section', 'chapter'],
        default='section',
        help='Context level for results (default: section)'
    )
    parser.add_argument(
        '--max', '-m',
        type=int,
        default=5,
        help='Maximum number of results (default: 5)'
    )
    parser.add_argument(
        '--source', '-s',
        choices=['paper', 'distillation', 'v1_reference', 'v2_artifact', 'market_research'],
        default=None,
        help='Filter by source type'
    )
    parser.add_argument(
        '--tradition', '-t',
        default=None,
        help='Filter by tradition tag (e.g., "HTN", "NDM", "BDI")'
    )

    args = parser.parse_args()

    try:
        from retrieval import RetrievalEngine

        engine = RetrievalEngine(
            db_path=os.path.join(CORPUS_SCRIPTS, '..', 'outputs', 'document_store.db'),
            chroma_path=os.path.join(CORPUS_SCRIPTS, '..', 'outputs', 'chroma_db_v2')
        )

        results = engine.lookup(
            query=args.query,
            context_level=args.context,
            max_results=args.max,
            source_filter=args.source,
            tradition_filter=args.tradition
        )

        print(f"\n{'='*60}")
        print(f"Query: {args.query}")
        print(f"Context: {args.context} | Source: {args.source or 'all'} | Tradition: {args.tradition or 'all'}")
        print(f"Found: {results['total_found']} results")
        print(f"{'='*60}\n")

        for i, result in enumerate(results['results'], 1):
            print(f"--- Result {i} ---")
            print(f"Source: {result['source']}")
            print(f"Score: {result.get('score', 'N/A')}")
            if result.get('heading'):
                print(f"Section: {result['heading']}")
            print(f"\n{result['text']}\n")

    except ImportError:
        print("ERROR: Retrieval engine not found.")
        print(f"Expected at: {CORPUS_SCRIPTS}/retrieval.py")
        print("\nTo set up the retrieval engine:")
        print("  1. cd corpus/scripts/")
        print("  2. python document_store.py --build")
        print("  3. python multi_granularity_index.py --index")
        fallback_grep(args.query, args.max * 4)
    except Exception as e:
        print(f"ERROR: {e}")
        fallback_grep(args.query, args.max * 4)


if __name__ == '__main__':
    main()
