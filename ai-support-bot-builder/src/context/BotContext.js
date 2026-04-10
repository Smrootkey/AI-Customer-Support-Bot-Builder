import React, { createContext, useContext, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

const BotContext = createContext(null);

const DEFAULT_BOT = {
  id: uuidv4(),
  name: 'Aria',
  company: 'Acme SaaS',
  avatar: '🤖',
  tone: 'friendly',
  context: `We are Acme SaaS, a project management platform for teams. Help customers with billing inquiries, account setup, integrations, and general product usage. Always be helpful, honest, and escalate complex or sensitive issues to a human agent when needed.`,
  faqs: [
    { id: uuidv4(), question: 'How do I reset my password?', answer: 'Go to Settings → Security → Reset Password. You will receive an email with a secure reset link within 2 minutes.' },
    { id: uuidv4(), question: 'What is your refund policy?', answer: 'We offer a 30-day money-back guarantee on all plans. Contact billing@acme.com with your order ID to request a refund.' },
    { id: uuidv4(), question: 'How do I connect Slack?', answer: 'Go to Integrations → Slack → Connect Workspace. You will need workspace admin permissions to install the app.' },
    { id: uuidv4(), question: 'How do I upgrade my plan?', answer: 'Visit Billing → Upgrade Plan in your dashboard. Changes take effect immediately and you are prorated for the remainder of the billing cycle.' },
  ],
  isLive: true,
  createdAt: new Date().toISOString(),
};

export function BotProvider({ children }) {
  const [bots, setBots] = useState([DEFAULT_BOT]);
  const [activeBotId, setActiveBotId] = useState(DEFAULT_BOT.id);
  const [chatHistories, setChatHistories] = useState({ [DEFAULT_BOT.id]: [] });

  const activeBot = bots.find(b => b.id === activeBotId) || bots[0];

  const createBot = useCallback(() => {
    const newBot = {
      id: uuidv4(),
      name: 'New Bot',
      company: 'My Company',
      avatar: '🤖',
      tone: 'friendly',
      context: 'Describe your company and what this bot should help customers with.',
      faqs: [],
      isLive: false,
      createdAt: new Date().toISOString(),
    };
    setBots(prev => [...prev, newBot]);
    setChatHistories(prev => ({ ...prev, [newBot.id]: [] }));
    setActiveBotId(newBot.id);
    return newBot.id;
  }, []);

  const updateBot = useCallback((id, updates) => {
    setBots(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const deleteBot = useCallback((id) => {
    setBots(prev => {
      const remaining = prev.filter(b => b.id !== id);
      if (activeBotId === id && remaining.length > 0) {
        setActiveBotId(remaining[0].id);
      }
      return remaining;
    });
  }, [activeBotId]);

  const addFaq = useCallback((botId, faq) => {
    setBots(prev => prev.map(b =>
      b.id === botId ? { ...b, faqs: [...b.faqs, { id: uuidv4(), ...faq }] } : b
    ));
  }, []);

  const updateFaq = useCallback((botId, faqId, updates) => {
    setBots(prev => prev.map(b =>
      b.id === botId
        ? { ...b, faqs: b.faqs.map(f => f.id === faqId ? { ...f, ...updates } : f) }
        : b
    ));
  }, []);

  const deleteFaq = useCallback((botId, faqId) => {
    setBots(prev => prev.map(b =>
      b.id === botId ? { ...b, faqs: b.faqs.filter(f => f.id !== faqId) } : b
    ));
  }, []);

  const addMessage = useCallback((botId, message) => {
    setChatHistories(prev => ({
      ...prev,
      [botId]: [...(prev[botId] || []), { id: uuidv4(), ...message, timestamp: new Date().toISOString() }]
    }));
  }, []);

  const clearChat = useCallback((botId) => {
    setChatHistories(prev => ({ ...prev, [botId]: [] }));
  }, []);

  const getChatHistory = useCallback((botId) => {
    return chatHistories[botId] || [];
  }, [chatHistories]);

  return (
    <BotContext.Provider value={{
      bots,
      activeBot,
      activeBotId,
      setActiveBotId,
      createBot,
      updateBot,
      deleteBot,
      addFaq,
      updateFaq,
      deleteFaq,
      addMessage,
      clearChat,
      getChatHistory,
    }}>
      {children}
    </BotContext.Provider>
  );
}

export function useBotContext() {
  const ctx = useContext(BotContext);
  if (!ctx) throw new Error('useBotContext must be used inside BotProvider');
  return ctx;
}
