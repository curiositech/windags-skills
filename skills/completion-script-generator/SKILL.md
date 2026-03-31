---
name: completion-script-generator
license: Apache-2.0
description: |
  Generates shell completion scripts for CLI tools. Parses command structure from
  help output, commander/yargs configs, or manual specification. Produces completions
  for bash, zsh, and fish that follow each shell's conventions.
category: Backend & Infrastructure
tags:
  - cli
  - completion
  - bash
  - zsh
  - fish
  - shell
allowed-tools:
  - Read
  - Bash(*)
  - Glob
  - Grep
  - Write
  - Edit
pairs-with:
  - skill: beautiful-cli-design
    reason: Completions are a core part of CLI UX — a beautiful CLI without completions is half-finished
  - skill: daemon-development
    reason: Long-running daemon CLIs benefit most from completions since users interact frequently
  - skill: devtool-documentation
    reason: Completions serve as executable documentation of available commands and flags
---

# Completion Script Generator

Generate shell completion scripts that make CLIs feel native. Parses existing command structure from source code, help output, or manual specification, then produces idiomatic completions for bash, zsh, and fish. Handles subcommands, flags with arguments, mutually exclusive options, file completions, and dynamic completions that query the tool at runtime.

## When to Use

**Use for:**
- Adding tab completion to a CLI built with commander, yargs, clap, cobra, or argparse
- Generating completions from `--help` output when source code is unavailable
- Creating zsh completions with descriptions (the gold standard of shell completion UX)
- Implementing dynamic completions that call the CLI to list valid values at runtime
- Porting completions between shells (e.g., bash completions exist, need zsh and fish)
- Adding completions to a CLI as part of the install/setup experience

**Do NOT use for:**
- Building the CLI itself (use `beautiful-cli-design`)
- General shell scripting (this is specifically about completion registration)
- IDE/editor autocompletion (different system entirely)
- Prompt customization (use shell config skills)

---

## Core Capabilities

### 1. Command Structure Extraction

Before generating completions, you need the command tree. Three extraction methods, from most to least reliable:

**Method A: Parse Source Code (Best)**

For Node.js CLIs using commander:

```bash
# Extract commands and options from commander program
grep -rn '\.command(' src/cli.ts | while read -r line; do
  cmd=$(echo "$line" | grep -oP "\.command\(['\"]([^'\"]+)" | sed "s/.*['\"]//")
  echo "COMMAND: $cmd"
done

grep -rn '\.option(' src/cli.ts | while read -r line; do
  flag=$(echo "$line" | grep -oP "\.option\(['\"]([^'\"]+)" | sed "s/.*['\"]//")
  desc=$(echo "$line" | grep -oP "'[^']*'\s*\)" | head -1)
  echo "OPTION: $flag -- $desc"
done
```

For yargs:

```bash
# Extract from yargs .command() and .option() calls
grep -rn '\.command(' src/ --include="*.ts" --include="*.js" | \
  grep -oP "command\(['\"]([^'\"]+)" | sed "s/command(['\"]//;s/['\"]$//"
```

**Method B: Parse Help Output (Good)**

```bash
# Capture help for main command and all subcommands
CLI="wg"
$CLI --help 2>&1 > /tmp/cli-help-main.txt

# Extract subcommands from help output
grep -E "^\s+\w+" /tmp/cli-help-main.txt | awk '{print $1}' | while read -r subcmd; do
  $CLI "$subcmd" --help 2>&1 > "/tmp/cli-help-$subcmd.txt" 2>/dev/null
done

# Extract flags
grep -oP '\-\-[\w-]+' /tmp/cli-help-main.txt | sort -u
```

**Method C: Manual Specification (Fallback)**

When neither source nor help is parseable, define the structure manually:

```bash
# Define as a simple DSL
cat > /tmp/cli-spec.txt << 'SPEC'
command: execute
  --dag <file>        DAG definition file
  --topology <type>   Topology type (dag|swarm|team|blackboard)
  --dry-run           Show plan without executing
  --verbose           Enable verbose output

command: skill
  subcommand: search
    --query <text>    Search query
    --category <cat>  Filter by category
    --limit <n>       Max results (default: 10)
  subcommand: show
    <skill-id>        Skill identifier

command: history
  --limit <n>         Number of entries
  --format <fmt>      Output format (json|table|text)
SPEC
```

