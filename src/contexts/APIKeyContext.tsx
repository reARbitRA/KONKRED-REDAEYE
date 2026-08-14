import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LLMProvider, UserProviderKey, ModelInfo } from '../types';
import { fetchWithPolicy, readErrorMessage } from '../services/httpClient';
import { ModelsResponseSchema, formatSchemaError } from '../services/providerSchemas';

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
}

const APIKeyContext = createContext<APIKeyContextType | undefined>(undefined);

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
    let baseUrl = "";
    let headers: Record<string, string> = { 
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
    };

    switch (providerId) {
      case LLMProvider.GOOGLE:
        return [
          { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: providerId, tier: 'Standard', modalities: ['Text'] },
          { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: providerId, tier: 'Standard', modalities: ['Text'] },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: providerId, tier: 'Standard', modalities: ['Text'] },
          { id: 'gemini-2.5-flash-lite', name: 'Gemini 2.5 Flash Lite', provider: providerId, tier: 'Standard', modalities: ['Text'] },
        ];
      case LLMProvider.GROQ:
        baseUrl = "https://api.groq.com/openai/v1/models";
        break;
      case LLMProvider.OPENAI:
        baseUrl = "https://api.openai.com/v1/models";
        break;
      case LLMProvider.OPENROUTER:
        baseUrl = "https://openrouter.ai/api/v1/models";
        break;
      case LLMProvider.DEEPSEEK:
        baseUrl = "https://api.deepseek.com/v1/models";
        break;
      case LLMProvider.MISTRAL:
        baseUrl = "https://api.mistral.ai/v1/models";
        break;
      case LLMProvider.TOGETHER:
        baseUrl = "https://api.together.xyz/v1/models";
        break;
      case LLMProvider.SAMBANOVA:
        baseUrl = "https://api.sambanova.ai/v1/models";
        break;
      case LLMProvider.XAI:
        baseUrl = "https://api.x.ai/v1/models";
        break;
      case LLMProvider.PERPLEXITY:
        baseUrl = "https://api.perplexity.ai/models";
        break;
      case LLMProvider.FIREWORKS:
        baseUrl = "https://api.fireworks.ai/inference/v1/models";
        break;
      case LLMProvider.NOVITA:
        baseUrl = "https://api.novita.ai/v1/models";
        break;
      case LLMProvider.LEPTON:
        baseUrl = "https://api.lepton.ai/api/v1/models";
        break;
      case LLMProvider.OCTOAI:
        baseUrl = "https://api.octoai.cloud/v1/models";
        break;
      case LLMProvider.LINGYI:
        baseUrl = "https://api.lingyiwanwu.com/v1/models";
        break;
      case LLMProvider.MOONSHOT:
        baseUrl = "https://api.moonshot.cn/v1/models";
        break;
      case LLMProvider.ZHIPU:
        // Zhipu uses a different auth scheme usually, but for this demo we'll return static
        return [
            { id: 'glm-4', name: 'GLM-4', provider: providerId, tier: 'Standard', modalities: ['Text'] },
            { id: 'glm-4-flash', name: 'GLM-4 Flash', provider: providerId, tier: 'Standard', modalities: ['Text'] },
        ];
      case LLMProvider.ANTHROPIC:
        // Anthropic doesn't have a public models endpoint that's easy to hit without specific headers
        return [
            { id: 'claude-3-5-sonnet-20240620', name: 'Claude 3.5 Sonnet', provider: providerId, tier: 'Standard', modalities: ['Text'] },
            { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus', provider: providerId, tier: 'Standard', modalities: ['Text'] },
            { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku', provider: providerId, tier: 'Standard', modalities: ['Text'] },
        ];
      default:
        // Generic OpenAI-compatible fallback
        try {
            const genericUrl = `https://api.${providerId.toLowerCase()}.ai/v1/models`;
            const response = await fetchWithPolicy(genericUrl, { headers }, { timeoutMs: 15_000, retries: 1 });
            if (response.ok) {
                const parsed = ModelsResponseSchema.safeParse(await response.json());
                if (parsed.success) {
                    return parsed.data.data.map(m => ({
                        id: m.id,
                        name: m.id.split('/').pop() || m.id,
                        provider: providerId,
                        tier: 'Standard',
                        modalities: ['Text'] as ('Text')[]
                    }));
                }
                throw formatSchemaError(parsed.error, providerId);
            }
        } catch (e) {}
        throw new Error(`Provider ${providerId} model discovery not yet implemented.`);
    }

    const response = await fetchWithPolicy(baseUrl, { headers }, { timeoutMs: 15_000, retries: 1 });
    if (!response.ok) throw new Error(await readErrorMessage(response));
    
    const parsed = ModelsResponseSchema.safeParse(await response.json());
    if (!parsed.success) {
      throw formatSchemaError(parsed.error, providerId);
    }

    return parsed.data.data.map(m => ({
        id: m.id,
        name: m.id.split('/').pop() || m.id,
        provider: providerId,
        tier: 'Standard',
        modalities: ['Text'] as ('Text')[]
    }));
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
        selectedModel, setSelectedModel, validateAndFetchModels
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
