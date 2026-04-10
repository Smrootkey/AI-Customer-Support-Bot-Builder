import { useState, useCallback } from 'react';

const TONE_PROMPTS = {
  friendly: 'Be warm, approachable, and conversational. Use casual but professional language.',
  professional: 'Be formal, precise, and professional. Use complete sentences and business language.',
  concise: 'Be brief and direct. Use short sentences. Get to the point immediately.',
  empathetic: 'Lead with empathy. Acknowledge the customer\'s feelings before providing solutions. Be patient and understanding.',
  witty: 'Be clever and slightly playful while remaining helpful. Light humor is welcome when appropriate.',
};

export function useClaudeChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async ({ bot, userMessage, conversationHistory = [] }) => {
    setIsLoading(true);
    setError(null);

    const apiKey = process.env.REACT_APP_ANTHROPIC_API_KEY;
    if (!apiKey) {
      setIsLoading(false);
      setError('API key not configured. Please add REACT_APP_ANTHROPIC_API_KEY to your .env file.');
      return null;
    }

    const faqBlock = bot.faqs.length > 0
      ? `\n\nKNOWLEDGE BASE (use this to answer questions accurately):\n${bot.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n\n')}`
      : '';

    const systemPrompt = `You are ${bot.name}, an AI customer support assistant for ${bot.company}.

COMPANY CONTEXT:
${bot.context}
${faqBlock}

TONE: ${TONE_PROMPTS[bot.tone] || TONE_PROMPTS.friendly}

RULES:
- Only answer questions relevant to ${bot.company} and customer support topics
- If you don't know the answer, say so honestly and suggest the customer contact the support team
- Keep responses concise (2–4 sentences unless detail is necessary)
- Never invent policies, prices, or information not provided above
- If a customer is angry, de-escalate calmly before solving
- Sign off with your name (${bot.name}) only on the first message`;

    const messages = [
      ...conversationHistory.map(m => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: userMessage },
    ];

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1024,
          system: systemPrompt,
          messages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, I was unable to generate a response.';
      setIsLoading(false);
      return reply;
    } catch (err) {
      setIsLoading(false);
      setError(err.message);
      return null;
    }
  }, []);

  return { sendMessage, isLoading, error };
}
