export interface Group {
  id: string;
  name: string;
  icon?: string; // Emoji icon for the group
  members: Member[];
  locker: Locker;
  expenses: Expense[];
  createdAt: Date;
}

export interface Member {
  id: string;
  name: string;
  email?: string;
  budget: number;
}

export interface Locker {
  totalAmount: number;
  deposits: Deposit[];
}

export interface Deposit {
  id: string;
  memberId: string;
  amount: number;
  date: Date;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  date: Date;
  category: string;
  paidBy: 'locker' | 'multiple' | string; // 'locker', 'multiple', or memberId
  paidByMultiple?: PaymentContribution[]; // For multiple payers
  splitType: 'equal' | 'ratio' | 'manual' | 'shares';
  splits: ExpenseSplit[];
  notes?: string;
}

export interface PaymentContribution {
  payerId: 'locker' | string; // 'locker' or memberId
  amount: number;
}

export interface ExpenseSplit {
  memberId: string;
  amount: number; // For manual split
  ratio?: number; // For ratio split
  shares?: number; // For shares split
}

export type SplitType = 'equal' | 'ratio' | 'manual' | 'shares';

// Collection types
export interface Collection {
  id: string;
  name: string;
  icon?: string; // Emoji icon for the collection
  groupIds: string[]; // Array of group IDs in this collection
  createdAt: Date;
  updatedAt: Date;
}

export interface CollectionStats {
  totalExpenses: number;
  totalLockerSpending: number;
  totalPersonalSpending: number;
  groupBreakdown: GroupContribution[];
  categoryBreakdown: CategoryTotal[];
  memberBreakdown: MemberTotal[];
  expenseCount: number;
}

export interface GroupContribution {
  groupId: string;
  groupName: string;
  groupIcon?: string;
  totalExpenses: number;
  expenseCount: number;
  percentage: number; // Percentage of collection total
}

export interface CategoryTotal {
  category: string;
  amount: number;
  count: number;
}

export interface MemberTotal {
  memberName: string;
  totalSpent: number;
  groupBreakdown: {
    groupId: string;
    groupName: string;
    amount: number;
  }[];
}

export interface CombinedExpense extends Expense {
  groupId: string;
  groupName: string;
  groupIcon?: string;
}
