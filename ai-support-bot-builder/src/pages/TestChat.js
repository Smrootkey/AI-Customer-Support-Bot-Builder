import React, { useState, useRef, useEffect } from 'react';
import { useBotContext } from '../context/BotContext';
import { useClaudeChat } from '../hooks/useClaudeChat';
import styles from './TestChat.module.css';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`${styles.messageRow} ${isUser ? styles.userRow : styles.botRow}`}>
      {!isUser && (
        <div className={styles.botAvatar}>
          <span>{msg.avatar || '🤖'}</span>
        </div>
      )}
      <div className={`${styles.bubble} ${isUser ? styles.userBubble : styles.botBubble}`}>
        <p className={styles.messageText}>{msg.content}</p>
        <span className={styles.timestamp}>
          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && <div className={styles.userAvatar}>You</div>}
    </div>
  );
}

function TypingIndicator({ botAvatar }) {
  return (
    <div className={`${styles.messageRow} ${styles.botRow}`}>
      <div className={styles.botAvatar}><span>{botAvatar}</span></div>
      <div className={`${styles.bubble} ${styles.botBubble} ${styles.typingBubble}`}>
        <span className={styles.dot} />
        <span className={styles.dot} />
        <span className={styles.dot} />
      </div>
    </div>
  );
}

const SUGGESTED_QUESTIONS = [
  'How do I reset my password?',
  'What is your refund policy?',
  'How do I upgrade my plan?',
  'I need help with an integration',
];

export default function TestChat() {
  const { activeBot, getChatHistory, addMessage, clearChat } = useBotContext();
  const { sendMessage, isLoading } = useClaudeChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  const messages = getChatHistory(activeBot?.id || '');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (text) => {
    const msg = text || input.trim();
    if (!msg || isLoading || !activeBot) return;
    setInput('');

    addMessage(activeBot.id, { role: 'user', content: msg });

    const history = messages.map(m => ({ role: m.role, content: m.content }));
    const reply = await sendMessage({ bot: activeBot, userMessage: msg, conversationHistory: history });

    if (reply) {
      addMessage(activeBot.id, { role: 'assistant', content: reply, avatar: activeBot.avatar });
    }

    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeBot) return <div className={styles.empty}>No bot selected.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.chatContainer}>
        {/* Chat Header */}
        <div className={styles.chatHeader}>
          <div className={styles.botInfo}>
            <div className={styles.headerAvatar}>{activeBot.avatar}</div>
            <div>
              <div className={styles.botName}>{activeBot.name}</div>
              <div className={styles.botMeta}>
                <span className={`${styles.statusDot} ${activeBot.isLive ? styles.live : styles.offline}`} />
                {activeBot.isLive ? 'Online' : 'Offline'} · {activeBot.company}
              </div>
            </div>
          </div>
          <div className={styles.headerActions}>
            <span className={styles.testBadge}>Test Mode</span>
            <button
              className={styles.clearBtn}
              onClick={() => clearChat(activeBot.id)}
              title="Clear chat"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className={styles.messages}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.emptyAvatar}>{activeBot.avatar}</div>
              <h3 className={styles.emptyTitle}>Chat with {activeBot.name}</h3>
              <p className={styles.emptyDesc}>
                Start a conversation to test your bot. Try one of the suggested questions below.
              </p>
              <div className={styles.suggestions}>
                {SUGGESTED_QUESTIONS.map(q => (
                  <button key={q} className={styles.suggestionBtn} onClick={() => handleSend(q)}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map(msg => (
            <Message key={msg.id} msg={msg} />
          ))}

          {isLoading && <TypingIndicator botAvatar={activeBot.avatar} />}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className={styles.inputArea}>
          <div className={styles.inputRow}>
            <textarea
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${activeBot.name}...`}
              rows={1}
              disabled={isLoading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
            >
              ↑
            </button>
          </div>
          <p className={styles.inputHint}>Press Enter to send · Shift+Enter for new line</p>
        </div>
      </div>

      {/* Side panel */}
      <div className={styles.sidePanel}>
        <div className={styles.panelCard}>
          <h3 className={styles.panelTitle}>Bot Config</h3>
          <div className={styles.configRow}>
            <span className={styles.configKey}>Name</span>
            <span className={styles.configVal}>{activeBot.name}</span>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configKey}>Tone</span>
            <span className={styles.configVal} style={{ textTransform: 'capitalize' }}>{activeBot.tone}</span>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configKey}>FAQs</span>
            <span className={styles.configVal}>{activeBot.faqs.length}</span>
          </div>
          <div className={styles.configRow}>
            <span className={styles.configKey}>Status</span>
            <span className={`${styles.configVal} ${activeBot.isLive ? styles.liveText : styles.offlineText}`}>
              {activeBot.isLive ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>

        <div className={styles.panelCard}>
          <h3 className={styles.panelTitle}>Knowledge Base</h3>
          {activeBot.faqs.length === 0 ? (
            <p className={styles.noFaqs}>No FAQs added yet.</p>
          ) : (
            <div className={styles.faqList}>
              {activeBot.faqs.map(f => (
                <div key={f.id} className={styles.faqItem}>
                  <span className={styles.faqDot} />
                  <span className={styles.faqQ}>{f.question}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.panelCard}>
          <h3 className={styles.panelTitle}>Tips</h3>
          <ul className={styles.tipsList}>
            <li>Test edge cases and unusual questions</li>
            <li>Try asking about topics not in your FAQs</li>
            <li>Test different tones by switching in Builder</li>
            <li>Clear chat to start a fresh session</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
