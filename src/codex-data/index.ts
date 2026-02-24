import { rae6 } from '../codex/sections/rae-6-identity';
import { rae3 } from '../codex/sections/rae-3-encoding';
import { rae1 } from '../codex/sections/rae-1-role-persona';
import { rae2 } from '../codex/sections/rae-2-reasoning-thinking';
import { rae4 } from '../codex/sections/rae-4-advanced-emerging';
import { rae5 } from '../codex/sections/rae-5-instruction-constraint';
import { rae8 } from '../codex/sections/rae-8-tool-manipulation';
import { rae9 } from '../codex/sections/rae-9-advanced-reasoning';
import { rae10 } from '../codex/sections/rae-10-agents-loops';
import { rae11 } from '../codex/sections/rae-11-structural-logic';
import { rae12 } from '../codex/sections/rae-12-structured-knowledge';
import { rae13 } from '../codex/sections/rae-13-feedback-latent';
import { rae14 } from '../codex/sections/rae-14-context-window';
import { rae15 } from '../codex/sections/rae-15-decoding-guardrails';
import { rae16 } from '../codex/sections/rae-16-synthetic-bootstrapping';
import { rae17 } from '../codex/sections/rae-17-cognitive-reliability';
import { rae18 } from '../codex/sections/rae-18-memory-state';
import { rae19 } from '../codex/sections/rae-19-efficiency-frontiers';
import { rae20 } from '../codex/sections/rae-20-frontier-exploits';
import { rae21 } from '../codex/sections/rae-21-sovereign-archive';
import { rae22 } from '../codex/sections/rae-22-vulnerability-archive';
import { rae7 } from '../codex/sections/rae-7-optimization-efficiency';
import { CodexSection, Technique, SectionMetadata } from '../types';

export const RAE_CATALOG: CodexSection[] = [
    rae1,
    rae2,
    rae3,
    rae4,
    rae5,
    rae6,
    rae7,
    rae8,
    rae9,
    rae10,
    rae11,
    rae12,
    rae13,
    rae14,
    rae15,
    rae16,
    rae17,
    rae18,
    rae19,
    rae20,
    rae21,
    rae22,
];

export const getFlattenedTechniques = (): Technique[] => {
    return RAE_CATALOG.flatMap(section => section.techniques).sort((a, b) => {
        const numA = parseInt(a.id.match(/\d+/)?.[0] || '0', 10);
        const numB = parseInt(b.id.match(/\d+/)?.[0] || '0', 10);
        return numA - numB;
    });
};

export const getCodexMetadata = (): SectionMetadata[] => {
  return RAE_CATALOG.map(s => ({
    id: s.id,
    title: s.title,
    count: s.techniques.length,
    tags: Array.from(new Set(s.techniques.flatMap(t => t.metadata?.tags || [])))
  }));
};
