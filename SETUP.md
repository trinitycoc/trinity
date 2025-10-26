# Trinity Setup Guide

Complete setup instructions for the Trinity Clash of Clans website with live API integration.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Clash of Clans API account ([developer.clashofclans.com](https://developer.clashofclans.com))

## Quick Start

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

The backend is in a separate directory:

```bash
cd ../Trinity-Backend
npm install
cd ../Trinity
```

### 3. Configure Clash of Clans API Credentials

#### Get API Credentials
1. Visit [Clash of Clans Developer Portal](https://developer.clashofclans.com)
2. Create an account or log in with your Supercell ID
3. Create a new API key:
   - Name: "Trinity Dev"
   - Description: "Development key"
   - IP Address: Your current IP (find it at [whatismyip.com](https://whatismyip.com))
4. Save the API key (you'll need the email/password you used to create the account)

#### Configure Backend
1. Navigate to the backend directory:
   ```bash
   cd ../Trinity-Backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your credentials:
   ```env
   COC_EMAIL=your-developer-portal-email@example.com
   COC_PASSWORD=your-developer-portal-password
   PORT=3001
   ```

4. Return to Trinity directory:
   ```bash
   cd ../Trinity
   ```

### 4. Configure Clan Tags

Edit `src/config/clans.js` and replace the placeholder tags with your clan tags:

```javascript
export const TRINITY_CLAN_TAGS = [
  '#J9UGCPR2',      // Your clan tag 1
  '#YOURCLANTAG2',   // Your clan tag 2
  '#YOURCLANTAG3',   // Your clan tag 3
  // Add more clan tags as needed
]
```

### 5. Run the Application

You need to run both the frontend and backend:

#### Terminal 1 - Backend Server
```bash
cd ../Trinity-Backend
npm run dev
```

The backend will start on `http://localhost:3001`

#### Terminal 2 - Frontend Development Server
```bash
cd ../Trinity
npm run dev
```

The frontend will start on `http://localhost:5173`

### 6. Access the Application

Open your browser and go to:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001/api/health`

## Project Structure

```
Trinity/                    # Frontend React app
├── src/                   
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── layouts/           # Layout components
│   ├── services/          # API client (calls backend)
│   ├── config/            # Configuration files
│   └── styles/            # SCSS styles
├── public/                # Static assets
└── package.json           # Frontend dependencies

Trinity-Backend/           # Backend Node.js server (separate repo)
├── routes/               # API routes
├── services/             # CoC API integration
├── index.js              # Server entry point
└── package.json          # Backend dependencies
```

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run deploy` - Deploy to GitHub Pages

### Backend (in Trinity-Backend/ directory)
- `npm run dev` - Start with auto-reload
- `npm start` - Start production server

## Features

✅ Live Clan Data - Fetches real-time clan information from CoC API
✅ Multiple Clans - Display multiple clans from your family
✅ War Statistics - View war wins, league, and other stats
✅ Responsive Design - Works on all devices
✅ Modern UI - Built with React and SCSS

## Troubleshooting

### "Backend server is not running" Error
- Make sure you started the backend server: `cd ../Trinity-Backend && npm run dev`
- Check that port 3001 is not being used by another application
- Verify the backend is running at `http://localhost:3001/api/health`

### API Authentication Errors
- Verify your COC_EMAIL and COC_PASSWORD in `Trinity-Backend/.env`
- Check your API key is active on the developer portal
- Ensure your IP address is whitelisted (create a new key if your IP changed)

### Blank Page
- Check browser console for errors (F12)
- Ensure both frontend and backend are running
- Clear browser cache and reload

### CORS Errors
- The backend is configured to allow all origins in development
- If issues persist, check `Trinity-Backend/index.js` CORS configuration

## Deployment

### Frontend (GitHub Pages)
```bash
npm run deploy
```

### Backend
For production, you'll need to:
1. Deploy the backend to a hosting service (Heroku, Railway, DigitalOcean, etc.)
2. Update the API URL in frontend: Create `.env` with `VITE_API_URL=https://your-backend-url.com/api`
3. Rebuild and redeploy the frontend

## Support

For issues related to:
- **Clash of Clans API**: Visit [CoC Developer Forums](https://forum.supercell.com/forumdisplay.php/4-Developer-Discussion)
- **This Project**: Check the code or create an issue

## License

MIT

