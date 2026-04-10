import React, { useState } from 'react';
import { useBotContext } from '../context/BotContext';
import { v4 as uuidv4 } from 'uuid';
import styles from './BotBuilder.module.css';

const TONES = [
  { id: 'friendly', label: 'Friendly', desc: 'Warm & casual' },
  { id: 'professional', label: 'Professional', desc: 'Formal & precise' },
  { id: 'concise', label: 'Concise', desc: 'Short & direct' },
  { id: 'empathetic', label: 'Empathetic', desc: 'Patient & caring' },
  { id: 'witty', label: 'Witty', desc: 'Clever & playful' },
];

const AVATARS = ['🤖', '💬', '⚡', '🎯', '🛡️', '🌟', '🔥', '💡', '🎪', '🚀'];

function FaqItem({ faq, botId, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [q, setQ] = useState(faq.question);
  const [a, setA] = useState(faq.answer);

  const save = () => {
    onUpdate(botId, faq.id, { question: q, answer: a });
    setEditing(false);
  };

  if (editing) {
    return (
      <div className={styles.faqItemEdit}>
        <input
          className={styles.faqInput}
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Question..."
        />
        <textarea
          className={styles.faqTextarea}
          value={a}
          onChange={e => setA(e.target.value)}
          placeholder="Answer..."
          rows={3}
        />
        <div className={styles.faqEditActions}>
          <button className={styles.saveBtn} onClick={save}>Save</button>
          <button className={styles.cancelBtn} onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.faqItem}>
      <div className={styles.faqContent}>
        <p className={styles.faqQ}>{faq.question}</p>
        <p className={styles.faqA}>{faq.answer}</p>
      </div>
      <div className={styles.faqActions}>
        <button className={styles.iconBtn} onClick={() => setEditing(true)} title="Edit">✎</button>
        <button className={`${styles.iconBtn} ${styles.deleteBtn}`} onClick={() => onDelete(botId, faq.id)} title="Delete">✕</button>
      </div>
    </div>
  );
}

export default function BotBuilder({ setActivePage }) {
  const { activeBot, updateBot, addFaq, updateFaq, deleteFaq, deleteBot } = useBotContext();
  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');
  const [addingFaq, setAddingFaq] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!activeBot) return <div className={styles.empty}>No bot selected.</div>;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddFaq = () => {
    if (!newQ.trim() || !newA.trim()) return;
    addFaq(activeBot.id, { question: newQ.trim(), answer: newA.trim() });
    setNewQ('');
    setNewA('');
    setAddingFaq(false);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Bot Builder</h1>
          <p className={styles.subtitle}>Configure <strong>{activeBot.name}</strong></p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.testBtn} onClick={() => setActivePage('chat')}>Test Chat →</button>
          <button className={`${styles.saveBtn2} ${saved ? styles.savedBtn : ''}`} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {/* Left Column */}
        <div className={styles.leftCol}>
          {/* Identity Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Identity</h2>

            <div className={styles.avatarPicker}>
              <label className={styles.fieldLabel}>Avatar</label>
              <div className={styles.avatarGrid}>
                {AVATARS.map(em => (
                  <button
                    key={em}
                    className={`${styles.avatarBtn} ${activeBot.avatar === em ? styles.avatarSelected : ''}`}
                    onClick={() => updateBot(activeBot.id, { avatar: em })}
                  >
                    {em}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Bot Name</label>
              <input
                className={styles.input}
                value={activeBot.name}
                onChange={e => updateBot(activeBot.id, { name: e.target.value })}
                placeholder="e.g. Aria, HelpBot..."
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Company / Product</label>
              <input
                className={styles.input}
                value={activeBot.company}
                onChange={e => updateBot(activeBot.id, { company: e.target.value })}
                placeholder="Your company name"
              />
            </div>

            <div className={styles.fieldGroup}>
              <div className={styles.labelRow}>
                <label className={styles.fieldLabel}>Status</label>
              </div>
              <div className={styles.toggleRow}>
                <span className={styles.toggleLabel}>{activeBot.isLive ? '🟢 Live' : '⚫ Offline'}</span>
                <button
                  className={`${styles.toggle} ${activeBot.isLive ? styles.toggleOn : ''}`}
                  onClick={() => updateBot(activeBot.id, { isLive: !activeBot.isLive })}
                >
                  <span className={styles.toggleThumb} />
                </button>
              </div>
            </div>
          </div>

          {/* Tone Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Tone & Personality</h2>
            <div className={styles.toneGrid}>
              {TONES.map(tone => (
                <button
                  key={tone.id}
                  className={`${styles.toneBtn} ${activeBot.tone === tone.id ? styles.toneActive : ''}`}
                  onClick={() => updateBot(activeBot.id, { tone: tone.id })}
                >
                  <span className={styles.toneName}>{tone.label}</span>
                  <span className={styles.toneDesc}>{tone.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className={`${styles.card} ${styles.dangerCard}`}>
            <h2 className={styles.cardTitle}>Danger Zone</h2>
            <button
              className={styles.deleteBot}
              onClick={() => {
                if (window.confirm(`Delete ${activeBot.name}? This cannot be undone.`)) {
                  deleteBot(activeBot.id);
                  setActivePage('dashboard');
                }
              }}
            >
              Delete this bot
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className={styles.rightCol}>
          {/* Context Card */}
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>System Context</h2>
            <p className={styles.cardDesc}>
              Describe your company, what your product does, and what this bot should help customers with. The more detail you provide, the better the bot will perform.
            </p>
            <textarea
              className={styles.textarea}
              rows={7}
              value={activeBot.context}
              onChange={e => updateBot(activeBot.id, { context: e.target.value })}
              placeholder="We are Acme Inc., a project management tool. Help customers with..."
            />
          </div>

          {/* FAQ Card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h2 className={styles.cardTitle}>Knowledge Base (FAQs)</h2>
                <p className={styles.cardDesc}>
                  Add question & answer pairs. The bot will use these to answer customers accurately.
                </p>
              </div>
              <button className={styles.addFaqBtn} onClick={() => setAddingFaq(true)}>+ Add FAQ</button>
            </div>

            {addingFaq && (
              <div className={styles.addFaqForm}>
                <input
                  className={styles.input}
                  value={newQ}
                  onChange={e => setNewQ(e.target.value)}
                  placeholder="Question..."
                />
                <textarea
                  className={styles.textarea}
                  rows={3}
                  value={newA}
                  onChange={e => setNewA(e.target.value)}
                  placeholder="Answer..."
                />
                <div className={styles.addFaqActions}>
                  <button className={styles.addFaqSave} onClick={handleAddFaq}>Add</button>
                  <button className={styles.cancelBtn2} onClick={() => { setAddingFaq(false); setNewQ(''); setNewA(''); }}>Cancel</button>
                </div>
              </div>
            )}

            <div className={styles.faqList}>
              {activeBot.faqs.length === 0 && !addingFaq && (
                <div className={styles.emptyFaq}>
                  <span>No FAQs yet.</span>
                  <span>Click "+ Add FAQ" to build your knowledge base.</span>
                </div>
              )}
              {activeBot.faqs.map(faq => (
                <FaqItem
                  key={faq.id}
                  faq={faq}
                  botId={activeBot.id}
                  onUpdate={updateFaq}
                  onDelete={deleteFaq}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
