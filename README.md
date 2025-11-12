# FairShare - Expense Tracker

**FairShare** is a privacy-focused expense tracker that helps you split costs fairly with friends, family, or roommates. Create groups for trips, household bills, or events, add members, and track expenses with flexible splitting options (equal, ratio, or custom amounts). The shared cash locker feature lets groups pool money and track deposits and withdrawals. Organize expenses with custom icons, set budgets, and view spending breakdowns with charts. The Collections feature (in development) combines related groups to see total spending across multiple categories. Your data stays private on your device with no cloud storage, and you can export backups anytime. Perfect for vacations, rent splitting, parties, or any shared expenses.

## ✨ Features

### 🔐 Multi-User System
- Secure login with user isolation
- Each user maintains separate groups and data
- Local storage for complete privacy (no cloud sync)
- Easy logout and account switching

### 👥 Group Management
- Create unlimited expense groups with custom emoji icons
- Add members with individual budgets
- Edit group icons anytime
- Switch between groups seamlessly
- Delete groups when no longer needed

### 💰 Advanced Expense Tracking
- **Multiple Payment Types**:
  - Locker payment (from shared pool)
  - Personal payment (individual member)
  - Multiple payers (split between members and/or locker)
- **Four Splitting Methods**:
  - Equal split
  - Ratio-based split
  - Manual amounts
  - Share-based split
- Full CRUD operations (create, edit, delete expenses)
- Category-based organization
- Date and notes for each expense

### 🔒 Cash Locker System
- Shared cash pool for group expenses
- Individual deposits with tracking
- Common pool deposits (split equally among members)
- Budget allocation and monitoring
- Withdrawal history
- Real-time balance tracking

### 📊 Analytics Dashboard
- Total spending overview
- Locker vs personal spending breakdown
- Category-based expense charts
- Member contribution analysis
- Budget vs actual spending visualization
- Timeline views with Recharts

### 📦 Collections (In Development)
- Aggregate multiple related groups
- Combined analytics across groups
- Track spending across different payment methods or trip phases
- Maintain separate group data while viewing unified insights

### 💾 Data Management
- Export groups as JSON for backup
- Import previously exported groups
- Browser-based storage (no server required)
- Automatic data persistence
- User-specific data isolation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd FairShare
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## 📖 Usage

### First Time Setup

1. **Login**: Enter your name to create an account
2. **Create Group**: Add group name, icon, and members
3. **Add Expenses**: Track who paid and how to split
4. **Manage Locker**: Add deposits to shared pool
5. **View Dashboard**: See spending analytics

### Managing Multiple Groups

1. Click the group selector in the sidebar
2. Switch between existing groups
3. Create new groups with "➕ Create New Group"
4. Each group maintains independent data

### Expense Splitting

- **Equal**: Divide amount equally among selected members
- **Ratio**: Split by custom ratios (e.g., 2:1:1)
- **Manual**: Specify exact amount for each member
- **Shares**: Divide by shares (e.g., 3 shares, 2 shares, 1 share)

### Data Backup

1. Click "Export Data" in sidebar
2. Save JSON file to your device
3. Import anytime using "Import Data"

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed instructions.

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS 3
- **Charts**: Recharts
- **Build Tool**: Vite 4.5
- **Date Handling**: date-fns
- **Storage**: Browser localStorage

## 📁 Project Structure

```
FairShare/
├── src/
│   ├── components/          # React components
│   │   ├── Login.tsx       # User authentication
│   │   ├── GroupSetup.tsx  # Group creation
│   │   ├── ExpensesList.tsx # Expense management
│   │   ├── AddExpense.tsx  # Add/edit expenses
│   │   ├── LockerManager.tsx # Cash locker
│   │   ├── SummaryDashboard.tsx # Analytics
│   │   └── GroupIconEditor.tsx # Icon customization
│   ├── types/
│   │   └── app.ts          # TypeScript interfaces
│   ├── utils/
│   │   └── collectionAggregation.ts # Collections logic
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── public/                  # Static assets
├── .kiro/specs/            # Feature specifications
└── README.md
```

## 🎯 Use Cases

- **Trip Expenses**: Track costs for group vacations
- **Household Bills**: Split rent, utilities, groceries
- **Roommate Expenses**: Manage shared living costs
- **Event Planning**: Track party or wedding expenses
- **Team Expenses**: Office lunches, supplies
- **Project Budgeting**: Shared costs across phases

## 📚 Documentation

- [USAGE_GUIDE.md](./USAGE_GUIDE.md) - Detailed usage instructions
- [LOGIN_GUIDE.md](./LOGIN_GUIDE.md) - Multi-user system guide
- [ICON_CUSTOMIZATION.md](./ICON_CUSTOMIZATION.md) - Icon customization guide
- [MULTI_GROUP_FEATURES.md](./MULTI_GROUP_FEATURES.md) - Group management guide
- [BRANDING.md](./BRANDING.md) - Design system and branding

## 🔮 Roadmap

### Collections Feature (In Progress)
- [x] Data models and types
- [x] Aggregation utilities
- [x] State management
- [ ] UI components
- [ ] Dashboard views
- [ ] Combined analytics

### Future Enhancements
- Mobile app version (React Native)
- Receipt photo uploads
- Currency conversion
- Expense categories customization
- Email notifications
- Cloud backup integration (optional)
- Shared collections (multi-user)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

Built with modern web technologies for a seamless expense tracking experience.