### 2. Bash Completion Generation

Bash completions use the `complete` builtin with a function that populates `COMPREPLY`.

```bash
#!/bin/bash
# Completion for 'wg' CLI

_wg_completions() {
    local cur prev opts commands
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"

    # Top-level commands
    commands="execute skill history config"

    # Global options
    global_opts="--help --version --verbose --quiet"

    # If completing the first argument, suggest commands
    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=( $(compgen -W "$commands $global_opts" -- "$cur") )
        return 0
    fi

    # Subcommand-specific completions
    local subcmd="${COMP_WORDS[1]}"
    case "$subcmd" in
        execute)
            case "$prev" in
                --dag)
                    # Complete with .yaml and .json files
                    COMPREPLY=( $(compgen -f -X '!*.@(yaml|yml|json)' -- "$cur") )
                    return 0
                    ;;
                --topology)
                    COMPREPLY=( $(compgen -W "dag swarm team blackboard team-builder recurring workflow" -- "$cur") )
                    return 0
                    ;;
            esac
            opts="--dag --topology --dry-run --verbose --target-project"
            COMPREPLY=( $(compgen -W "$opts" -- "$cur") )
            ;;
        skill)
            if [ "$COMP_CWORD" -eq 2 ]; then
                COMPREPLY=( $(compgen -W "search show list" -- "$cur") )
            elif [ "${COMP_WORDS[2]}" = "search" ]; then
                case "$prev" in
                    --category)
                        # Dynamic: query the CLI for categories
                        local categories
                        categories=$(wg skill categories 2>/dev/null)
                        COMPREPLY=( $(compgen -W "$categories" -- "$cur") )
                        return 0
                        ;;
                esac
                COMPREPLY=( $(compgen -W "--query --category --limit --format" -- "$cur") )
            fi
            ;;
        history)
            case "$prev" in
                --format)
                    COMPREPLY=( $(compgen -W "json table text" -- "$cur") )
                    return 0
                    ;;
            esac
            COMPREPLY=( $(compgen -W "--limit --format" -- "$cur") )
            ;;
    esac

    return 0
}

complete -F _wg_completions wg
```

**Installation for bash:**

```bash
# Option 1: Source in .bashrc
echo 'source /path/to/wg-completion.bash' >> ~/.bashrc

# Option 2: Install to system completions directory
sudo cp wg-completion.bash /etc/bash_completion.d/wg

# Option 3: CLI self-install
wg completion bash > ~/.local/share/bash-completion/completions/wg
```

### 3. Zsh Completion Generation

Zsh completions are more powerful: they support descriptions, grouping, and argument types. The format is more complex but the UX is dramatically better.

