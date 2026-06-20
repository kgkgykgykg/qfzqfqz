import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useApiKey } from '../context/ApiKeyContext';
import { callAI } from '../utils/ai';

interface Props {
  dark: boolean;
  onBack: () => void;
}

const models = [
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini' },
  { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash Exp' },
  { id: 'mistral/mistral-large-latest', label: 'Mistral Large' },
  { id: 'qwen/qwen2.5-14b-instruct', label: 'Qwen 2.5 14B' },
  { id: 'deepseek/deepseek-chat', label: 'DeepSeek Chat' },
];

const examples = [
  'Break down my ROAS and propose an ad budget split',
  'How to increase LTV and reduce churn on my store?',
  'Go-to-market plan to launch a $59 product',
  'Diagnose my margins if CAC rises by 20%',
];

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPanel({ dark, onBack }: Props) {
  const { apiKey } = useApiKey();
  const [model, setModel] = useState(models[0].id);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    role: 'assistant',
    content: 'Salut, je suis ton analyste business. Décris ta situation (produits, chiffres, objectifs) et je te donnerai un plan d’action.'
  }]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const formatResponse = (text: string) => {
    let t = text.replace(/\*/g, '- ');
    t = t.replace(/\n{3,}/g, '\n\n');
    t = t.replace(/\n(?!\n)/g, '\n\n');
    return t.trim();
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const prompt = input.trim();

    const forbidden = /(script|code|python|bash|shell|java|c\+\+|c#|javascript|node|rat|malware|virus|hack|exploit|`{3})/i;
    if (forbidden.test(prompt)) {
      setError('Only business/analytics questions are allowed. Pas de code ou scripts.');
      return;
    }

    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: prompt }]);
    setLoading(true);
    setError('');

    const sys = 'You are a senior business analyst for e-commerce. NO CODE. Respond in clean plain text, no markdown, no bold. Use short paragraphs and blank lines between sections. Provide numbered steps and hyphen bullets. Focus on revenue, margins, ROAS, CAC, LTV, inventory, ops. Output only the answer, no prefaces.';

    try {
      let reply = '';
      try {
        reply = await callAI(apiKey, sys, prompt, undefined, model);
      } catch (e: any) {
        const msg = String(e?.message || '').toLowerCase();
        const isModelErr = msg.includes('no endpoints found') || msg.includes('model');
        if (isModelErr) {
          // fallback without override
          reply = await callAI(apiKey, sys, prompt);
        } else {
          throw e;
        }
      }
      setMessages(prev => [...prev, { role: 'assistant', content: formatResponse(reply) }]);
    } catch (e: any) {
      setError(e?.message || 'Unable to get response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onBack} className={`p-2.5 rounded-lg ${dark ? 'btn-ghost' : 'btn-ghost-light'}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h2 className="font-display text-xl font-semibold">Strategy Chat</h2>
          <p className={`text-sm ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Select your AI model and discuss business, analytics, growth.</p>
        </div>
      </div>

      <div className={`rounded-2xl p-5 mb-4 ${dark ? 'card' : 'card-light'}`}>
        <div className="flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex-1">
            <label className={`text-xs font-medium mb-1 block ${dark ? 'text-text-muted' : 'text-text-muted-light'}`}>Select your AI model</label>
            <select
              value={model}
              onChange={e => setModel(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg text-sm ${dark ? 'input' : 'input-light'}`}
            >
              {models.map(m => <option key={m.id} value={m.id}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-4">
          <p className={`text-xs font-medium mb-2 ${dark ? 'text-text-subtle' : 'text-text-subtle-light'}`}>Quick examples</p>
          <div className="flex flex-wrap gap-2">
            {examples.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${dark ? 'chip' : 'chip-light'}`}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl p-5 mb-4 h-[520px] overflow-y-auto ${dark ? 'card' : 'card-light'}`}>
        <div className="space-y-5">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`max-w-[98%] md:max-w-[82%] px-5 py-4 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap break-words ${
                  m.role === 'user'
                    ? 'bg-accent text-white shadow-subtle'
                    : dark ? 'bg-bg-subtle border border-border' : 'bg-white border border-[rgba(0,0,0,0.14)]'
                }`}
              >
                {m.content}
              </motion.div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className={`px-4 py-3 rounded-lg text-xs ${dark ? 'bg-bg-subtle text-text-muted' : 'bg-white text-text-muted-light border border-[rgba(0,0,0,0.12)]'}`}>
                <div className="dots-bounce flex items-center gap-2">
                  <span></span><span></span><span></span>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-danger text-xs">{error}</div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className={`rounded-2xl p-4 ${dark ? 'card' : 'card-light'}`}>
        <div className="flex gap-3 items-start">
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            rows={3}
            placeholder="Décris ton business, tes KPIs, tes objectifs, et ce que tu veux analyser..."
            className={`flex-1 px-3 py-2 rounded-lg text-sm resize-none ${dark ? 'input' : 'input-light'}`}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) send(); }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="btn-primary px-4 py-2 rounded-lg text-sm font-medium h-fit"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
}
