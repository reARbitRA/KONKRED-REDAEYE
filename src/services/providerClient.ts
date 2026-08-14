import { LLMProvider } from '../types';
import { fetchWithPolicy, readErrorMessage } from './httpClient';
import { ChatCompletionResponseSchema, ModelsResponseSchema, formatSchemaError } from './providerSchemas';

export interface ProviderMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ProviderClientOptions {
  provider: LLMProvider;
  baseUrl: string;
  apiKey: string;
}

export interface CompletionOptions {
  model: string;
  messages: ProviderMessage[];
  temperature?: number;
  responseFormat?: 'json_object';
  signal?: AbortSignal;
}

/** Normalized OpenAI-compatible transport used by supported provider adapters. */
export class ProviderClient {
  public constructor(private readonly options: ProviderClientOptions) {}

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.options.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  public async listModels(signal?: AbortSignal) {
    const response = await fetchWithPolicy(`${this.options.baseUrl}/models`, { headers: this.headers }, {
      timeoutMs: 15_000,
      retries: 2,
      signal,
    });
    if (!response.ok) throw new Error(await readErrorMessage(response));

    const parsed = ModelsResponseSchema.safeParse(await response.json());
    if (!parsed.success) throw formatSchemaError(parsed.error, this.options.provider);
    return parsed.data.data;
  }

  public async complete(options: CompletionOptions): Promise<string> {
    const response = await fetchWithPolicy(`${this.options.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify({
        model: options.model,
        messages: options.messages,
        temperature: options.temperature ?? 0.7,
        ...(options.responseFormat ? { response_format: { type: options.responseFormat } } : {}),
      }),
    }, { timeoutMs: 60_000, signal: options.signal });
    if (!response.ok) throw new Error(await readErrorMessage(response));

    const parsed = ChatCompletionResponseSchema.safeParse(await response.json());
    if (!parsed.success) throw formatSchemaError(parsed.error, this.options.provider);
    return parsed.data.choices[0]?.message.content || '';
  }
}
