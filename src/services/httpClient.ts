export interface RequestPolicy {
  timeoutMs?: number;
  retries?: number;
  signal?: AbortSignal;
}

const RETRYABLE_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

/**
 * Consistent network policy for third-party APIs. It prevents hung requests,
 * retries only transient failures, and preserves caller cancellation.
 */
export async function fetchWithPolicy(
  input: RequestInfo | URL,
  init: RequestInit = {},
  policy: RequestPolicy = {},
): Promise<Response> {
  const timeoutMs = policy.timeoutMs ?? 30_000;
  const method = (init.method ?? 'GET').toUpperCase();
  // Never replay mutations by default: a provider may have accepted a request
  // even when the client observed a transient 5xx/timeout.
  const retries = policy.retries ?? (['GET', 'HEAD', 'OPTIONS'].includes(method) ? 2 : 0);

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
    const onCallerAbort = () => controller.abort();
    policy.signal?.addEventListener('abort', onCallerAbort, { once: true });

    try {
      const response = await fetch(input, { ...init, signal: controller.signal });
      if (!RETRYABLE_STATUS.has(response.status) || attempt === retries) {
        return response;
      }

      const retryAfter = Number(response.headers.get('Retry-After'));
      const backoffMs = Number.isFinite(retryAfter)
        ? Math.min(retryAfter * 1000, 10_000)
        : Math.min(500 * 2 ** attempt, 5_000);
      await sleep(backoffMs + Math.floor(Math.random() * 100));
    } catch (error) {
      if (policy.signal?.aborted) throw error;
      if (isAbortError(error) && attempt === retries) {
        throw new Error(`Request timed out after ${timeoutMs}ms.`);
      }
      if (!isAbortError(error) && attempt === retries) throw error;
      await sleep(Math.min(500 * 2 ** attempt, 5_000));
    } finally {
      window.clearTimeout(timeout);
      policy.signal?.removeEventListener('abort', onCallerAbort);
    }
  }

  throw new Error('Request failed after retry budget was exhausted.');
}

export async function readErrorMessage(response: Response): Promise<string> {
  const fallback = `Request failed with HTTP ${response.status}.`;
  try {
    const body = await response.text();
    if (!body) return fallback;
    try {
      const parsed = JSON.parse(body) as { error?: { message?: string } | string; message?: string };
      if (typeof parsed.error === 'string') return parsed.error;
      if (parsed.error && typeof parsed.error.message === 'string') return parsed.error.message;
      if (typeof parsed.message === 'string') return parsed.message;
    } catch {
      // Some providers return HTML or plain text. Keep only a bounded message.
    }
    return body.slice(0, 500);
  } catch {
    return fallback;
  }
}
