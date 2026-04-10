import React from 'react';
import { useBotContext } from '../context/BotContext';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
  { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
  { id: 'builder', icon: '⚙', label: 'Bot Builder' },
  { id: 'chat', icon: '◎', label: 'Test Chat' },
  { id: 'analytics', icon: '↗', label: 'Analytics' },
];

export default function Sidebar({ activePage, setActivePage }) {
  const { bots, activeBotId, setActiveBotId, createBot } = useBotContext();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>⬡</span>
        <span className={styles.logoText}>BotForge</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`${styles.navItem} ${activePage === item.id ? styles.active : ''}`}
            onClick={() => setActivePage(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.botsSection}>
        <div className={styles.botsSectionHeader}>
          <span className={styles.sectionLabel}>Your Bots</span>
          <button className={styles.addBotBtn} onClick={createBot} title="Create new bot">+</button>
        </div>
        <div className={styles.botsList}>
          {bots.map(bot => (
            <button
              key={bot.id}
              className={`${styles.botItem} ${bot.id === activeBotId ? styles.activeBotItem : ''}`}
              onClick={() => { setActiveBotId(bot.id); setActivePage('builder'); }}
            >
              <span className={styles.botEmoji}>{bot.avatar}</span>
              <div className={styles.botInfo}>
                <span className={styles.botName}>{bot.name}</span>
                <span className={styles.botCompany}>{bot.company}</span>
              </div>
              <span className={`${styles.liveIndicator} ${bot.isLive ? styles.live : styles.offline}`} />
            </button>
          ))}
        </div>
      </div>

      <div className={styles.sidebarFooter}>
        <div className={styles.footerUser}>
          <div className={styles.userAvatar}>BF</div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Developer</span>
            <span className={styles.userPlan}>Free Plan</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
