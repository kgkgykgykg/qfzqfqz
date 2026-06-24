const requestTimestamps: number[] = [];
const LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_IN_WINDOW = 5; // max 5 requests per minute

const rapidBurstTimestamps: number[] = [];
const RAPID_WINDOW_MS = 10000; // 10 seconds
const RAPID_MAX_REQUESTS = 6;  // 6 requests

export function checkRateLimit(): { allowed: boolean; waitSec: number } {
  const now = Date.now();
  
  // --- Check rapid burst (6 requests / 10s) first for bot protection ---
  rapidBurstTimestamps.push(now);
  // Retain only the last 15 seconds of rapid burst tracking
  while (rapidBurstTimestamps.length > 0 && now - rapidBurstTimestamps[0] > 15000) {
    rapidBurstTimestamps.shift();
  }
  
  const recentInRapidWindow = rapidBurstTimestamps.filter(t => now - t <= RAPID_WINDOW_MS);
  if (recentInRapidWindow.length >= RAPID_MAX_REQUESTS) {
    // Invalidate security verification immediately
    sessionStorage.removeItem('ecom_is_verified');
    
    // Dispatch security lockout event for UI re-verification
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('shieldguard-breach', {
        detail: { errorType: 'Anti-Bot & Anti-Automatisation' }
      }));
    }
    
    throw new Error("Anti-Bot & Anti-Automatisation: Lockout triggered due to high-frequency automated calling behavior (6 requests/10s block). Browser session integrity keys have been cleared. Please resolve the security slider again to continue.");
  }

  // --- Standard 1 minute rate limit check ---
  const validTimestamps = requestTimestamps.filter(t => now - t < LIMIT_WINDOW_MS);
  
  // Clear and update array
  requestTimestamps.length = 0;
  requestTimestamps.push(...validTimestamps);

  if (requestTimestamps.length >= MAX_REQUESTS_IN_WINDOW) {
    const oldest = requestTimestamps[0];
    const waitSec = Math.ceil((LIMIT_WINDOW_MS - (now - oldest)) / 1000);
    return { allowed: false, waitSec };
  }

  requestTimestamps.push(now);
  return { allowed: true, waitSec: 0 };
}

/**
 * Sanitizes input strings
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Remove <script> tags
    .replace(/<\/?[^>]+(>|$)/g, '') // Strip remaining HTML tags
    .replace(/javascript:/gi, ''); // Block pseudo-URL handlers
}

export async function callAI(
  apiKey: string,
  systemPrompt: string,
  userMessage: string,
  onChunk?: (text: string) => void,
  modelOverride?: string
): Promise<string> {
  // Check rate limiting
  const limit = checkRateLimit();
  if (!limit.allowed) {
    throw new Error(`Rate Limit Exceeded: Please wait ${limit.waitSec} seconds.`);
  }

  // Pre-sanitize inputs
  const safeSystemPrompt = sanitizeInput(systemPrompt);
  const safeUserMessage = sanitizeInput(userMessage);

  return callWithModel(apiKey, safeSystemPrompt, safeUserMessage, modelOverride || '', onChunk);
}

async function callWithModel(
  _apiKey: string, // No longer used, handled by server
  systemPrompt: string,
  userMessage: string,
  _model: string, // No longer used, handled by server
  onChunk?: (text: string) => void
): Promise<string> {
  // Enforce "no intro, no outro, just the content" rule on every request
  const strictReminder = `\n\n⚠️ REMINDER: Respond directly with ONLY the requested content. NO introduction. NO conclusion. NO explanations. NO tips. NO commentary. Just the final output ready to copy-paste.`;
  const finalUserMessage = userMessage + strictReminder;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      systemPrompt,
      userMessage: finalUserMessage,
      stream: !!onChunk,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error || `API Error: ${response.status}`);
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
          if (parsed.error) {
            // Re-throw so the UI can actually display the error
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            fullText += parsed.text;
            onChunk(fullText);
          }
        } catch (e: any) {
          // If it's an error we just threw, re-throw it. Otherwise skip malformed JSON.
          if (e.message) throw e;
        }
      }
    }
    return fullText;
  } else {
    const data = await response.json();
    return data.text || 'No response generated.';
  }
}
