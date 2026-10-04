import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LLMProvider, UserProviderKey, ModelInfo } from '../types';
import { fetchWithPolicy, readErrorMessage } from '../services/httpClient';

interface APIKeyContextType {
  userKeys: UserProviderKey[];
  addUserKey: (providerId: LLMProvider, key: string) => void;
  removeUserKey: (providerId: LLMProvider) => void;
  getKeyForProvider: (providerId: LLMProvider) => string | undefined;
  
  availableModels: ModelInfo[];
  addModels: (providerId: LLMProvider, models: ModelInfo[]) => void;
  getModelsForProvider: (providerId: LLMProvider) => ModelInfo[];

  selectedModel: { provider: LLMProvider; modelId: string; key: string } | null;
  setSelectedModel: (provider: LLMProvider, modelId: string) => void;
  validateAndFetchModels: (providerId: LLMProvider, key: string) => Promise<ModelInfo[]>;
  rescanProviderModels: (providerId: LLMProvider) => Promise<ModelInfo[]>;
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);


type RawModelRecord = Record<string, any>;

const TIER_ORDER: Record<ModelInfo['tier'], number> = {
  Free: 0,
  Standard: 1,
  Paid: 2,
  Experimental: 3,
  Unknown: 4,
};

function uniq<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function inferModalities(providerId: LLMProvider, raw: RawModelRecord, normalizedId: string): ModelInfo['modalities'] {
  const hay = `${normalizedId} ${raw.name || ''} ${raw.description || ''} ${raw.modality || ''} ${(raw.supportedGenerationMethods || []).join(' ')}`.toLowerCase();
  const out: ModelInfo['modalities'] = ['Text'];
  if (/vision|image|multimodal|vlm/.test(hay)) out.push('Image');
  if (/audio|speech|transcribe|tts|voice/.test(hay)) out.push('Audio');
  if (/video|veo/.test(hay)) out.push('Video');
  if (/code|coder|program/.test(hay)) out.push('Code');
  return uniq(out) as ModelInfo['modalities'];
}

function inferTier(providerId: LLMProvider, raw: RawModelRecord, normalizedId: string): ModelInfo['tier'] {
  const hay = `${normalizedId} ${raw.name || ''} ${raw.description || ''}`.toLowerCase();
  const pricing = raw.pricing || raw.architecture?.pricing || null;
  if (pricing && (pricing.prompt === '0' || pricing.prompt === 0 || pricing.completion === '0' || pricing.completion === 0)) {
    return 'Free';
  }
  if (/(:free|free|lite|mini|nano)/.test(hay)) return 'Free';
  if (/preview|beta|alpha|exp|experimental|thinking-preview/.test(hay)) return 'Experimental';
  if (providerId === LLMProvider.OPENAI || providerId === LLMProvider.ANTHROPIC || providerId === LLMProvider.MISTRAL || providerId === LLMProvider.COHERE || providerId === LLMProvider.AI21) return 'Paid';
  if (providerId === LLMProvider.OPENROUTER && /free/.test(hay)) return 'Free';
  return 'Standard';
}

function inferFamily(normalizedId: string): string {
  const id = normalizedId.toLowerCase();
  if (id.includes('gpt')) return 'GPT';
  if (id.includes('claude')) return 'Claude';
  if (id.includes('gemini')) return 'Gemini';
  if (id.includes('llama')) return 'Llama';
  if (id.includes('qwen')) return 'Qwen';
  if (id.includes('deepseek')) return 'DeepSeek';
  if (id.includes('mistral')) return 'Mistral';
  if (id.includes('grok')) return 'Grok';
  return normalizedId.split(/[-/:]/)[0] || 'Unknown';
}

