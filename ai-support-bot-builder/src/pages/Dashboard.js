import React from 'react';
import { useBotContext } from '../context/BotContext';
import styles from './Dashboard.module.css';

function StatCard({ label, value, sub, color }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statLabel}>{label}</span>
      <span className={styles.statValue} style={{ color }}>{value}</span>
      {sub && <span className={styles.statSub}>{sub}</span>}
    </div>
  );
}

export default function Dashboard({ setActivePage }) {
  const { bots, setActiveBotId, createBot } = useBotContext();
  const liveBots = bots.filter(b => b.isLive);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>Overview of your AI support bots</p>
        </div>
        <button className={styles.createBtn} onClick={() => { createBot(); setActivePage('builder'); }}>
          + New Bot
        </button>
      </div>

      <div className={styles.statsGrid}>
        <StatCard label="Total Bots" value={bots.length} sub="across all projects" color="var(--accent)" />
        <StatCard label="Live Bots" value={liveBots.length} sub="currently active" color="var(--green)" />
        <StatCard label="FAQ Entries" value={bots.reduce((s, b) => s + b.faqs.length, 0)} sub="in knowledge bases" color="var(--amber)" />
        <StatCard label="Avg FAQs / Bot" value={bots.length ? Math.round(bots.reduce((s, b) => s + b.faqs.length, 0) / bots.length) : 0} sub="per bot" color="var(--text-secondary)" />
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Your Bots</h2>
        <div className={styles.botsGrid}>
          {bots.map(bot => (
            <div key={bot.id} className={styles.botCard}>
              <div className={styles.botCardTop}>
                <div className={styles.botCardAvatar}>{bot.avatar}</div>
                <div className={`${styles.botStatus} ${bot.isLive ? styles.live : styles.offline}`}>
                  {bot.isLive ? 'Live' : 'Offline'}
                </div>
              </div>
              <h3 className={styles.botCardName}>{bot.name}</h3>
              <p className={styles.botCardCompany}>{bot.company}</p>
              <div className={styles.botCardMeta}>
                <span>{bot.faqs.length} FAQs</span>
                <span>•</span>
                <span>{bot.tone}</span>
              </div>
              <div className={styles.botCardActions}>
                <button className={styles.cardBtn} onClick={() => { setActiveBotId(bot.id); setActivePage('builder'); }}>
                  Configure
                </button>
                <button className={styles.cardBtnPrimary} onClick={() => { setActiveBotId(bot.id); setActivePage('chat'); }}>
                  Test Chat
                </button>
              </div>
            </div>
          ))}

          <button className={styles.newBotCard} onClick={() => { createBot(); setActivePage('builder'); }}>
            <span className={styles.newBotIcon}>+</span>
            <span className={styles.newBotLabel}>Create New Bot</span>
          </button>
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Start Guide</h2>
        <div className={styles.stepsGrid}>
          {[
            { step: '01', title: 'Create a bot', desc: 'Click "New Bot" to start. Give it a name and personality.' },
            { step: '02', title: 'Add context', desc: 'Describe your company and the topics your bot should handle.' },
            { step: '03', title: 'Build your FAQ', desc: 'Add common questions and answers to your knowledge base.' },
            { step: '04', title: 'Test & deploy', desc: 'Use Test Chat to verify responses, then set your bot to Live.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className={styles.stepCard}>
              <span className={styles.stepNum}>{step}</span>
              <h4 className={styles.stepTitle}>{title}</h4>
              <p className={styles.stepDesc}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
