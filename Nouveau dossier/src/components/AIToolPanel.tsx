import { useState, useRef, useEffect } from 'react';
import { useApiKey } from '../context/ApiKeyContext';
import { callAI } from '../utils/ai';
import { toolExamples, type Example } from '../data/examples';

interface ToolDef {
  id: string;
  name: string;
  desc: string;
  systemPrompt: string;
  placeholder: string;
}

interface Props {
  tool: ToolDef;
  onBack: () => void;
  dark: boolean;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'es', name: 'Español' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'ru', name: 'Русский' },
  { code: 'zh', name: '中文' },
  { code: 'ja', name: '日本語' },
  { code: 'ko', name: '한국어' },
  { code: 'ar', name: 'العربية' },
];

export default function AIToolPanel({ tool, onBack, dark }: Props) {
  const { apiKey } = useApiKey();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [showTranslate, setShowTranslate] = useState(false);
  const [activeExampleTitle, setActiveExampleTitle] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const translateRef = useRef<HTMLDivElement>(null);

  const examples = toolExamples[tool.id] || [];

  useEffect(() => {
    if (resultRef.current) {
      resultRef.current.scrollTop = resultRef.current.scrollHeight;
    }
  }, [result]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (translateRef.current && !translateRef.current.contains(e.target as Node)) {
        setShowTranslate(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const generate = async (customPrompt?: string) => {
    const promptToUse = customPrompt || input;
    if (!promptToUse.trim() || loading) return;
    
    setLoading(true);
    setResult('');
    setError('');

    try {
      await callAI(apiKey, tool.systemPrompt, promptToUse, (text) => {
        setResult(text);
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const translate = async (_langCode: string, langName: string) => {
    if (!result || translating) return;
    setTranslating(true);
    setShowTranslate(false);

    try {
      const translated = await callAI(
        apiKey,
        `You are a professional translator. Translate the following text to ${langName}. Output ONLY the translated text, nothing else. Preserve all formatting.`,
        result
      );
      setResult(translated);
    } catch (err: any) {
      setError(err.message || 'Translation failed');
    } finally {
      setTranslating(false);
    }
  };

  const copyText = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reset = () => {
    setInput('');
    setResult('');
    setError('');
    setActiveExampleTitle(null);
  };

  const loadAndGenerate = async (ex: Example) => {
    setInput(ex.prompt);
    setActiveExampleTitle(ex.title);
    setError('');
    setResult('');
    
    // Auto-generate
    setLoading(true);
    try {
      await callAI(apiKey, tool.systemPrompt, ex.prompt, (text) => {
        setResult(text);
      });
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className={`p-2.5 rounded-xl transition-all ${dark ? 'btn-ghost' : 'btn-ghost-light'}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1">
          <h1 className={`font-display text-2xl font-semibold ${dark ? 'text-text' : 'text-text-light'}`}>
            {tool.name}
          </h1>
          <p className={`text-sm mt-0.5 ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>
            {tool.desc}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <label className={`text-sm font-medium ${dark ? 'text-text' : 'text-text-light'}`}>
              Your Brief
            </label>
            <span className={`text-xs ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
              {input.length} characters
            </span>
          </div>
          
          <textarea
            value={input}
            onChange={e => { 
              setInput(e.target.value); 
              setActiveExampleTitle(null);
            }}
            placeholder={tool.placeholder}
            rows={7}
            className={`w-full px-4 py-3 rounded-xl text-sm resize-none mb-4 leading-relaxed ${dark ? 'input' : 'input-light'}`}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) generate(); }}
          />

          {/* Example chips */}
          {examples.length > 0 && (
            <div className="mb-5">
              <p className={`text-xs font-medium mb-3 ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                Quick examples
              </p>
              <div className="flex flex-wrap gap-2">
                {examples.map((ex) => {
                  const isActive = activeExampleTitle === ex.title;
                  return (
                    <button
                      key={ex.title}
                      onClick={() => loadAndGenerate(ex)}
                      disabled={loading}
                      className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 ${
                        isActive
                          ? 'bg-accent text-white shadow-sm'
                          : dark 
                            ? 'chip hover:scale-[1.02]' 
                            : 'chip-light hover:scale-[1.02]'
                      }`}
                    >
                      {ex.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => generate()}
              disabled={loading || !input.trim()}
              className="flex-1 btn-primary px-5 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate
                </>
              )}
            </button>
            <button
              onClick={reset}
              className={`px-4 py-3 rounded-xl transition-all ${dark ? 'btn-secondary' : 'btn-secondary-light'}`}
              title="Reset"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        {/* Result Panel */}
        <div className={`${dark ? 'card' : 'card-light'} p-6 rounded-2xl`}>
          <div className="flex items-center justify-between mb-4">
            <label className={`text-sm font-medium ${dark ? 'text-text' : 'text-text-light'}`}>
              Result
            </label>
            {result && (
              <div className="flex items-center gap-2">
                {/* Translate dropdown */}
                <div className="relative" ref={translateRef}>
                  <button
                    onClick={() => setShowTranslate(!showTranslate)}
                    disabled={translating}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                      dark ? 'btn-secondary' : 'btn-secondary-light'
                    }`}
                  >
                    {translating ? (
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                      </svg>
                    )}
                    Translate
                    <svg className={`w-3 h-3 transition-transform ${showTranslate ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showTranslate && (
                    <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl py-2 shadow-elevated z-20 max-h-72 overflow-y-auto animate-scale-in ${
                      dark ? 'bg-bg-elevated border border-border' : 'bg-bg-elevated-light border border-border-light'
                    }`}>
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          onClick={() => translate(lang.code, lang.name)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                            dark ? 'hover:bg-bg-subtle text-text-muted hover:text-text' : 'hover:bg-bg-subtle-light text-text-muted-light hover:text-text-light'
                          }`}
                        >
                          {lang.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Copy button */}
                <button
                  onClick={copyText}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    copied
                      ? 'bg-success/10 text-success'
                      : dark ? 'btn-secondary' : 'btn-secondary-light'
                  }`}
                >
                  {copied ? (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div
            ref={resultRef}
            className={`rounded-xl p-4 min-h-[300px] max-h-[420px] overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap ${
              dark ? 'bg-bg border border-border' : 'bg-bg-subtle-light border border-border-light'
            }`}
          >
            {error ? (
              <div className="flex items-start gap-3 text-danger animate-fade-in">
                <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Error</p>
                  <p className="text-xs opacity-75 mt-1">{error}</p>
                </div>
              </div>
            ) : result ? (
              <div className={`animate-fade-in ${loading ? 'typing-cursor' : ''}`}>
                {result}
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full min-h-[260px]">
                <div className="text-center animate-fade-in">
                  <div className="loader-bars justify-center mb-4">
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                    <div className="loader-bar"></div>
                  </div>
                  <p className={`text-sm ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                    Generating your content...
                  </p>
                </div>
              </div>
            ) : (
              <div className={`flex items-center justify-center h-full min-h-[260px] ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${dark ? 'bg-bg-subtle' : 'bg-bg-muted-light'}`}>
                    <svg className="w-6 h-6 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium mb-1">No content yet</p>
                  <p className="text-xs opacity-60">Write a brief or click an example to generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
