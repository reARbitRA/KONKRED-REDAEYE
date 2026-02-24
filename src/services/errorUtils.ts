export const parseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error instanceof Error) return error.message;
  if (error?.message) return error.message;
  if (error?.error?.message) return error.error.message;
  return 'An unknown error occurred.';
};

export const isRetriableError = (error: any): boolean => {
  const message = parseErrorMessage(error).toLowerCase();
  return message.includes('rate limit') || message.includes('server error') || message.includes('network error') || message.includes('timeout');
};