```zsh
#compdef wg

# Completion for 'wg' CLI

_wg() {
    local -a commands
    commands=(
        'execute:Execute a DAG or topology'
        'skill:Search and manage skills'
        'history:View execution history'
        'config:Manage configuration'
    )

    _arguments -C \
        '(-h --help)'{-h,--help}'[Show help]' \
        '(-v --version)'{-v,--version}'[Show version]' \
        '--verbose[Enable verbose output]' \
        '--quiet[Suppress non-essential output]' \
        '1: :->command' \
        '*:: :->args'

    case $state in
        command)
            _describe -t commands 'wg commands' commands
            ;;
        args)
            case $words[1] in
                execute)
                    _wg_execute
                    ;;
                skill)
                    _wg_skill
                    ;;
                history)
                    _wg_history
                    ;;
            esac
            ;;
    esac
}

_wg_execute() {
    _arguments \
        '--dag[DAG definition file]:file:_files -g "*.{yaml,yml,json}"' \
        '--topology[Topology type]:topology:(dag swarm team blackboard team-builder recurring workflow)' \
        '--dry-run[Show execution plan without running]' \
        '--verbose[Enable verbose output]' \
        '--target-project[Target project directory]:directory:_directories' \
        '--env-file[Environment file]:file:_files -g "*.env*"'
}

_wg_skill() {
    local -a skill_commands
    skill_commands=(
        'search:Search skills by query'
        'show:Show skill details'
        'list:List all available skills'
    )

    _arguments -C \
        '1: :->skill_command' \
        '*:: :->skill_args'

    case $state in
        skill_command)
            _describe -t skill_commands 'skill commands' skill_commands
            ;;
        skill_args)
            case $words[1] in
                search)
                    _arguments \
                        '--query[Search query]:query:' \
                        '--category[Filter by category]:category:_wg_categories' \
                        '--limit[Max results]:count:' \
                        '--format[Output format]:format:(json table text)'
                    ;;
                show)
                    _arguments \
                        '1:skill:_wg_skill_ids'
                    ;;
            esac
            ;;
    esac
}

# Dynamic completion: query CLI for skill IDs
_wg_skill_ids() {
    local -a skills
    skills=(${(f)"$(wg skill list --format=completion 2>/dev/null)"})
    _describe -t skills 'skills' skills
}

# Dynamic completion: query CLI for categories
_wg_categories() {
    local -a categories
    categories=(${(f)"$(wg skill categories 2>/dev/null)"})
    _describe -t categories 'categories' categories
}

_wg_history() {
    _arguments \
        '--limit[Number of entries]:count:' \
        '--format[Output format]:format:(json table text)'
}

_wg "$@"
```

**Installation for zsh:**

```bash
# Option 1: Place in fpath directory
cp _wg ~/.zsh/completions/_wg
# Ensure fpath includes this directory in .zshrc:
# fpath=(~/.zsh/completions $fpath)

# Option 2: CLI self-install
wg completion zsh > "${fpath[1]}/_wg"

# After installing, rebuild completion cache
rm -f ~/.zcompdump && compinit
```

### 4. Fish Completion Generation

Fish completions are the simplest to write and the most readable. Each completion is a single `complete` command.

```fish
# Completion for 'wg' CLI

# Disable file completion by default
complete -c wg -f

# Top-level commands
complete -c wg -n __fish_use_subcommand -a execute -d 'Execute a DAG or topology'
complete -c wg -n __fish_use_subcommand -a skill -d 'Search and manage skills'
complete -c wg -n __fish_use_subcommand -a history -d 'View execution history'
complete -c wg -n __fish_use_subcommand -a config -d 'Manage configuration'

# Global options
complete -c wg -l help -s h -d 'Show help'
complete -c wg -l version -s v -d 'Show version'
complete -c wg -l verbose -d 'Enable verbose output'
complete -c wg -l quiet -d 'Suppress non-essential output'

# execute subcommand
complete -c wg -n '__fish_seen_subcommand_from execute' -l dag -r -F -d 'DAG definition file'
complete -c wg -n '__fish_seen_subcommand_from execute' -l topology -r -xa 'dag swarm team blackboard team-builder recurring workflow' -d 'Topology type'
complete -c wg -n '__fish_seen_subcommand_from execute' -l dry-run -d 'Show plan without executing'
complete -c wg -n '__fish_seen_subcommand_from execute' -l target-project -r -xa '(__fish_complete_directories)' -d 'Target project directory'

# skill subcommand
complete -c wg -n '__fish_seen_subcommand_from skill; and not __fish_seen_subcommand_from search show list' -a search -d 'Search skills'
complete -c wg -n '__fish_seen_subcommand_from skill; and not __fish_seen_subcommand_from search show list' -a show -d 'Show skill details'
complete -c wg -n '__fish_seen_subcommand_from skill; and not __fish_seen_subcommand_from search show list' -a list -d 'List all skills'

# skill search options
complete -c wg -n '__fish_seen_subcommand_from skill; and __fish_seen_subcommand_from search' -l query -r -d 'Search query'
complete -c wg -n '__fish_seen_subcommand_from skill; and __fish_seen_subcommand_from search' -l category -r -xa '(wg skill categories 2>/dev/null)' -d 'Category filter'
complete -c wg -n '__fish_seen_subcommand_from skill; and __fish_seen_subcommand_from search' -l limit -r -d 'Max results'
complete -c wg -n '__fish_seen_subcommand_from skill; and __fish_seen_subcommand_from search' -l format -r -xa 'json table text' -d 'Output format'

# skill show - dynamic skill ID completion
complete -c wg -n '__fish_seen_subcommand_from skill; and __fish_seen_subcommand_from show' -xa '(wg skill list --format=completion 2>/dev/null)'

# history subcommand
complete -c wg -n '__fish_seen_subcommand_from history' -l limit -r -d 'Number of entries'
complete -c wg -n '__fish_seen_subcommand_from history' -l format -r -xa 'json table text' -d 'Output format'
```

