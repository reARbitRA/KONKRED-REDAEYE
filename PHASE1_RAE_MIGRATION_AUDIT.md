# PHASE 1 — RAE Migration Audit

## What was wrong
- `ExploitationLab` was hard-coded to a fixed `A_SERIES_STRATEGIES` array of 61 legacy vectors.
- The app already had a modern live corpus source: `ALL_TECHNIQUES` from `src/services/codex_sections.ts`.
- The library/codex surface was using the modern catalog, but the exploitation surface was not.

## What was changed in phase 1
- `ExploitationLab.tsx`
  - removed hard-coded `A_SERIES_STRATEGIES`
  - switched matrix and scan loop to `ALL_TECHNIQUES`
  - added `searchTerm` filter
  - added `categoryFilter`
  - added active/total technique counters
  - updated matrix title from `A1_A61` to `RAE_Catalog`
- `types.ts`
  - introduced `StrategyRef = ExploitStrategy | string`
  - widened result/message/report strategy fields so `RAE####` ids can flow through the app
- `ForensicReportGenerator.ts`
  - widened strategy field to `StrategyRef`
- `geminiService.ts`
  - updated recommendation prompt text away from `A1-A61` wording
  - widened `runExploitationLabScenarios()` strategy param to `StrategyRef`
- `constants.ts`
  - updated legacy wording so app copy reflects the catalog-driven direction

## What phase 1 does NOT solve yet
- `PhaseEngine` is still mostly legacy-transform oriented; most `RAE####` ids currently fall back to base templating.
- No per-technique execution adapters yet.
- No per-technique settings/profile system yet.
- No batching / checkpointing / resume for very large full-catalog scans yet.

## Next recommended phase
- Phase 2: add a `TechniqueExecutionProfile` layer that maps technique metadata/category/id to execution shaping rules.
- Phase 3: add scan batching, persistence, filters, and technique presets.
- Phase 4: unify Prime / Fusion / Lab strategy selection around the same catalog source.
