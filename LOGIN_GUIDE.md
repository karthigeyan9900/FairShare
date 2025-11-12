# 🔐 Login System Guide

## Overview

FairShare now includes a user login system that allows multiple people to use the same device while keeping their expense data completely separate.

## Features

### 🎯 User Separation
- Each user has their own independent data
- Groups, expenses, and locker data are isolated per user
- No data mixing between users

### 💾 Local Storage
- All data stored locally on your device
- No internet connection required
- No server or cloud storage needed
- Complete privacy

### 🔄 Easy Switching
- Quick login for returning users
- Create new accounts instantly
- Logout and switch users anytime

## How to Use

### First Time Users

1. **Open the App**
   - You'll see the login screen with the FairShare logo

2. **Enter Your Name**
   - Type your name in the input field
   - Click "Continue" or press Enter

3. **Start Using**
   - You'll be taken to the group creation page
   - Create your first group and start tracking expenses

### Returning Users

1. **Select Your Account**
   - You'll see a list of existing users
   - Click on your name to login instantly

2. **Continue Where You Left Off**
   - All your groups and data will be loaded
   - Everything is exactly as you left it

### Creating Additional Accounts

1. **From Login Screen**
   - Scroll down to "Create New Account"
   - Enter a new name
   - Click "Create Account"

2. **Each Account is Independent**
   - Separate groups
   - Separate expenses
   - Separate cash locker

### Logging Out

1. **Click Logout Button**
   - Located at the bottom of the sidebar
   - Shows your current username

2. **Confirm Logout**
   - Click "OK" to confirm
   - You'll be returned to the login screen

3. **Your Data is Safe**
   - All data remains saved
   - Login again anytime to access it

## Use Cases

### 👨‍👩‍👧‍👦 Family Sharing
```
Device: Family iPad
Users:
├── Dad (Business trips)
├── Mom (Household expenses)
└── Kids (Allowance tracking)
```

### 🏢 Office Computer
```
Device: Shared Office PC
Users:
├── John (Team lunches)
├── Sarah (Office supplies)
└── Mike (Client dinners)
```

### 🏠 Roommates
```
Device: Living room laptop
Users:
├── Alex (Personal expenses)
├── Jordan (Shared bills)
└── Sam (Groceries)
```

## Data Storage

### How It Works
- Each user's data is stored with a unique prefix
- Format: `username_expenseGroups`
- Example: `John_expenseGroups`, `Sarah_expenseGroups`

### Storage Keys
```
localStorage:
├── currentUser (who's logged in)
├── John_expenseGroups (John's groups)
├── John_activeGroupId (John's active group)
├── Sarah_expenseGroups (Sarah's groups)
└── Sarah_activeGroupId (Sarah's active group)
```

### Data Safety
- ✅ Isolated per user
- ✅ Persists across sessions
- ✅ No accidental mixing
- ✅ Easy to backup (export feature)

## Privacy & Security

### What's Stored
- Username (just a display name)
- Groups you create
- Expenses you add
- Cash locker data

### What's NOT Stored
- No passwords
- No email addresses (unless you add them)
- No personal identification
- No cloud sync

### Security Notes
- 🔒 Data stays on your device
- 🔒 No internet transmission
- 🔒 Browser-level security
- 🔒 Clear browser data to remove all info

## Tips

1. **Use Descriptive Names**
   - "John Smith" instead of "User1"
   - Makes it easier to identify accounts

2. **One User Per Person**
   - Don't share accounts
   - Each person gets their own data

3. **Regular Exports**
   - Export your groups regularly
   - Backup important data

4. **Clear Old Accounts**
   - Remove unused accounts from login screen
   - Keeps things organized

5. **Device Sharing**
   - Perfect for shared devices
   - Each person maintains privacy

## Troubleshooting

### Can't See My Data
- Make sure you're logged in as the correct user
- Check the username at the bottom of the sidebar

### Wrong Account
- Click logout
- Select the correct account from login screen

### Lost Data
- Data is tied to the username
- Login with the exact same name to recover

### Multiple Devices
- Data doesn't sync between devices
- Use export/import to transfer data

## Migration from Old Version

If you were using FairShare before the login system:

1. **First Login**
   - Enter any username
   - Your old data will be automatically migrated

2. **Data Preserved**
   - All groups remain intact
   - All expenses preserved
   - Nothing is lost

3. **Now User-Specific**
   - Data is now tied to your username
   - Other users won't see it
