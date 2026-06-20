import { createContext, useContext, useState, type ReactNode } from 'react';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
}

const ApiKeyContext = createContext<ApiKeyContextType>({ apiKey: '', setApiKey: () => {}, isKeySet: false });

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState(() => localStorage.getItem('openrouter-key') || '');

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('openrouter-key', key);
  };

  return (
    <ApiKeyContext.Provider value={{ apiKey, setApiKey, isKeySet: apiKey.length > 10 }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = () => useContext(ApiKeyContext);