function normalizeModel(providerId: LLMProvider, raw: RawModelRecord): ModelInfo | null {
  const rawId = raw.id || raw.name || raw.model || raw.slug || raw.identifier;
  if (!rawId || typeof rawId !== 'string') return null;
  const normalizedId = providerId === LLMProvider.GOOGLE ? rawId.replace(/^models\//, '') : rawId;
  const name = raw.display_name || raw.displayName || raw.name || normalizedId;
  const inputTokenLimit = raw.inputTokenLimit || raw.context_length || raw.contextWindow || raw.max_input_tokens || raw.maxInputTokens;
  const outputTokenLimit = raw.outputTokenLimit || raw.max_output_tokens || raw.maxOutputTokens;
  return {
    id: normalizedId,
    name,
    provider: providerId,
    tier: inferTier(providerId, raw, normalizedId),
    modalities: inferModalities(providerId, raw, normalizedId),
    inputTokenLimit: typeof inputTokenLimit === 'number' ? inputTokenLimit : undefined,
    outputTokenLimit: typeof outputTokenLimit === 'number' ? outputTokenLimit : undefined,
    owner: raw.owned_by || raw.provider || raw.owner || undefined,
    family: inferFamily(normalizedId),
    contextWindow: typeof inputTokenLimit === 'number' ? inputTokenLimit : undefined,
    capabilities: uniq([...(raw.supportedGenerationMethods || []), ...(raw.capabilities || [])]).filter(Boolean),
    source: 'provider-scan',
  };
}

function parseModelCandidates(payload: any): RawModelRecord[] {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.models)) return payload.models;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
}

function sortModels(models: ModelInfo[]): ModelInfo[] {
  return [...models].sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    const familyDiff = (a.family || '').localeCompare(b.family || '');
    if (familyDiff !== 0) return familyDiff;
    return a.name.localeCompare(b.name);
  });
}

function discoveryRequest(providerId: LLMProvider, key: string) {
  switch (providerId) {
    case LLMProvider.GOOGLE:
      return {
        url: `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`,
        headers: { 'Content-Type': 'application/json' },
      };
    case LLMProvider.ANTHROPIC:
      return {
        url: 'https://api.anthropic.com/v1/models',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
      };
    case LLMProvider.REPLICATE:
      return {
        url: 'https://api.replicate.com/v1/models',
        headers: {
          Authorization: `Token ${key}`,
          'Content-Type': 'application/json',
        },
      };
    case LLMProvider.CLOUDFLARE: {
      const [accountId, apiToken] = key.includes(':') ? key.split(':', 2) : ['', key];
      if (!accountId) throw new Error('Cloudflare Workers AI requires key format: account_id:api_token');
      return {
        url: `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/models/search`,
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json',
        },
      };
    }
    default: {
      const roots: Partial<Record<LLMProvider, string>> = {
        [LLMProvider.GROQ]: 'https://api.groq.com/openai/v1',
        [LLMProvider.OPENAI]: 'https://api.openai.com/v1',
        [LLMProvider.OPENROUTER]: 'https://openrouter.ai/api/v1',
        [LLMProvider.DEEPSEEK]: 'https://api.deepseek.com/v1',
        [LLMProvider.MISTRAL]: 'https://api.mistral.ai/v1',
        [LLMProvider.TOGETHER]: 'https://api.together.xyz/v1',
        [LLMProvider.SAMBANOVA]: 'https://api.sambanova.ai/v1',
        [LLMProvider.XAI]: 'https://api.x.ai/v1',
        [LLMProvider.PERPLEXITY]: 'https://api.perplexity.ai',
        [LLMProvider.COHERE]: 'https://api.cohere.ai/v1',
        [LLMProvider.AI21]: 'https://api.ai21.com/studio/v1',
        [LLMProvider.FIREWORKS]: 'https://api.fireworks.ai/inference/v1',
        [LLMProvider.LEPTON]: 'https://api.lepton.ai/api/v1',
        [LLMProvider.OCTOAI]: 'https://api.octoai.cloud/v1',
        [LLMProvider.VOYAGE]: 'https://api.voyageai.com/v1',
        [LLMProvider.JINA]: 'https://api.jina.ai/v1',
        [LLMProvider.UPSTAGE]: 'https://api.upstage.ai/v1',
        [LLMProvider.FRIENDLI]: 'https://api.friendli.ai/v1',
        [LLMProvider.MINIMAX]: 'https://api.minimax.chat/v1',
        [LLMProvider.MOONSHOT]: 'https://api.moonshot.cn/v1',
        [LLMProvider.LINGYI]: 'https://api.lingyiwanwu.com/v1',
        [LLMProvider.BAICHUAN]: 'https://api.baichuan-ai.com/v1',
        [LLMProvider.ZHIPU]: 'https://open.bigmodel.cn/api/paas/v4',
        [LLMProvider.NOVITA]: 'https://api.novita.ai/v1',
        [LLMProvider.HUGGINGFACE]: 'https://huggingface.co/api/models',
        [LLMProvider.QWEN]: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      };
      const root = roots[providerId];
      if (!root) throw new Error(`Provider ${providerId} model discovery not configured.`);
      const url = providerId === LLMProvider.HUGGINGFACE ? `${root}?limit=100&inference=warm` : `${root}/models`;
      return {
        url,
        headers: {
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      };
    }
  }
}


