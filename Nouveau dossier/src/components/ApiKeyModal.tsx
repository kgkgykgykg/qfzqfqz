import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useApiKey } from '../context/ApiKeyContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ApiKeyModal({ isOpen, onClose }: Props) {
  const { theme } = useTheme();
  const { apiKey, setApiKey } = useApiKey();
  const [inputValue, setInputValue] = useState(apiKey);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const handleSave = () => {
    setApiKey(inputValue);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      />
      <div className={`relative w-full max-w-md rounded-2xl p-8 animate-scale-in ${isDark ? 'bg-bg-elevated border border-border' : 'bg-bg-elevated-light border border-border-light shadow-elevated'}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${isDark ? 'btn-ghost' : 'btn-ghost-light'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-accent-soft text-accent-light' : 'bg-accent-softer text-accent'}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>

        <h2 className={`font-display text-xl font-semibold mb-2 ${isDark ? 'text-text' : 'text-text-light'}`}>
          OpenRouter API Key
        </h2>
        <p className={`text-sm mb-6 leading-relaxed ${isDark ? 'text-text-muted' : 'text-text-muted-light'}`}>
          Enter your OpenRouter API key to use AI-powered tools. Your key is stored locally and never sent to our servers.
        </p>

        <input
          type="password"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="sk-or-v1-..."
          className={`w-full px-4 py-3 rounded-xl text-sm mb-4 ${isDark ? 'input' : 'input-light'}`}
        />

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={!inputValue.trim()}
            className="flex-1 btn-primary px-5 py-3 rounded-xl text-sm font-medium"
          >
            Save Key
          </button>
          <button
            onClick={onClose}
            className={`px-5 py-3 rounded-xl text-sm font-medium ${isDark ? 'btn-secondary' : 'btn-secondary-light'}`}
          >
            Cancel
          </button>
        </div>

        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-border' : 'border-border-light'}`}>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm flex items-center gap-2 text-accent hover:underline"
          >
            Get your API key from OpenRouter
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
