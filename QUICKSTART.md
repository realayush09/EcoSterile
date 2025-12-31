# 🚀 EcoSterile-Pro - Quick Start Guide

Get your pH monitoring dashboard up and running in 5 minutes.

## Step 1: Open the Application

1. Navigate to your EcoSterile-Pro folder:

   ```
   C:\Users\MY\OneDrive\Desktop\EcoSterile-Pro
   ```

2. Open `auth/signin.html` in your web browser

## Step 2: Create Your Account

1. Click **"Create one now"** link
2. Fill in your details:
   - Full Name
   - Email address
   - Password (minimum 6 characters)
   - Confirm password
3. Accept terms and click **"Create Account"**
4. You'll be automatically logged in

**OR** use Google Sign-In for faster setup

## Step 3: Select Your Crop

On the dashboard:

1. Scroll to **"Crop Type Selection"** section
2. Search for your crop (e.g., "Rice", "Wheat", "Tomato")
3. Click on the crop card
4. Confirm the change in the modal
5. pH range will update automatically

💡 **Tip**: Click the 🔒 button to lock crop changes

## Step 4: Monitor Your pH

The dashboard shows:

- **Real-time pH**: Large gauge in the center
- **pH Status**: Color-coded indicator
  - 🟢 Green = Optimal
  - 🔴 Red = Too Acidic
  - 🔵 Blue = Too Basic
- **Trend Graph**: Scroll right to see historical data
- **Pump Activity**: Timeline below shows pump activations

## Step 5: Understand the Display

### System Status (Top Cards)

- 🟢/🔴 **Arduino**: Connected or Demo mode
- 🟢/🔴 **System**: Online or Offline
- 💧/⚗️ **Pump Status**: Current pump state

### Statistics

- **Average pH**: Daily average
- **pH Range**: Min-Max in last 24 hours
- **Basic Pump Uses**: Number of activations
- **Acidic Pump Uses**: Number of activations

### Activity Log

Shows every pump activation with:

- 💧 or ⚗️ symbol (pump type)
- Exact timestamp
- Solution used (NH4OH or CH3COOH)
- Time since activation

## 🔑 Key Features

### Graph Filters

- **24 Hours**: Today's data
- **7 Days**: Weekly trend
- **30 Days**: Monthly analysis

### User Menu

Click your name (top right):

- ⚙️ **Profile**: Edit account details
- 🔧 **Settings**: System preferences
- 🚪 **Sign Out**: Log out

### Theme Toggle

Click the 🌙 button to switch between:

- Dark mode (default)
- Light mode

## 📊 Understanding the Pump System

### When Do Pumps Activate?

**Basic Pump** 💧 (Ammonium Hydroxide):

- Activated when pH **falls below** optimal minimum
- Makes water more basic (raises pH)

**Acidic Pump** ⚗️ (Acetic Acid):

- Activated when pH **rises above** optimal maximum
- Makes water more acidic (lowers pH)

**Idle** 🔵 (No pump):

- When pH is within the optimal range
- System is balanced

### Optimal pH Ranges by Crop

| Crop   | Min pH | Max pH |
| ------ | ------ | ------ |
| Rice   | 5.5    | 6.5    |
| Wheat  | 6.0    | 7.5    |
| Tomato | 5.5    | 6.8    |
| Potato | 5.0    | 6.0    |
| Apple  | 5.5    | 6.5    |

## 🔐 Account Management

### Change Your Crop

1. Select different crop card
2. Confirm in the modal (⚠️ Cannot undo immediately)
3. System will activate pumps if needed

### Lock Crop Changes

1. Click 🔓 button next to search
2. Set a password
3. Future changes require password verification

### Reset Password

1. Click "Forgot password?" on sign-in page
2. Enter your email
3. Follow link in email
4. Create new password

### Sign Out

- Click your name (top right)
- Click "🚪 Sign Out"
- You'll be returned to sign-in page

## ⚙️ Connection Modes

### Demo Mode (No Arduino)

- ✅ Works without Arduino hardware
- ✅ Simulates realistic pH fluctuations
- ❌ Cannot control real pumps
- **Best for**: Testing and learning

### Live Mode (With Arduino)

- ✅ Real pH sensor data
- ✅ Actual pump control
- ❌ Requires Arduino setup
- **Best for**: Production use

To connect Arduino: See full README.md

## 🛠️ Troubleshooting

### Forgot Your Password?

1. Click "Forgot password?" on sign-in
2. Enter your email
3. Check email for reset link
4. Click link and create new password

### Can't Sign In?

- ✅ Check spelling of email
- ✅ Verify caps lock is OFF
- ✅ Try "Forgot password" to reset
- ✅ Hard refresh browser (Ctrl+Shift+R)

### Dashboard Won't Load?

- ✅ Check internet connection
- ✅ Clear browser cache
- ✅ Try different browser
- ✅ Wait 30 seconds and refresh

### No pH Data?

- ✅ In Demo mode → Data generates automatically
- ✅ With Arduino → Check USB connection
- ✅ Try refreshing the page
- ✅ Check Firebase is accessible

## 📱 Mobile Usage

The dashboard works on phones/tablets:

1. Open `auth/signin.html` on mobile
2. Layout automatically adjusts
3. Touch-friendly buttons and inputs
4. Swipe graphs left/right to see history

**Best on**: iPhone 12+, Android 10+, iPad

## 🎯 Tips & Tricks

- **Dark Mode**: Better for eyes, saves battery on OLED screens
- **Bookmark**: Save dashboard URL for quick access
- **Refresh**: Page auto-updates every 5 seconds
- **Timeline**: Scroll horizontally in activity log on mobile
- **Crop Lock**: Protect from accidental changes
- **Graph Zoom**: Focus on specific time ranges

## 📞 Need Help?

1. Check the full **README.md** for detailed documentation
2. Review **Firebase** configuration in `services/firebase.js`
3. Check browser **Console** (F12) for error messages
4. Verify **network connection** is working
5. Try **clearing browser cache** (Ctrl+Shift+Delete)

## 🎉 You're Ready!

Your EcoSterile-Pro dashboard is now set up. Start monitoring your crops and enjoy precision pH control!

---

**Questions?** Review the detailed README.md or check the Arduino sketch documentation.

**Version**: 1.0.0  
**Last Updated**: Dec 31, 2025
