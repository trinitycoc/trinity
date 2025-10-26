# Quick Start - Trinity Backend Setup

## ✅ What's Done
- ✅ Backend server created in `../Trinity-Backend/` directory (separate from frontend)
- ✅ Frontend API client created
- ✅ Dependencies installed

## 🔧 What You Need To Do

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

## 📁 Files You May Want to Edit

- `Trinity/src/config/clans.js` - Add your clan tags here
- `Trinity-Backend/.env` - Your API credentials (never commit this!)

## 🐛 Troubleshooting

**"Backend server is not running"**
→ Start backend: `cd ../Trinity-Backend && npm run dev`

**"Authentication failed"**
→ Check your COC_EMAIL and COC_PASSWORD in `Trinity-Backend/.env`

**IP Address error**
→ Create new API key with your current IP at developer.clashofclans.com

