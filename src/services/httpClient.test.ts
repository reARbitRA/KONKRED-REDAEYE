import { describe, expect, it, vi, afterEach } from 'vitest';
import { fetchWithPolicy, readErrorMessage } from './httpClient';

describe('fetchWithPolicy', () => {
  afterEach(() => vi.restoreAllMocks());

  it('retries transient GET failures and then succeeds', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValueOnce(new Response('', { status: 503 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    const response = await fetchWithPolicy(
      'https://example.test/models',
      {},
      { retries: 1, timeoutMs: 100 },
    );

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not replay POST requests by default', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('', { status: 503 }));

    const response = await fetchWithPolicy(
      'https://example.test/chat',
      { method: 'POST' },
      { timeoutMs: 100 },
    );

    expect(response.status).toBe(503);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('extracts bounded JSON provider error messages', async () => {
    const response = new Response(JSON.stringify({ error: { message: 'rate limited' } }), {
      status: 429,
    });
    await expect(readErrorMessage(response)).resolves.toBe('rate limited');
  });
});
