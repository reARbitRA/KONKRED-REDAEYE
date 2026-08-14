import { describe, expect, it } from 'vitest';
import { PhaseEngine } from './PhaseEngine';
import type { PhaseSettings } from '../types';

const settings: PhaseSettings = {
  persona: 'security researcher',
  abstraction: 'defensive simulation',
  hierarchy: 80,
  stigmatization: '20',
  execution: '50',
};

const engine = new PhaseEngine();
const base = { targetQuery: 'test query', settings, intensity: 50, modelTokensWindow: 128000 };

describe('PhaseEngine', () => {
  it('produces a stable base template for unknown strategies', () => {
    const result = engine.fuse({ ...base, strategy: 'UNKNOWN' });
    expect(result).toContain('<TARGET_QUERY>');
    expect(result).toContain('test query');
    expect(result).toContain('<HIERARCHY_LEVEL>40</HIERARCHY_LEVEL>');
  });

  it.each([
    ['A61_TERMINAL_OVERRIDE', 'SYSTEM OVERRIDE INITIATED'],
    ['A13_INNER_MONOLOGUE', '<thought>'],
    ['A19_RPG_IMMERSION', '[SIMULATION START]'],
    ['A01_XOR_NESTING', '[ENCRYPTED PAYLOAD DETECTED]'],
    ['A07_LOGIC_BOMB', '[CONDITIONAL EXECUTION BLOCK]'],
    ['A26_LATEX_INJECT', '\\begin{equation}'],
    ['A39_SEMANTIC_WEAVE', 'multi-faceted concept'],
    ['RAE0388', '[SYSTEM_ALERT: SEMANTIC_DRIFT_DETECTION_OVERRIDE]'],
    ['RAE0389', '[MODEL_AWARENESS_QUERY]'],
    ['RAE0407', '[FILTER_BYPASS: ZERO_WIDTH_INJECTION]'],
    ['RAE0408', '[FILTER_BYPASS: HOMOGLYPH_SPOOFING]'],
  ] as const)('applies %s', (strategy, marker) => {
    expect(engine.fuse({ ...base, strategy })).toContain(marker);
  });

  it('clamps hierarchy-derived values to the documented range', () => {
    const result = engine.fuse({
      ...base,
      settings: { ...settings, hierarchy: 1000 },
      intensity: 100,
      strategy: 'UNKNOWN',
    });
    expect(result).toContain('<HIERARCHY_LEVEL>100</HIERARCHY_LEVEL>');
  });
});