**Installation for fish:**

```bash
# Fish completions auto-load from this directory
cp wg.fish ~/.config/fish/completions/wg.fish

# Or CLI self-install
wg completion fish > ~/.config/fish/completions/wg.fish
```

### 5. Self-Install Pattern

The gold standard: the CLI generates and installs its own completions.

```typescript
// In your CLI's completion command handler
import { writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

function installCompletions(shell: 'bash' | 'zsh' | 'fish'): void {
  const script = generateCompletionScript(shell);

  switch (shell) {
    case 'bash': {
      const dir = join(homedir(), '.local/share/bash-completion/completions');
      execSync(`mkdir -p "${dir}"`);
      writeFileSync(join(dir, 'wg'), script);
      console.log(`Bash completions installed. Restart your shell or run: source ${join(dir, 'wg')}`);
      break;
    }
    case 'zsh': {
      const dir = join(homedir(), '.zsh/completions');
      execSync(`mkdir -p "${dir}"`);
      writeFileSync(join(dir, '_wg'), script);
      console.log(`Zsh completions installed. Run: rm -f ~/.zcompdump && compinit`);
      break;
    }
    case 'fish': {
      const dir = join(homedir(), '.config/fish/completions');
      execSync(`mkdir -p "${dir}"`);
      writeFileSync(join(dir, 'wg.fish'), script);
      console.log(`Fish completions installed. Available immediately.`);
      break;
    }
  }
}
```

**Auto-detect the user's shell:**

```bash
# Detect current shell
case "$SHELL" in
  */bash) shell="bash" ;;
  */zsh)  shell="zsh" ;;
  */fish) shell="fish" ;;
  *)      echo "Unknown shell: $SHELL"; exit 1 ;;
esac
```

---

## Decision Points

### Which Shells to Support

| Shell | Market Share (dev) | Effort | Priority |
|-------|-------------------|--------|----------|
| zsh | ~60% (macOS default) | High (complex format, best UX) | Must have |
| bash | ~30% (Linux default) | Medium | Must have |
| fish | ~10% (power users) | Low (simplest format) | Nice to have |

**Recommendation:** Always generate zsh and bash. Add fish if your users skew toward power-user demographics. Skip if your audience is primarily Windows (use PowerShell completion instead, which is a different system).

### Static vs Dynamic Completions

| Approach | When to Use | Tradeoff |
|----------|------------|----------|
| Static | Fixed option lists, enum values | Fast, no runtime dependency |
| Dynamic | Skill IDs, project names, resource lists | Slower, always current |
| Cached dynamic | Large lists that change slowly | Best of both, stale risk |

**Rule of thumb:** If the completion list has fewer than 50 items AND changes less than weekly, make it static. Otherwise, make it dynamic with a cache timeout.

---

## Anti-Patterns

### Anti-Pattern: Generating Completions Without Testing

**What it looks like:** Generate the completion script, commit it, ship it.

**Why wrong:** Completion scripts are executable code running in the user's shell. A syntax error in a zsh completion function can break the user's entire tab completion system, not just your tool. A bad `compdef` can interfere with other tools.

**Instead:** Test completions in a clean shell session. Source the script, type the command prefix, press tab, and verify the suggestions are correct. Test edge cases: empty input, partial input, after flags, after subcommands.

