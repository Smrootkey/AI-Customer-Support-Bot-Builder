# 🤖 BotForge — AI Customer Support Bot Builder

A production-ready React application that lets you build, configure, and test AI-powered customer support bots using the Anthropic Claude API.

![BotForge Screenshot](https://via.placeholder.com/1200x630/0a0a0a/7c6af7?text=BotForge+AI+Support+Bot+Builder)

---

## ✨ Features

- **Multi-bot management** — Create and manage multiple bots, each with its own identity and config
- **Bot Builder** — Configure bot name, avatar, company context, tone/personality
- **Knowledge Base (FAQ)** — Add, edit, and delete Q&A pairs that power accurate responses
- **5 Tone presets** — Friendly, Professional, Concise, Empathetic, Witty
- **Live Test Chat** — Full multi-turn conversation interface powered by Claude
- **Analytics Dashboard** — Overview of bots, messages, and FAQ coverage
- **Live/Offline toggle** — Mark bots as live or offline
- **Dark-mode first UI** — Sleek, professional dark interface

---

## 🚀 Getting Started

### Prerequisites

- Node.js v16 or higher
- An [Anthropic API key](https://console.anthropic.com/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/ai-support-bot-builder.git
cd ai-support-bot-builder

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Open .env and add your Anthropic API key

# 4. Start the development server
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000).

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
REACT_APP_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ **Important**: Never commit your `.env` file. It is already in `.gitignore`.
>
> ⚠️ **Note**: This app calls the Anthropic API directly from the browser for demo purposes. In production, you should proxy API calls through your own backend server to keep your API key secure.

---

## 🗂️ Project Structure

```
ai-support-bot-builder/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Sidebar.js           # Navigation sidebar with bot list
│   │   └── Sidebar.module.css
│   ├── context/
│   │   └── BotContext.js        # Global state (bots, FAQs, chat history)
│   ├── hooks/
│   │   └── useClaudeChat.js     # Claude API integration hook
│   ├── pages/
│   │   ├── Dashboard.js         # Overview & stats
│   │   ├── Dashboard.module.css
│   │   ├── BotBuilder.js        # Bot configuration UI
│   │   ├── BotBuilder.module.css
│   │   ├── TestChat.js          # Live chat interface
│   │   ├── TestChat.module.css
│   │   ├── Analytics.js         # Analytics page
│   │   └── Analytics.module.css
│   ├── App.js                   # Root component & page routing
│   ├── App.module.css
│   ├── index.js                 # React entry point
│   └── index.css                # Global CSS variables & resets
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 🧠 How It Works

1. **Create a bot** — Give it a name, avatar, and company context
2. **Build your knowledge base** — Add FAQ pairs (question + answer)
3. **Choose a tone** — Select how the bot should communicate
4. **Test in chat** — Ask questions and see real Claude-powered responses
5. **Iterate** — Refine context and FAQs based on test results

### Claude API Integration

Each chat message sends:
- A **system prompt** built from: bot name, company, context, FAQs, and tone instructions
- The full **conversation history** for multi-turn context
- The user's latest **message**

---

## 🔧 Customization

### Adding a new tone

In `src/hooks/useClaudeChat.js`, add an entry to `TONE_PROMPTS`:

```js
const TONE_PROMPTS = {
  // existing tones...
  formal: 'Use highly formal, structured language suitable for enterprise clients.',
};
```

Then add the tone option in `src/pages/BotBuilder.js` in the `TONES` array.

### Persisting data

Currently, all data lives in React state (resets on refresh). To persist:
- Add `localStorage` calls in `BotContext.js` using `useEffect`
- Or connect a backend (Node.js + MongoDB / Supabase / Firebase)

---

## 🛡️ Production Considerations

| Concern | Recommendation |
|---|---|
| API Key Security | Move API calls to a backend proxy (Express, Next.js API routes) |
| Data Persistence | Add a database (MongoDB, PostgreSQL, Firebase, Supabase) |
| Auth | Add user authentication (Auth0, Clerk, Firebase Auth) |
| Rate Limiting | Implement per-user rate limiting on your backend |
| Multi-tenancy | Store bots per user in a database |

---

## 📦 Build for Production

```bash
npm run build
```

Outputs a static build in the `build/` folder, ready to deploy to Vercel, Netlify, or any static host.

---

## 🤝 Contributing

Pull requests are welcome! Please open an issue first to discuss what you'd like to change.

---

## 📄 License

MIT © 2025
