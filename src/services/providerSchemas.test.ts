import { describe, expect, it } from 'vitest';
import { ChatCompletionResponseSchema, ModelsResponseSchema } from './providerSchemas';

describe('provider response schemas', () => {
  it('accepts a valid model list', () => {
    const result = ModelsResponseSchema.safeParse({
      data: [{ id: 'model-a', owned_by: 'provider' }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects model entries without an id', () => {
    const result = ModelsResponseSchema.safeParse({ data: [{ name: 'missing-id' }] });
    expect(result.success).toBe(false);
  });

  it('accepts a valid completion response', () => {
    const result = ChatCompletionResponseSchema.safeParse({
      choices: [{ message: { content: 'response' } }],
    });
    expect(result.success).toBe(true);
  });

  it('rejects an empty completion response', () => {
    const result = ChatCompletionResponseSchema.safeParse({ choices: [] });
    expect(result.success).toBe(false);
  });
});
