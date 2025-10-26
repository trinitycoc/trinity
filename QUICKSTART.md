# Quick Start - Trinity Setup

Get your Trinity website running in 5 minutes!

## 🔧 Setup Steps

### Step 1: Get Clash of Clans API Credentials

1. Go to https://developer.clashofclans.com
2. Create an account / Login
3. Create a new API key with your current IP address
4. Save your login email and password

### Step 2: Create .env File

Create a file named `.env` in the `Trinity-Backend/` directory with this content:

```env
COC_EMAIL=your-email@example.com
COC_PASSWORD=your-password-here
PORT=3001
```

Replace with your actual Clash of Clans developer portal credentials.

### Step 3: Run Both Servers

**Terminal 1 - Backend:**
```bash
cd ../Trinity-Backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd Trinity
npm run dev
```

### Step 4: Open Your Browser

Go to: http://localhost:5173

Navigate to the "Clans" page to see live data!

## 🎯 That's It!

Your app will now fetch live clan data from the Clash of Clans API.

## ⚠️ Important Notes

- The backend MUST be running for clan data to load
- Make sure your IP is whitelisted in the CoC developer portal
- If your IP changes, create a new API key with the new IP

## 📝 Next Steps

### Add Your Clan Tags
Edit `src/config/clans.js`:
```javascript
export const TRINITY_CLAN_TAGS = [
  '#J9UGCPR2',
  '#RY8GYCLY',
  // Add your clan tags...
]
```

## 🐛 Troubleshooting

**"Backend server is not running"**
→ Start backend: `cd ../Trinity-Backend && npm run dev`

**"Authentication failed"**
→ Check your COC_EMAIL and COC_PASSWORD in `Trinity-Backend/.env`

**IP Address error**
→ Create new API key with your current IP at developer.clashofclans.com

---

📖 For detailed documentation, see [README.md](README.md)

