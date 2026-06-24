import { createContext, useContext, useState, type ReactNode } from 'react';
import { getSecureItem, setSecureItem } from '../utils/crypto';

interface ApiKeyContextType {
  apiKey: string;
  setApiKey: (key: string) => void;
  isKeySet: boolean;
  isVerified: boolean;
  setIsVerified: (val: boolean) => void;
}

const ApiKeyContext = createContext<ApiKeyContextType>({ 
  apiKey: '', 
  setApiKey: () => {}, 
  isKeySet: false,
  isVerified: false,
  setIsVerified: () => {}
});

export function ApiKeyProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKeyState] = useState(() => getSecureItem('openrouter-key') || '');
  const [isVerified, setIsVerified] = useState(() => sessionStorage.getItem('ecom_is_verified') === 'true');

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    setSecureItem('openrouter-key', key);
  };

  const handleSetVerified = (val: boolean) => {
    setIsVerified(val);
    if (val) {
      sessionStorage.setItem('ecom_is_verified', 'true');
    } else {
      sessionStorage.removeItem('ecom_is_verified');
    }
  };

  return (
    <ApiKeyContext.Provider value={{ 
      apiKey, 
      setApiKey, 
      isKeySet: apiKey.length > 10,
      isVerified,
      setIsVerified: handleSetVerified
    }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export const useApiKey = () => useContext(ApiKeyContext);
