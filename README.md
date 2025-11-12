# FairShare - Expense Tracker

**FairShare** is a privacy-focused expense tracker that helps you split costs fairly with friends, family, or roommates. Create groups for trips, household bills, or events, add members, and track expenses with flexible splitting options (equal, ratio, or custom amounts). The shared cash locker feature lets groups pool money and track deposits and withdrawals. Organize expenses with custom icons, set budgets, and view spending breakdowns with charts. The Collections feature (in development) combines related groups to see total spending across multiple categories. Your data stays private on your device with no cloud storage, and you can export backups anytime. Perfect for vacations, rent splitting, parties, or any shared expenses.

## Features

- **CSV Import**: Import your Splitwise CSV exports
- **Dashboard**: Visualize spending with charts
  - Total, locker, and personal spending cards
  - Spending by person (bar chart)
  - Spending by category (pie chart)
  - Spending over time (line chart)
  - Recent transactions with locker badges
- **Transaction Manager**: Manage payment types
  - Toggle any transaction between locker and personal payment
  - Search and filter transactions
  - Real-time summary of locker vs personal spending
- **Cash Locker**: Virtual shared pool for group expenses
  - Individual deposits
  - Common pool deposits (split equally)
  - Track contributions and withdrawals
  - View all locker payment history
- **Budget Manager**: Set and track budgets per person
  - Visual budget usage indicators
  - Over-budget warnings

## Getting Started

### Prerequisites

- Node.js 18+ (Note: You're currently on v18.20.2, which works with the downgraded Vite version)

### Installation

```bash
cd splitwise-analyzer
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
```

## Usage

1. **Import Data**: Upload your Splitwise CSV export
2. **Manage Transactions**: Toggle payment types (locker vs personal)
3. **View Dashboard**: See visualizations of spending patterns
4. **Cash Locker**: Add deposits and track withdrawals
5. **Set Budgets**: Assign budgets to each person and monitor usage

See [USAGE_GUIDE.md](./USAGE_GUIDE.md) for detailed instructions.

## Splitwise CSV Format

Your CSV should include these columns:
- Date
- Description
- Category
- Cost
- Currency
- Paid By (or PaidBy)
- Split With

## Tech Stack

- React 18 + TypeScript
- Vite 4.5 (compatible with Node 18)
- Recharts (for visualizations)
- Tailwind CSS (for styling)
- PapaParse (for CSV parsing)
- date-fns (for date formatting)

## Next Steps

Once you have a sample CSV, we can:
- Fine-tune the CSV parsing logic
- Add more chart types
- Implement data persistence (localStorage or backend)
- Add export functionality
- Create mobile-responsive improvements