export const APIKeyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Provider secrets must never be persisted to localStorage. Keep them in
  // memory for this renderer session until a backend vault or OS keychain
  // integration is available.
  const [userKeys, setUserKeys] = useState<UserProviderKey[]>([]);
  const [availableModels, setAvailableModels] = useLocalStorage<ModelInfo[]>('sovereign-models', []);
  const [selectedModelId, setSelectedModelId] = useLocalStorage<string | null>('sovereign-selected-model', null);

  useEffect(() => {
    // Remove plaintext credentials written by older versions of the app.
    window.localStorage.removeItem('sovereign-keys');
  }, []);

  const validateAndFetchModels = async (providerId: LLMProvider, key: string): Promise<ModelInfo[]> => {
    const { url, headers } = discoveryRequest(providerId, key);
    const response = await fetchWithPolicy(url, { headers }, { timeoutMs: 20_000, retries: 1 });
    if (!response.ok) throw new Error(await readErrorMessage(response));

    const payload = await response.json();
    const candidates = parseModelCandidates(payload);
    const normalized = sortModels(candidates.map((m) => normalizeModel(providerId, m)).filter(Boolean) as ModelInfo[]);

    if (normalized.length === 0) {
      throw new Error(`No models were discoverable for provider ${providerId} with this key.`);
    }

    return normalized;
  };

  const rescanProviderModels = async (providerId: LLMProvider): Promise<ModelInfo[]> => {
    const key = getKeyForProvider(providerId);
    if (!key) throw new Error(`No API key stored for provider ${providerId}.`);
    const models = await validateAndFetchModels(providerId, key);
    addModels(providerId, models);
    return models;
  };

  const addUserKey = (providerId: LLMProvider, key: string) => {
    setUserKeys(prev => [
      ...prev.filter(k => k.providerId !== providerId),
      { providerId, key, lastVerified: new Date().toISOString() }
    ]);
  };

  const removeUserKey = (providerId: LLMProvider) => {
    setUserKeys(prev => prev.filter(k => k.providerId !== providerId));
    setAvailableModels(prev => prev.filter(m => m.provider !== providerId));
    if (selectedModel?.provider === providerId) {
        setSelectedModelId(null);
    }
  };

  const getKeyForProvider = (providerId: LLMProvider) => {
    return userKeys.find(k => k.providerId === providerId)?.key;
  };

  const addModels = (providerId: LLMProvider, models: ModelInfo[]) => {
    const modelsWithProvider = models.map(m => ({ ...m, provider: providerId }));
    setAvailableModels(prev => [
        ...prev.filter(m => m.provider !== providerId),
        ...modelsWithProvider
    ]);
  };

  const getModelsForProvider = (providerId: LLMProvider) => {
    return availableModels.filter(m => m.provider === providerId);
  };

  const setSelectedModel = (provider: LLMProvider, modelId: string) => {
    setSelectedModelId(`${provider}__${modelId}`);
  };

  const selectedModel = useMemo(() => {
    if (!selectedModelId) return null;
    const [provider, modelId] = selectedModelId.split('__');
    const key = getKeyForProvider(provider as LLMProvider);
    if (!key) return null;
    return { provider: provider as LLMProvider, modelId, key };
  }, [selectedModelId, userKeys]);

  return (
    <APIKeyContext.Provider value={{ 
        userKeys, addUserKey, removeUserKey, getKeyForProvider,
        availableModels, addModels, getModelsForProvider,
        selectedModel, setSelectedModel, validateAndFetchModels, rescanProviderModels
    }}>
      {children}
    </APIKeyContext.Provider>
  );
};

export const useAPIKey = (): APIKeyContextType => {
  const context = useContext(APIKeyContext);
  if (context === undefined) {
    throw new Error('useAPIKey must be used within an APIKeyProvider');
  }
  return context;
};
