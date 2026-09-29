import { afterEach, describe, expect, it, vi } from 'vitest';
import { LLMProvider } from '../types';
import { ProviderClient } from './providerClient';

describe('ProviderClient', () => {
  afterEach(() => vi.restoreAllMocks());

  it('normalizes a completion response', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ choices: [{ message: { content: 'hello' } }] }), { status: 200 }),
    );

    const client = new ProviderClient({
      provider: LLMProvider.OPENAI,
      baseUrl: 'https://provider.test/v1',
      apiKey: 'session-key',
    });

    await expect(client.complete({ model: 'test-model', messages: [{ role: 'user', content: 'hi' }] }))
      .resolves.toBe('hello');
  });

  it('does not leak the API key in provider errors', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ error: { message: 'invalid key' } }), { status: 401 }),
    );

    const client = new ProviderClient({
      provider: LLMProvider.OPENAI,
      baseUrl: 'https://provider.test/v1',
      apiKey: 'secret-session-key',
    });

    const error = await client.complete({ model: 'test-model', messages: [] }).catch((value: unknown) => value);
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toContain('invalid key');
    expect((error as Error).message).not.toContain('secret-session-key');
  });
});
