// List of models to try, in order of preference.
// We fall back through this list if the primary model isn't available.
const MODEL_FALLBACKS = [
  'anthropic/claude-3.5-sonnet',
  'openai/gpt-4o-mini',
  'google/gemini-2.0-flash-exp:free',
  'mistral/mistral-large-latest',
  'qwen/qwen2.5-14b-instruct',
  'deepseek/deepseek-chat',
];

export async function callAI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  onChunk?: (text: string) => void,
  modelOverride?: string
): Promise<string> {
  // If a specific model is requested, use it directly (no fallback)
  if (modelOverride) {
    return callWithModel(apiKey, systemPrompt, userMessage, modelOverride, onChunk);
  }

  let lastError: Error | null = null;

  for (const model of MODEL_FALLBACKS) {
    try {
      return await callWithModel(apiKey, systemPrompt, userMessage, model, onChunk);
    } catch (err: any) {
      lastError = err;
      // If it's a model availability error, try next model
      const msg = String(err?.message || '').toLowerCase();
      const isModelError =
        msg.includes('no endpoints found') ||
        msg.includes('not found') ||
        msg.includes('does not exist') ||
        msg.includes('invalid model');
      if (!isModelError) break; // real error — don't retry
    }
  }

  throw lastError || new Error('All models failed. Please check your API key and try again.');
}

async function callWithModel(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  model: string,
  onChunk?: (text: string) => void
): Promise<string> {
  // Enforce "no intro, no outro, just the content" rule on every request
  const strictReminder = `\n\n⚠️ REMINDER: Respond directly with ONLY the requested content. NO introduction. NO conclusion. NO explanations. NO tips. NO commentary. Just the final output ready to copy-paste.`;
  const finalUserMessage = userMessage + strictReminder;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'MakerSuite AI',
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: finalUserMessage },
      ],
      max_tokens: 2048,
      stream: !!onChunk,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API Error: ${response.status}`);
  }

  if (onChunk && response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n').filter(l => l.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') continue;
        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content || '';
          if (content) {
            fullText += content;
            onChunk(fullText);
          }
        } catch {
          // skip malformed chunk
        }
      }
    }
    return fullText;
  } else {
    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response generated.';
  }
}