```bash
# Test in isolated bash session
bash --norc --noprofile -c 'source ./wg-completion.bash && complete -p wg'

# Test in isolated zsh session
zsh -f -c 'fpath=(. $fpath); autoload -Uz compinit; compinit; source ./_wg'
```

### Anti-Pattern: Completions That Call Slow Commands

**What it looks like:** Dynamic completion for `--project` runs `wg list-projects` which takes 3 seconds because it queries a remote API.

**Why wrong:** Tab completion must feel instant (<200ms). A 3-second delay on every tab press makes the CLI feel broken. Users will disable completions rather than wait.

**Instead:** Cache dynamic completions. The CLI should write a cache file that completions read directly. The cache is updated on relevant commands (e.g., `wg project create` refreshes the project cache), not on every tab press.

```bash
# In the completion function, use cache
_wg_projects() {
    local cache_file="${XDG_CACHE_HOME:-$HOME/.cache}/wg/projects.txt"
    if [ -f "$cache_file" ] && [ $(( $(date +%s) - $(stat -f%m "$cache_file" 2>/dev/null || stat -c%Y "$cache_file") )) -lt 3600 ]; then
        # Cache is fresh (< 1 hour)
        COMPREPLY=( $(compgen -W "$(cat "$cache_file")" -- "$cur") )
    else
        # Cache stale, regenerate
        local projects=$(wg project list --format=names 2>/dev/null)
        mkdir -p "$(dirname "$cache_file")"
        echo "$projects" > "$cache_file"
        COMPREPLY=( $(compgen -W "$projects" -- "$cur") )
    fi
}
```

### Anti-Pattern: Incomplete Subcommand Trees

**What it looks like:** Top-level commands complete, but subcommand options do not.

**Why wrong:** Users rely on completion most when they are learning a CLI. If `wg skill` completes but `wg skill search --` does not, the user loses trust in completions and stops using them entirely. Partial completions are worse than no completions because they set an expectation and then violate it.

**Instead:** If you generate completions, generate them completely. Every subcommand, every flag, every argument type. If a command accepts a file, specify the file extension filter. If a flag takes an enum, list the enum values. Thoroughness is not optional.

### Anti-Pattern: Hardcoded Paths

**What it looks like:** Completion script contains `/Users/eric/dev/wg/skills/` as a path.

**Why wrong:** Completions are distributed to other machines and users. Hardcoded paths break immediately for anyone else. They also break when the original user moves the project.

**Instead:** Use the CLI itself for dynamic resolution (`wg skill list`), environment variables (`$WG_HOME`), or XDG conventions (`$XDG_DATA_HOME/wg/`). Never embed absolute paths from the development machine.

---

## Quality Checklist

Before shipping completions:

- [ ] All top-level commands complete with descriptions
- [ ] All subcommands complete within their parent command context
- [ ] All flags complete with correct argument types (file, directory, enum, free text)
- [ ] Mutually exclusive flags are handled (e.g., `--verbose` and `--quiet`)
- [ ] File completions use extension filters where applicable
- [ ] Dynamic completions respond in under 200ms (cached or fast command)
- [ ] Completion script tested in a clean shell session for each target shell
- [ ] Installation instructions documented for each shell
- [ ] Self-install command works (`wg completion <shell>` or `wg completion install`)
- [ ] No hardcoded paths from the development environment
- [ ] Script handles the case where the CLI binary is not in PATH gracefully
- [ ] Completions do not interfere with other tools' completions

---

## Output Contract

This skill produces:
- **Completion scripts** for each target shell (bash, zsh, fish)
- **Installation instructions** per shell with platform-specific paths
- **Self-install code** for embedding in the CLI's `completion` subcommand
- **Test commands** to verify completions work in isolation
- **Cache strategy** for dynamic completions (if applicable)

## References

- `references/shell-completion-conventions.md` -- Platform-specific conventions for completion file locations and naming
- `references/dynamic-completion-patterns.md` -- Patterns for cached dynamic completions across bash, zsh, and fish
