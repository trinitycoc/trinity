# Trinity Frontend

A modern, professional React website for Trinity Clash of Clans family - built with Vite, React Router, and SCSS.

> **Note:** This is the frontend only. The backend API server is in a separate repository: `Trinity-Backend/`

## 🌟 Features

- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern Design** - Clean, responsive UI with smooth animations
- 💅 **SCSS Styling** - Organized styles with variables, mixins, and nesting
- 🌙 **Dark Mode** - Automatic dark mode based on system preferences
- 🧭 **React Router** - Multi-page navigation with client-side routing
- 📦 **Component-Based** - Reusable components and clean architecture
- 🎮 **Live Clan Data** - Real-time data from Clash of Clans API via backend
- 🚀 **Easy Deploy** - One-command deployment to GitHub Pages

## 📁 Project Structure

```
Trinity/
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
│   │   └── Contact.jsx
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
- npm or yarn
- Backend server running (see `Trinity-Backend` repository)

### Installation

1. **Clone and install:**
```bash
git clone https://github.com/YOUR_USERNAME/Trinity.git
cd Trinity
npm install
```

2. **Configure clan tags** in `src/config/clans.js`:
```javascript
export const TRINITY_CLAN_TAGS = [
  '#J9UGCPR2',
  '#YOUR_CLAN_TAG',
  // Add your clan tags...
]
```

3. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔗 Backend Setup

This frontend requires the backend server to fetch live clan data.

**Backend Repository:** `Trinity-Backend/` (separate directory)

**Quick Backend Start:**
```bash
cd ../Trinity-Backend
npm install
# Create .env with your CoC API credentials
npm run dev
```

The backend should run on `http://localhost:3001`

For detailed backend setup, see `QUICKSTART.md` or the `Trinity-Backend/README.md`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

## 🎨 Pages

- **Home** - Welcome hero section
- **About** - Trinity information and features
- **Clans** - Live clan data grid with stats
- **CWL** - Clan War League information
- **Farming Base Layouts** - Base layout resources
- **Contact** - Contact methods

## 🛠️ Technologies

- [React 18](https://react.dev/)
- [React Router 6](https://reactrouter.com/)
- [Vite](https://vitejs.dev/)
- [SCSS](https://sass-lang.com/)

## 🌐 Deployment

### GitHub Pages

1. Update `vite.config.js`:
```javascript
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? '/Trinity/' : '/',
}))
```

2. Update `src/App.jsx`:
```javascript
const basename = import.meta.env.MODE === 'production' ? '/Trinity/' : '/'
```

3. Deploy:
```bash
npm run deploy
```

Your site will be live at: `https://YOUR_USERNAME.github.io/Trinity/`

**Important:** The backend must be deployed separately to a Node.js hosting service (Heroku, Railway, Render, etc.)

## 🔧 Configuration

### API Endpoint

By default, the frontend calls `http://localhost:3001/api` for development.

To change the API URL:
1. Create `.env` file:
```env
VITE_API_URL=https://your-backend-url.com/api
```

2. The frontend automatically uses this in `src/services/api.js`

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
1. Navigate to backend: `cd ../Trinity-Backend`
2. Start server: `npm run dev`
3. Verify it's running at `http://localhost:3001/api/health`

### CORS Errors
The backend is configured to accept requests from the frontend. If you get CORS errors, check the backend's CORS configuration in `Trinity-Backend/index.js`.

### Blank Page
1. Check browser console (F12) for errors
2. Ensure both frontend and backend are running
3. Verify API URL is correct

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
