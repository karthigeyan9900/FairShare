# 🎨 Group Icon Customization

## Overview

FairShare now allows you to customize each group with a unique emoji icon, making it easier to identify and personalize your expense groups.

## Features

### 🎯 Icon Selection During Group Creation
When creating a new group, you can:
- Choose from 32 pre-selected emoji icons
- See a live preview of your selected icon
- Icons include: travel, activities, sports, entertainment, and more

### ✏️ Edit Icon After Creation
You can change a group's icon anytime:
1. Click on the group icon in the top-right header
2. A modal will appear with all available icons
3. Select a new icon
4. Click "Save Icon" to apply

### 👁️ Icon Display
Your custom icons appear in:
- **Header**: Top-right corner when viewing a group
- **Group Selector**: Sidebar dropdown menu
- **Group Selection Page**: When choosing which group to open
- **Group Creation Preview**: Live preview while creating

## Available Icons

### Travel & Places
✈️ 🏖️ 🏔️ 🌆 🏠 🏕️ ⛺ 🚗

### People & Activities
👥 🎉 🏃 🚴 🏊

### Food & Dining
🍔

### Education & Work
🎓 💼

### Entertainment
🎮 🎬 🎵 📚 🎨 🎭 🎪

### Sports
⚽ 🎾 🏀 🎿 🎯 🎲 🎰 🎳 🎸

## How to Use

### During Group Creation

1. **Open Group Creation**
   - Login and click "Create New Group"
   - Or click "➕ Create New Group" from group selector

2. **Select Icon**
   - At the top, you'll see a grid of emoji icons
   - Click any icon to select it
   - The preview above will update immediately

3. **Complete Setup**
   - Enter group name
   - Add members
   - Click "Create Group"

### Editing Existing Group Icon

1. **Open Your Group**
   - Select the group you want to edit

2. **Click the Icon**
   - In the top-right header, click the group icon
   - A small edit pencil (✏️) appears on hover

3. **Choose New Icon**
   - Modal opens with all available icons
   - Current icon is highlighted
   - Click any icon to preview it

4. **Save Changes**
   - Click "Save Icon" to apply
   - Or "Cancel" to keep the current icon

## Use Cases

### 🗺️ Trip-Based Groups
```
✈️ International Trips
🏖️ Beach Vacations
🏔️ Mountain Adventures
🌆 City Breaks
```

### 🏠 Living Situations
```
🏠 Apartment Expenses
👥 Roommate Bills
🎉 Party Planning
```

### 🎯 Activity-Based
```
⚽ Sports Team
🎮 Gaming Group
🎬 Movie Club
🎵 Concert Buddies
```

### 💼 Professional
```
💼 Business Trips
🎓 Study Group
📚 Book Club
```

## Tips

1. **Choose Meaningful Icons**
   - Pick icons that represent the group's purpose
   - Makes it easier to identify groups at a glance

2. **Consistent Themes**
   - Use similar icons for related groups
   - Example: All travel groups use travel emojis

3. **Visual Organization**
   - Icons help when you have many groups
   - Quick visual scanning instead of reading names

4. **Change Anytime**
   - Don't worry about picking the "perfect" icon
   - You can always change it later

5. **Default Fallback**
   - If no icon is selected, shows first letter of group name
   - Old groups without icons still work perfectly

## Technical Details

### Storage
- Icons are stored as part of the group data
- Saved in localStorage with other group information
- Persists across sessions

### Compatibility
- Works with all modern browsers
- Emoji rendering depends on your device/OS
- Icons may look slightly different on different devices

### Migration
- Existing groups without icons show the first letter
- No data loss when updating from older versions
- Icons are optional - groups work fine without them

## Troubleshooting

### Icon Not Showing
- Make sure you clicked "Save Icon"
- Refresh the page if needed
- Check that your browser supports emoji

### Icon Looks Different
- Emoji appearance varies by device/OS
- iOS, Android, Windows show emojis differently
- This is normal and expected

### Can't Change Icon
- Make sure you're viewing the group (not on group list)
- Click directly on the icon in the top-right
- Look for the edit pencil on hover
