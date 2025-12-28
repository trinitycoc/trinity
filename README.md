# Trinity Frontend

A modern, professional React website for the Trinity Clash of Clans family, built with Vite, React Router, and SCSS.

## 🌟 Features

- ⚡ **Lightning Fast** - Built with Vite for optimal performance
- 🎨 **Modern Design** - Clean, responsive UI with smooth animations
- 💅 **SCSS Styling** - Organized styles with variables, mixins, and nesting
- 🌙 **Dark Mode** - Automatic dark mode based on system preferences
- 🧭 **React Router** - Multi-page navigation with client-side routing
- 📦 **Component-Based** - Reusable components and clean architecture
- 🎮 **Live Clan Data** - Real-time data from the Trinity backend
- ⏱️ **Smart CWL Window** - Regular users see a CWL highlight banner between the 11th and 29th (1:30 PM IST)
- 🚀 **Automated Deploys** - GitHub Actions build + deploy to GitHub Pages
- 🔐 **Authentication** - User login, registration, and role-based access
- 📊 **Admin Dashboard** - Manage clans, base layouts, and users (admin/root only)

## 📁 Project Structure

```
Trinity_Frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ClanCard.jsx
│   │   ├── CWLClanCard.jsx
│   │   ├── ErrorBoundary.jsx
│   │   ├── ProtectedRoute.jsx
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
│   │   ├── ClanDetails.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.jsx
│   │   └── CWLContext.jsx
│   ├── services/          # API client
│   │   └── api.js         # Calls backend API
│   ├── hooks/             # Custom React hooks
│   │   ├── useCountdown.js
│   │   ├── useCWLData.js
│   │   └── useTrinityClansPreview.js
│   ├── styles/            # SCSS styles
│   │   ├── variables.scss
│   │   ├── mixins.scss
│   │   ├── base.scss
│   │   ├── layouts.scss
│   │   ├── components.scss
│   │   ├── pages/
│   │   └── main.scss
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Main app component with routes
│   └── main.jsx           # Entry point
├── public/                # Static assets
│   ├── Trinity_Logo.png
│   ├── trinity-bg.jpeg
│   └── th-*.png           # Town Hall images
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm (ships with Node)
- Backend server running (see `../Trinity_Backend/README.md`)

### Installation & Local Development

1. **Install dependencies**
```bash
cd Trinity_Frontend
npm install
```

2. **Create `.env` file**
```env
VITE_API_BASE_URL=http://localhost:3001
```

3. **Start development server**
```bash
npm run dev
```

Visit http://localhost:5173 with the backend running on `http://localhost:3001`.

## 🔗 Backend Setup

This frontend requires the backend server to fetch live clan data.

**Backend repository:** `../Trinity_Backend`

```bash
cd ../Trinity_Backend
npm install
# Create .env file with required variables
npm run dev
```

More details: `../Trinity_Backend/README.md`

## 📜 Available Scripts

- `npm run dev` - Start development server (Vite dev server)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🎨 Pages

- **Home** - Welcome hero section with Trinity information
- **About** - Trinity information and features
- **Clans** - Live clan data grid with stats
- **CWL** - Clan War League information with filtered clans
- **Farming Base Layouts** - Base layout resources by Town Hall level
- **Clan Details** - Detailed view for individual clans (wars, members, stats)
- **Login** - User authentication
- **Register** - User registration
- **Dashboard** - Admin dashboard (admin/root only) for managing clans, base layouts, and users

## 🔐 Authentication

### User Roles

- **root**: Full access - can manage everything including users
- **admin**: Can view clans and manage base layouts, cannot modify clans
- **user**: Basic user role (default for new registrations)

### Protected Routes

- `/dashboard` - Requires admin role or higher
- `/login` - Public
- `/register` - Public

### Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Token stored in localStorage
4. Token included in Authorization header for protected routes
5. AuthContext manages authentication state

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
   - Add `VITE_API_BASE_URL` with your deployed backend endpoint (e.g. `https://api.trinitycoc.fun`)

2. **Push to `master`**
   - The workflow installs dependencies, runs `npm run build`, and deploys to Pages.

### Custom Domains

If you're using a custom domain (e.g. `trinitycoc.fun` on GitHub Pages):

1. Add the domain under **Settings → Pages → Custom domain**
2. Update DNS at your registrar with the records GitHub provides
3. Commit the generated `CNAME` file (already tracked in `public/`)

### Other Platforms

For other hosting platforms (Vercel, Netlify, etc.):

1. Set `VITE_API_BASE_URL` environment variable
2. Build command: `npm run build`
3. Publish directory: `dist`

## 🔧 Configuration

### Environment Variables

Create a `.env` file for local development:

```env
VITE_API_BASE_URL=http://localhost:3001
```

For production, set the same variable through your hosting platform's environment variable settings.

### API Base URL

The frontend reads `VITE_API_BASE_URL` in `src/services/api.js`. This should point to your backend server.

**Note:** The variable must be prefixed with `VITE_` to be accessible in Vite apps.

## 🎯 Key Features

### Caching

- Frontend uses in-memory caching for clan data (2-minute TTL)
- Cache is cleared after create/update/delete operations
- Reduces unnecessary API calls

### Error Handling

- React Error Boundary catches and displays errors gracefully
- User-friendly error messages
- Error details shown in development mode only

### Responsive Design

- Mobile-first approach
- Responsive breakpoints for tablets and desktops
- Touch-friendly navigation

### Performance Optimizations

- Code splitting with React.lazy
- Image optimization
- Minimal bundle size
- Efficient re-renders with React hooks

## 🐛 Troubleshooting

### Backend Connection Error

**Error:** "Backend server is not running" or network errors

**Fix:** 
1. Navigate to the backend: `cd ../Trinity_Backend`
2. Start server: `npm run dev`
3. Verify it responds at `http://localhost:3001/api/health`
4. Check `VITE_API_BASE_URL` in `.env`

### CORS Errors

The backend is configured to accept requests from the frontend. If you get CORS errors:

1. Check the backend's `FRONTEND_URL` includes your frontend origin
2. Verify `VITE_API_BASE_URL` matches the backend's allowed origins
3. Check browser console for specific error messages

### Blank Page

1. Check the browser console (F12) for errors
2. Ensure both frontend and backend are running
3. Verify `VITE_API_BASE_URL` points to a reachable backend
4. Check React Error Boundary for caught errors

### Authentication Not Working

1. Verify backend authentication endpoints are accessible
2. Check `VITE_API_BASE_URL` is correct
3. Verify JWT token is being stored in localStorage
4. Check browser console for authentication errors

### Build Errors

1. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
2. Check Node.js version (18+ required)
3. Verify all dependencies are installed
4. Check for TypeScript/ESLint errors

## 📖 Documentation

- [Backend README](../Trinity_Backend/README.md) - Backend API documentation
- [Clash of Clans API](https://developer.clashofclans.com/) - CoC API docs

## 🔒 Security Notes

- JWT tokens stored in localStorage (consider httpOnly cookies for production)
- Passwords handled securely via backend
- Protected routes use React Router guards
- Role-based access control enforced

## 📄 License

MIT License

## 🤝 Support

For issues related to:
- **Frontend:** Open an issue on this repository
- **Backend:** Check `../Trinity_Backend/README.md`
- **CoC API:** Visit [developer.clashofclans.com](https://developer.clashofclans.com)

---

**Built with ❤️ using React + Vite**

