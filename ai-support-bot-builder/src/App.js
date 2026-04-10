import React, { useState } from 'react';
import { BotProvider } from './context/BotContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import BotBuilder from './pages/BotBuilder';
import TestChat from './pages/TestChat';
import Analytics from './pages/Analytics';
import styles from './App.module.css';

function AppShell() {
  const [activePage, setActivePage] = useState('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard setActivePage={setActivePage} />;
      case 'builder':   return <BotBuilder setActivePage={setActivePage} />;
      case 'chat':      return <TestChat />;
      case 'analytics': return <Analytics />;
      default:          return <Dashboard setActivePage={setActivePage} />;
    }
  };

  return (
    <div className={styles.app}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className={`${styles.main} ${activePage === 'chat' ? styles.chatMain : ''}`}>
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BotProvider>
      <AppShell />
    </BotProvider>
  );
}
