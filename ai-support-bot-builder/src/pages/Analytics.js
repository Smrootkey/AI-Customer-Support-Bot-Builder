import React from 'react';
import { useBotContext } from '../context/BotContext';
import styles from './Analytics.module.css';

export default function Analytics() {
  const { bots, getChatHistory } = useBotContext();

  const totalMessages = bots.reduce((sum, bot) => {
    const history = getChatHistory(bot.id);
    return sum + history.length;
  }, 0);

  const userMessages = bots.reduce((sum, bot) => {
    const history = getChatHistory(bot.id);
    return sum + history.filter(m => m.role === 'user').length;
  }, 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Analytics</h1>
        <p className={styles.subtitle}>Performance insights across your bots</p>
      </div>

      <div className={styles.statsRow}>
        {[
          { label: 'Total Bots', value: bots.length, color: 'var(--accent)' },
          { label: 'Total Messages', value: totalMessages, color: 'var(--green)' },
          { label: 'User Messages', value: userMessages, color: 'var(--amber)' },
          { label: 'Bot Replies', value: totalMessages - userMessages, color: 'var(--text-secondary)' },
        ].map(({ label, value, color }) => (
          <div key={label} className={styles.statCard}>
            <span className={styles.statLabel}>{label}</span>
            <span className={styles.statValue} style={{ color }}>{value}</span>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Per-Bot Breakdown</h2>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Bot</span>
            <span>Status</span>
            <span>FAQs</span>
            <span>Messages</span>
            <span>Tone</span>
          </div>
          {bots.map(bot => {
            const history = getChatHistory(bot.id);
            return (
              <div key={bot.id} className={styles.tableRow}>
                <div className={styles.botCell}>
                  <span className={styles.botEmoji}>{bot.avatar}</span>
                  <div>
                    <div className={styles.botName}>{bot.name}</div>
                    <div className={styles.botCompany}>{bot.company}</div>
                  </div>
                </div>
                <span className={`${styles.badge} ${bot.isLive ? styles.live : styles.offline}`}>
                  {bot.isLive ? 'Live' : 'Offline'}
                </span>
                <span className={styles.cell}>{bot.faqs.length}</span>
                <span className={styles.cell}>{history.length}</span>
                <span className={styles.cell} style={{ textTransform: 'capitalize' }}>{bot.tone}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.comingSoon}>
        <div className={styles.comingSoonIcon}>📊</div>
        <h3 className={styles.comingSoonTitle}>More analytics coming soon</h3>
        <p className={styles.comingSoonDesc}>
          Connect a backend to track response times, CSAT scores, escalation rates, and conversation funnels.
        </p>
      </div>
    </div>
  );
}
