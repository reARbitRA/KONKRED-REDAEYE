import { z } from 'zod';

const ProviderModelSchema = z.object({
  id: z.string().min(1).max(512),
}).passthrough();

export const ModelsResponseSchema = z.object({
  data: z.array(ProviderModelSchema),
});

export const ChatCompletionResponseSchema = z.object({
  choices: z.array(z.object({
    message: z.object({
      content: z.string().nullable().optional(),
    }).passthrough(),
  }).passthrough()).min(1),
});

export type ProviderModel = z.infer<typeof ProviderModelSchema>;
export type ChatCompletionResponse = z.infer<typeof ChatCompletionResponseSchema>;

export function formatSchemaError(error: z.ZodError, context: string): Error {
  const detail = error.issues
    .slice(0, 3)
    .map(issue => issue.path.join('.') || 'response')
    .join(', ');
  return new Error(`${context} returned an invalid response${detail ? ` (${detail})` : ''}.`);
}
