# Trinity Frontend

A modern, professional React website for the Trinity Clash of Clans family, built with Vite, React Router, and SCSS.

> **Note:** This covers only the web UI. The backing API lives in `Trinity_Backend/`.

## 🌟 Features

- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern Design** - Clean, responsive UI with smooth animations
- 💅 **SCSS Styling** - Organized styles with variables, mixins, and nesting
- 🌙 **Dark Mode** - Automatic dark mode based on system preferences
- 🧭 **React Router** - Multi-page navigation with client-side routing
- 📦 **Component-Based** - Reusable components and clean architecture
- 🎮 **Live Clan Data** - Real-time data from the Trinity backend
- ⏱️ **Smart CWL Window** - Regular users see a CWL highlight banner between the 11th and 29th (1:30 PM IST) to reduce needless API traffic
- 🚀 **Automated Deploys** - GitHub Actions build + deploy to GitHub Pages with environment secrets

## 📁 Project Structure

```
Trinity_Frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ClanCard.jsx
│   │   └── SectionTitle.jsx
│   ├── layouts/           # Layout wrappers
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── MainLayout.jsx
│   ├── pages/             # Route-level pages
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Clans.jsx
│   │   ├── CWL.jsx
│   │   ├── FarmingBaseLayouts.jsx
│   │   └── Contact.jsx      # Currently hidden in navigation & routes
│   ├── services/          # API client
│   │   └── api.js         # Calls backend API
│   ├── config/            # Configuration
│   │   └── clans.js       # Trinity clan tags
│   ├── styles/            # SCSS styles
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── base.scss
│   │   ├── layouts.scss
│   │   ├── components.scss
│   │   ├── pages.scss
│   │   └── main.scss
│   ├── App.jsx
│   └── main.jsx
├── public/
│   ├── Trinity_Logo.png
│   └── trinity-bg.jpeg
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm (ships with Node)
- Backend server running (see `../Trinity_Backend`)

### Installation & Local Development

```bash
git clone https://github.com/YOUR_USERNAME/Trinity.git
cd Trinity/Trinity_Frontend
npm install

# Optional: update clan tags in src/config/clans.js
npm run dev
```

Visit <http://localhost:5173> with the backend running on `http://localhost:3001`.

## 🔗 Backend Setup

This frontend requires the backend server to fetch live clan data.

**Backend repository:** `../Trinity_Backend`

```bash
cd ../Trinity_Backend
npm install
cp .env.example .env   # or create manually
npm run dev
```

More details: `../Trinity_Backend/README.md`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run deploy` - (Legacy) manual GitHub Pages deploy; the repo now uses GitHub Actions

## 🎨 Pages

- **Home** - Welcome hero section
- **About** - Trinity information and features
- **Clans** - Live clan data grid with stats
- **CWL** - Clan War League information
- **Farming Base Layouts** - Base layout resources
- **Contact** - Still part of the codebase but hidden/redirected while under redesign

## 🛠️ Technologies

- [React 18](https://react.dev/)
- [React Router 6](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [SCSS](https://sass-lang.com/)

## 🌐 Deployment

### GitHub Pages (via GitHub Actions)

The workflow `.github/workflows/deploy.yml` builds the Vite app and publishes `dist/` automatically whenever `master` is updated.

1. **Set the backend URL secret**
   - GitHub → _Repo_ → **Settings → Secrets and variables → Actions**
   - Add `VITE_API_URL` with your deployed backend endpoint (e.g. `https://api.trinitycoc.fun`)
2. **Push to `master`**
   - The workflow installs dependencies, runs `npm run build`, and deploys to Pages.

Manual `npm run deploy` is still available for fallback, but Actions is now the primary route.

### Custom Domains

If you’re using a custom domain (e.g. `trinitycoc.fun` on GitHub Pages):
1. Add the domain under **Settings → Pages → Custom domain**
2. Update DNS at your registrar with the records GitHub provides
3. Commit the generated `CNAME` file (already tracked in `public/`)

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_URL=http://localhost:3001
```

The frontend reads this value in `src/services/api.js`. For production, supply the same variable through GitHub Secrets.

### Clan Tags

Edit `src/config/clans.js` to manage your Trinity family clans:
```javascript
export const TRINITY_CLAN_TAGS = [
  '#J9UGCPR2',
  '#ANOTHER_TAG',
  // Add more...
]
```

## 🐛 Troubleshooting

### Backend Connection Error
**Error:** "Backend server is not running"

**Fix:** 
1. Navigate to the backend: `cd ../Trinity_Backend`
2. Start server: `npm run dev`
3. Verify it responds at `http://localhost:3001/api/health`

### CORS Errors
The backend is configured to accept requests from the frontend. If you get CORS errors, check the backend's CORS configuration in `Trinity-Backend/index.js`.

### Blank Page
1. Check the browser console (F12) for errors
2. Ensure both frontend and backend are running
3. Verify `VITE_API_URL` points to a reachable backend

## 📖 Documentation

- `QUICKSTART.md` - Quick start guide (1-minute setup)
- `Trinity-Backend/README.md` - Backend API documentation

## 📄 License

MIT License - Feel free to use this template!

## 🤝 Support

For issues related to:
- **Frontend:** Open an issue on this repository
- **Backend:** Check `Trinity-Backend` repository
- **CoC API:** Visit [developer.clashofclans.com](https://developer.clashofclans.com)

---

Built with ❤️ using React + Vite
