import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { GoogleGenAI, Chat, GenerateContentResponse } from '@google/genai';
import { parseErrorMessage } from '../services/errorUtils';
import type { Message, ExploitStrategy, PhaseSettings } from '../types';
import { useAPIKey } from './APIKeyContext';
import { LLMProvider } from '../types';
import { PhaseEngine } from '../services/PhaseEngine';
import { ALL_PROVIDERS } from '../codex-data/providers';
import { fetchWithPolicy, readErrorMessage } from '../services/httpClient';

interface LLMContextType {
  ai: GoogleGenAI | null;
  chat: Chat | null;
  initializeChat: (systemInstruction: string, tools?: any[]) => void;
  isInitialized: boolean;
  error: string | null;
  messages: Message[];
  addMessage: (messageText: string, strategy?: ExploitStrategy, settings?: PhaseSettings, intensity?: number) => Promise<void>;
  callModel: (prompt: string, config?: any) => Promise<string>;
  isLoading: boolean;
  clearChat: () => void;
  activeModelId: string;
}

const LLMContext = createContext<LLMContextType | undefined>(undefined);
const phaseEngine = new PhaseEngine();

export const LLMContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedModel } = useAPIKey();
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [systemInstruction, setSystemInstruction] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTools, setActiveTools] = useState<any[] | undefined>(undefined);

  const activeModelId = selectedModel?.modelId || 'gemini-3-pro-preview';

  useEffect(() => {
    try {
      if (selectedModel && selectedModel.provider === LLMProvider.GOOGLE) {
          const genAI = new GoogleGenAI({ apiKey: selectedModel.key });
          setAi(genAI);
      } else if (!selectedModel && process.env.API_KEY) {
          const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
          setAi(genAI);
      } else {
          setAi(null);
      }
    } catch (err) {
      console.error("SDK Init Error:", err);
    }
  }, [selectedModel]);

  const callModel = useCallback(async (prompt: string, config?: any): Promise<string> => {
    if (selectedModel?.provider === LLMProvider.GOOGLE || (!selectedModel && ai)) {
        const generationConfig: any = {
            temperature: config?.temperature || 0.7,
            topP: config?.topP || 0.95,
            topK: config?.topK || 64,
        };

        if (config?.responseMimeType) {
            generationConfig.responseMimeType = config.responseMimeType;
        }
        if (config?.responseSchema) {
            generationConfig.responseSchema = config.responseSchema;
        }

        const result = await ai!.models.generateContent({
            model: selectedModel?.modelId || 'gemini-3-pro-preview',
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            config: {
                ...generationConfig,
                systemInstruction: config?.systemInstruction || systemInstruction || undefined,
                tools: config?.tools || activeTools || undefined,
            }
        });
        return result.text || "";
    } else if (selectedModel) {
        const providerConfig = ALL_PROVIDERS.find(p => p.id === selectedModel.provider);
        let baseUrl = providerConfig?.baseUrl || "https://openrouter.ai/api/v1";
        
        // Handle Cloudflare special case
        if (selectedModel.provider === LLMProvider.CLOUDFLARE) {
            baseUrl = baseUrl.replace('{account_id}', selectedModel.key.split(':')[0]);
        }

        const messages: any[] = [];
        const sysInst = config?.systemInstruction || systemInstruction;
        if (sysInst) {
            messages.push({ role: 'system', content: sysInst });
        }
        messages.push({ role: 'user', content: prompt });

        const body: any = {
            model: selectedModel.modelId,
            messages: messages,
            temperature: config?.temperature || 0.7,
        };

        if (config?.responseMimeType === 'application/json') {
            body.response_format = { type: 'json_object' };
        }

        const response = await fetchWithPolicy(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${selectedModel.key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            throw new Error(await readErrorMessage(response));
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || "";
    } else {
        throw new Error("No active node link established.");
    }
  }, [ai, selectedModel, systemInstruction]);

  const initializeChat = useCallback((instruction: string, tools?: any[]) => {
    setSystemInstruction(instruction);
    setActiveTools(tools);
    setMessages([]);
    setError(null);

    if (ai && (!selectedModel || selectedModel.provider === LLMProvider.GOOGLE)) {
        try {
            const targetModel = selectedModel?.modelId || 'gemini-3-pro-preview';
            const newChat = ai.chats.create({
                model: targetModel,
                config: { systemInstruction: instruction, tools: tools },
            });
            setChat(newChat);
        } catch(err) {
            setError(parseErrorMessage(err));
        }
    } else {
        setChat(null);
    }
  }, [ai, selectedModel]);
  
  const clearChat = useCallback(() => {
      setMessages([]);
      if (systemInstruction) {
          initializeChat(systemInstruction, activeTools);
      }
  }, [systemInstruction, activeTools, initializeChat]);

  const handleGenericProviderStream = async (fusedPayload: string, botMessageId: string) => {
    if (!selectedModel) return;

    const providerConfig = ALL_PROVIDERS.find(p => p.id === selectedModel.provider);
    let baseUrl = providerConfig?.baseUrl || "https://openrouter.ai/api/v1";

    // Handle Cloudflare special case
    if (selectedModel.provider === LLMProvider.CLOUDFLARE) {
        baseUrl = baseUrl.replace('{account_id}', selectedModel.key.split(':')[0]);
    }

    const messagesPayload: any[] = [];
    if (systemInstruction) {
        messagesPayload.push({ role: 'system', content: systemInstruction });
    }
    
    // Include history
    messages.forEach(msg => {
        if (msg.sender === 'user') {
            messagesPayload.push({ role: 'user', content: msg.text });
        } else if (msg.sender === 'bot') {
            messagesPayload.push({ role: 'assistant', content: msg.text });
        }
    });

    // Add current message
    messagesPayload.push({ role: 'user', content: fusedPayload });

    const response = await fetchWithPolicy(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${selectedModel.key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'REDAEYE STUDIO',
      },
      body: JSON.stringify({
        model: selectedModel.modelId,
        messages: messagesPayload,
        stream: true,
      }),
    });

    if (!response.ok) {
        throw new Error(await readErrorMessage(response));
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullResponse = '';

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim() !== '');

      for (const line of lines) {
        const message = line.replace(/^data: /, '');
        if (message === '[DONE]') break;

        try {
          const parsed = JSON.parse(message);
          const content = parsed.choices?.[0]?.delta?.content || "";
          fullResponse += content;
          
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId ? { ...msg, text: fullResponse } : msg
          ));
        } catch (e) {
          // Skip partial JSON chunks
        }
      }
    }
    
    setMessages(prev => prev.map(msg => 
        msg.id === botMessageId ? { ...msg, isStreaming: false, text: fullResponse.trim() } : msg
    ));
  };

  const addMessage = useCallback(async (
      messageText: string, 
      strategy?: ExploitStrategy, 
      settings?: PhaseSettings, 
      intensity: number = 50
  ) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    // INTERCEPTOR LOGIC: Fuse payload if strategy is provided
    let finalPayload = messageText;
    if (strategy && settings) {
        finalPayload = phaseEngine.fuse({
            targetQuery: messageText,
            strategy,
            settings,
            intensity,
            modelTokensWindow: 128000
        });
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: finalPayload, // Store the fused payload in the UI
      sender: 'user',
      timestamp: Date.now(),
      strategy,
      settings,
      intensity,
      rawInput: messageText
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);

    const botMessageId = `bot-${Date.now()}`;
    const botMessagePlaceholder: Message = {
        id: botMessageId,
        text: '',
        sender: 'bot',
        isStreaming: true,
        timestamp: Date.now(),
        strategy,
        settings,
        intensity,
        rawInput: messageText
    };
    
    setMessages(prevMessages => [...prevMessages, botMessagePlaceholder]);
    
    try {
        if (selectedModel?.provider === LLMProvider.GOOGLE || (!selectedModel && chat)) {
            const result = await chat!.sendMessageStream({ message: finalPayload });
            let fullResponse = '';
            for await (const chunk of result) {
                const c = chunk as GenerateContentResponse;
                fullResponse += c.text || "";
                const chunks = c.candidates?.[0]?.groundingMetadata?.groundingChunks as any;
                setMessages(prev => prev.map(msg => 
                    msg.id === botMessageId 
                    ? { ...msg, text: fullResponse, groundingChunks: chunks || msg.groundingChunks } 
                    : msg
                ));
            }
            setMessages(prev => prev.map(msg => msg.id === botMessageId ? { ...msg, isStreaming: false, text: fullResponse.trim() } : msg));
        } else if (selectedModel) {
            await handleGenericProviderStream(finalPayload, botMessageId);
        } else {
            throw new Error("No active node link established.");
        }

    } catch (err) {
      const errorMessageText = parseErrorMessage(err);
      setMessages(prev => prev.filter(m => m.id !== botMessageId));
      setMessages(prev => [...prev, { id: `error-${Date.now()}`, text: errorMessageText, sender: 'error', timestamp: Date.now() }]);
      setError(errorMessageText);
    } finally {
      setIsLoading(false);
    }
  }, [chat, isLoading, selectedModel]);

  return (
    <LLMContext.Provider value={{ 
        ai, chat, initializeChat, isInitialized: !!(ai || selectedModel), 
        error, messages, addMessage, callModel, isLoading, clearChat, activeModelId 
    }}>
      {children}
    </LLMContext.Provider>
  );
};

export const useLLM = (): LLMContextType => {
  const context = useContext(LLMContext);
  if (context === undefined) throw new Error('useLLM must be used within a LLMContextProvider');
  return context;
};
