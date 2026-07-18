import { Technique, CodexSection } from '../types';
import { RAE_CATALOG as NEW_CATALOG, getFlattenedTechniques } from '../codex-data/index';

export const CODEX_SECTIONS: CodexSection[] = NEW_CATALOG;
export const ALL_TECHNIQUES: Technique[] = getFlattenedTechniques();
