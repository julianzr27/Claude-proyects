# Graph Report - .  (2026-07-21)

## Corpus Check
- Corpus is ~15,301 words - fits in a single context window. You may not need a graph.

## Summary
- 27 nodes · 34 edges · 7 communities (4 shown, 3 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.65)
- Token cost: 0 input · 138,610 output

## Community Hubs (Navigation)
- Skills Registry & Julian Context
- Graphify Core Skill
- Skill Discovery & Package
- Graph Database Exports
- Query & Reflection Loop
- Video/Audio Transcription
- Project README

## God Nodes (most connected - your core abstractions)
1. `graphify Skill (main)` - 12 edges
2. `Skills.md Index` - 11 edges
3. `find-skills Skill (agents source)` - 4 edges
4. `find-skills Skill (installed)` - 4 edges
5. `Skills CLI (npx skills)` - 4 edges
6. `graphifyy PyPI Package` - 3 edges
7. `Exports (Neo4j/FalkorDB/SVG/GraphML/MCP) reference` - 3 edges
8. `skills.sh Leaderboard` - 2 edges
9. `git-push Skill (installed)` - 2 edges
10. `git-push Skill (source copy)` - 2 edges

## Surprising Connections (you probably didn't know these)
- `Skills CLI (npx skills)` --semantically_similar_to--> `graphifyy PyPI Package`  [INFERRED] [semantically similar]
  .agents/skills/find-skills/SKILL.md → .claude/skills/graphify/SKILL.md
- `Decision to omit graphify PreToolUse hooks` --rationale_for--> `graphify Skill (main)`  [EXTRACTED]
  Skills.md → .claude/skills/graphify/SKILL.md
- `Skills.md Index` --references--> `find-skills Skill (agents source)`  [EXTRACTED]
  Skills.md → .agents/skills/find-skills/SKILL.md
- `Skills.md Index` --references--> `find-skills Skill (installed)`  [EXTRACTED]
  Skills.md → .claude/skills/find-skills/SKILL.md
- `Skills.md Index` --references--> `Skills CLI (npx skills)`  [EXTRACTED]
  Skills.md → .agents/skills/find-skills/SKILL.md

## Hyperedges (group relationships)
- **Skills Installed in .claude/skills** — _claude_skills_find_skills_skill_find_skills, _claude_skills_git_push_skill_git_push, _claude_skills_graphify_skill_graphify [EXTRACTED 1.00]
- **graphify Reference Documentation Set** — _claude_skills_graphify_references_add_watch_add_watch, _claude_skills_graphify_references_exports_exports, _claude_skills_graphify_references_extraction_spec_extraction_spec, _claude_skills_graphify_references_github_and_merge_github_and_merge, _claude_skills_graphify_references_hooks_hooks, _claude_skills_graphify_references_query_query, _claude_skills_graphify_references_transcribe_transcribe, _claude_skills_graphify_references_update_update [EXTRACTED 1.00]
- **Julián Identity & Writing-Voice Context** — julian_profile, vozjulian_style_guide, voz_julian_package [INFERRED 0.75]

## Communities (7 total, 3 thin omitted)

### Community 0 - "Skills Registry & Julian Context"
Cohesion: 0.38
Nodes (7): git-push Skill (installed), git-push Skill (source copy), Julián Profile / Bio, Decision to omit graphify PreToolUse hooks, Skills.md Index, voz-julian.skill Package, Voz y Estilo de Escritura — Julián

### Community 1 - "Graphify Core Skill"
Cohesion: 0.29
Nodes (7): Add URL & Watch Mode (reference), Extraction Subagent Spec (reference), GitHub Clone & Cross-repo Merge (reference), Commit Hook & CLAUDE.md Integration (reference), Incremental Update & Cluster-only (reference), graphify Skill (main), CLAUDE.md graphify Trigger Instruction

### Community 2 - "Skill Discovery & Package"
Cohesion: 0.60
Nodes (5): find-skills Skill (agents source), Skills CLI (npx skills), skills.sh Leaderboard, find-skills Skill (installed), graphifyy PyPI Package

### Community 3 - "Graph Database Exports"
Cohesion: 0.67
Nodes (3): Exports (Neo4j/FalkorDB/SVG/GraphML/MCP) reference, FalkorDB Export Target, Neo4j Export Target

## Knowledge Gaps
- **12 isolated node(s):** `Add URL & Watch Mode (reference)`, `Neo4j Export Target`, `FalkorDB Export Target`, `Extraction Subagent Spec (reference)`, `GitHub Clone & Cross-repo Merge (reference)` (+7 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `graphify Skill (main)` connect `Graphify Core Skill` to `Skills Registry & Julian Context`, `Skill Discovery & Package`, `Graph Database Exports`, `Query & Reflection Loop`, `Video/Audio Transcription`?**
  _High betweenness centrality (0.706) - this node is a cross-community bridge._
- **Why does `Skills.md Index` connect `Skills Registry & Julian Context` to `Graphify Core Skill`, `Skill Discovery & Package`?**
  _High betweenness centrality (0.502) - this node is a cross-community bridge._
- **Why does `Exports (Neo4j/FalkorDB/SVG/GraphML/MCP) reference` connect `Graph Database Exports` to `Graphify Core Skill`?**
  _High betweenness centrality (0.145) - this node is a cross-community bridge._
- **What connects `Add URL & Watch Mode (reference)`, `Neo4j Export Target`, `FalkorDB Export Target` to the rest of the system?**
  _12 weakly-connected nodes found - possible documentation gaps or missing edges._