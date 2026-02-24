import { useState, useCallback } from 'react';

type CopyFn = (text: string) => Promise<boolean>;

function useCopyToClipboard(): { isCopied: boolean; copy: CopyFn } {
  const [isCopied, setIsCopied] = useState(false);

  const copy: CopyFn = useCallback(async (text) => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setIsCopied(false);
      return false;
    }
  }, []);

  return { isCopied, copy };
}

export default useCopyToClipboard;
