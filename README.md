<div align="center">
  <img src="public/logo.svg" alt="TeckTune Logo" width="120" height="120" />
  <h1>TeckTune</h1>
  <p><strong>Interactive Guitar Fretboard Explorer</strong></p>

  <p>https://tecktune.netlify.app/</p>
</div>

<!-- screenshot -->

## 🎸 About

TeckTune is an interactive web application designed to help guitarists explore the fretboard, understand music theory, and leverage AI-powered assistance. Whether you're learning your first scales or analyzing complex chord progressions, TeckTune provides an intuitive, visually engaging experience with a sleek dark-themed interface.

## ✨ Features

- 🎸 **Interactive Fretboard** — Explore the guitar neck with dynamic, clickable fret visuals
- 🎵 **Music Theory Integration** — Learn scales, chords, and intervals directly on the fretboard
- 🤖 **AI-Powered Assistance** — Get intelligent musical insights via Gemini AI integration
- ⚡ **Smooth Animations** — Polished, responsive UI powered by Motion
- 🎨 **Modern Dark UI** — Clean, accessible design with an orange (`#F27D26`) brand accent
- 📱 **Responsive Design** — Works seamlessly across desktop and mobile devices

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 19](https://react.dev/) | UI library |
| [Vite](https://vitejs.dev/) | Build tool & dev server |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [TailwindCSS v4](https://tailwindcss.com/) | Utility-first styling |
| [Lucide React](https://lucide.dev/) | Iconography |
| [Motion](https://motion.dev/) | Animations & transitions |
| [@google/genai](https://github.com/google/genai) | Gemini AI integration |

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/alexis-zorba/TeckTune.git
   cd TeckTune
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example environment file and add your Gemini API key:

   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and replace `MY_GEMINI_API_KEY` with your actual [Gemini API key](https://aistudio.google.com/app/apikey).

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`.

## 🔑 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | Your Gemini AI API key for AI-powered features |
| `APP_URL` | ❌ No | The URL where the app is hosted (used for self-referential links and callbacks) |

## 🏗 Build for Production

To create an optimized production build:

```bash
npm run build
```

The static files will be generated in the `dist/` directory, ready for deployment.

## 🌐 Deploy

TeckTune is automatically deployed to [Netlify](https://www.netlify.com/) via GitHub integration. Pushing to the main branch triggers a new build and deployment automatically.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <p>Built with ❤️ for guitarists everywhere.</p>
</div>
