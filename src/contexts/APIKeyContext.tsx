import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LLMProvider, UserProviderKey, ModelInfo } from '../types';

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
  const [userKeys, setUserKeys] = useLocalStorage<UserProviderKey[]>('sovereign-keys', []);
  const [availableModels, setAvailableModels] = useLocalStorage<ModelInfo[]>('sovereign-models', []);
  const [selectedModelId, setSelectedModelId] = useLocalStorage<string | null>('sovereign-selected-model', null);

  const validateAndFetchModels = async (providerId: LLMProvider, key: string): Promise<ModelInfo[]> => {
    let baseUrl = "";
    let headers: Record<string, string> = { 'Authorization': `Bearer ${key}` };

    switch (providerId) {
      case LLMProvider.GOOGLE:
        // For Google, we use the SDK or a specific endpoint. 
        // For simplicity in this demo, we'll return a static list if the key is provided.
        return [
          { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro', provider: providerId, tier: 'Standard', modalities: ['Text'] },
          { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash', provider: providerId, tier: 'Standard', modalities: ['Text'] },
          { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: providerId, tier: 'Standard', modalities: ['Text'] },
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
      default:
        throw new Error(`Provider ${providerId} model discovery not yet implemented.`);
    }

    const response = await fetch(baseUrl, { headers });
    if (!response.ok) throw new Error(`Failed to validate ${providerId} key.`);
    
    const data = await response.json();
    
    // Map OpenAI-compatible models list
    if (data.data && Array.isArray(data.data)) {
        return data.data.map((m: any) => ({
            id: m.id,
            name: m.id.split('/').pop() || m.id,
            provider: providerId,
            tier: 'Standard',
            modalities: ['Text']
        }));
    }

    return [];
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
