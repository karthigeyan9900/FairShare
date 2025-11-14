import type {
  Collection,
  Group,
  CollectionStats,
  GroupContribution,
  CategoryTotal,
  MemberTotal,
  CombinedExpense,
} from '../types/app';

/**
 * Calculate aggregated statistics across all groups in a collection
 */
export const calculateCollectionStats = (
  collection: Collection,
  groups: Group[]
): CollectionStats => {
  const collectionGroups = groups.filter((g) =>
    collection.groupIds.includes(g.id)
  );

  let totalExpenses = 0;
  let totalLockerSpending = 0;
  let expenseCount = 0;
  const categoryMap = new Map<string, CategoryTotal>();
  const memberMap = new Map<string, MemberTotal>();
  const groupContributions: GroupContribution[] = [];

  collectionGroups.forEach((group) => {
    let groupTotal = 0;

    group.expenses.forEach((expense) => {
      totalExpenses += expense.amount;
      expenseCount++;
      groupTotal += expense.amount;

      // Track locker spending
      if (expense.paidBy === 'locker') {
        totalLockerSpending += expense.amount;
      } else if (expense.paidBy === 'multiple' && expense.paidByMultiple) {
        // For multiple payers, sum up locker contributions
        expense.paidByMultiple.forEach((contribution) => {
          if (contribution.payerId === 'locker') {
            totalLockerSpending += contribution.amount;
          }
        });
      }

      // Aggregate by category
      const existing = categoryMap.get(expense.category);
      if (existing) {
        existing.amount += expense.amount;
        existing.count++;
      } else {
        categoryMap.set(expense.category, {
          category: expense.category,
          amount: expense.amount,
          count: 1,
        });
      }

      // Aggregate by member (splits)
      expense.splits.forEach((split) => {
        const member = group.members.find((m) => m.id === split.memberId);
        if (member) {
          const existing = memberMap.get(member.name);
          if (existing) {
            existing.totalSpent += split.amount;
            const groupBreakdown = existing.groupBreakdown.find(
              (gb) => gb.groupId === group.id
            );
            if (groupBreakdown) {
              groupBreakdown.amount += split.amount;
            } else {
              existing.groupBreakdown.push({
                groupId: group.id,
                groupName: group.name,
                amount: split.amount,
              });
            }
          } else {
            memberMap.set(member.name, {
              memberName: member.name,
              totalSpent: split.amount,
              groupBreakdown: [
                {
                  groupId: group.id,
                  groupName: group.name,
                  amount: split.amount,
                },
              ],
            });
          }
        }
      });
    });

    groupContributions.push({
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      currency: group.currency,
      totalExpenses: groupTotal,
      expenseCount: group.expenses.length,
      percentage: 0, // Calculate after loop
    });
  });

  // Calculate percentages
  groupContributions.forEach((gc) => {
    gc.percentage =
      totalExpenses > 0 ? (gc.totalExpenses / totalExpenses) * 100 : 0;
  });

  // Sort group contributions by total (highest first)
  groupContributions.sort((a, b) => b.totalExpenses - a.totalExpenses);

  // Sort category breakdown by amount (highest first)
  const categoryBreakdown = Array.from(categoryMap.values()).sort(
    (a, b) => b.amount - a.amount
  );

  // Sort member breakdown by total spent (highest first)
  const memberBreakdown = Array.from(memberMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );

  return {
    totalExpenses,
    totalLockerSpending,
    totalPersonalSpending: totalExpenses - totalLockerSpending,
    groupBreakdown: groupContributions,
    categoryBreakdown,
    memberBreakdown,
    expenseCount,
  };
};

/**
 * Get combined expenses from all groups in a collection
 */
export const getCombinedExpenses = (
  collection: Collection,
  groups: Group[]
): CombinedExpense[] => {
  const collectionGroups = groups.filter((g) =>
    collection.groupIds.includes(g.id)
  );

  const combined: CombinedExpense[] = [];

  collectionGroups.forEach((group) => {
    group.expenses.forEach((expense) => {
      combined.push({
        ...expense,
        groupId: group.id,
        groupName: group.name,
        groupIcon: group.icon,
        currency: group.currency,
      });
    });
  });

  // Sort by date (newest first)
  return combined.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
};

/**
 * Aggregate member spending across all groups in a collection
 */
export const aggregateMemberSpending = (
  collection: Collection,
  groups: Group[]
): MemberTotal[] => {
  const collectionGroups = groups.filter((g) =>
    collection.groupIds.includes(g.id)
  );

  const memberMap = new Map<string, MemberTotal>();

  collectionGroups.forEach((group) => {
    group.expenses.forEach((expense) => {
      expense.splits.forEach((split) => {
        const member = group.members.find((m) => m.id === split.memberId);
        if (member) {
          const existing = memberMap.get(member.name);
          if (existing) {
            existing.totalSpent += split.amount;
            const groupBreakdown = existing.groupBreakdown.find(
              (gb) => gb.groupId === group.id
            );
            if (groupBreakdown) {
              groupBreakdown.amount += split.amount;
            } else {
              existing.groupBreakdown.push({
                groupId: group.id,
                groupName: group.name,
                amount: split.amount,
              });
            }
          } else {
            memberMap.set(member.name, {
              memberName: member.name,
              totalSpent: split.amount,
              groupBreakdown: [
                {
                  groupId: group.id,
                  groupName: group.name,
                  amount: split.amount,
                },
              ],
            });
          }
        }
      });
    });
  });

  // Sort by total spent (highest first)
  return Array.from(memberMap.values()).sort(
    (a, b) => b.totalSpent - a.totalSpent
  );
};

/**
 * Get category breakdown for a collection
 */
export const getCategoryBreakdown = (
  collection: Collection,
  groups: Group[]
): CategoryTotal[] => {
  const collectionGroups = groups.filter((g) =>
    collection.groupIds.includes(g.id)
  );

  const categoryMap = new Map<string, CategoryTotal>();

  collectionGroups.forEach((group) => {
    group.expenses.forEach((expense) => {
      const existing = categoryMap.get(expense.category);
      if (existing) {
        existing.amount += expense.amount;
        existing.count++;
      } else {
        categoryMap.set(expense.category, {
          category: expense.category,
          amount: expense.amount,
          count: 1,
        });
      }
    });
  });

  // Sort by amount (highest first)
  return Array.from(categoryMap.values()).sort((a, b) => b.amount - a.amount);
};

/**
 * Get group contributions for a collection
 */
export const getGroupContributions = (
  collection: Collection,
  groups: Group[]
): GroupContribution[] => {
  const collectionGroups = groups.filter((g) =>
    collection.groupIds.includes(g.id)
  );

  let totalExpenses = 0;
  const contributions: GroupContribution[] = [];

  // First pass: calculate totals
  collectionGroups.forEach((group) => {
    const groupTotal = group.expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    totalExpenses += groupTotal;

    contributions.push({
      groupId: group.id,
      groupName: group.name,
      groupIcon: group.icon,
      currency: group.currency,
      totalExpenses: groupTotal,
      expenseCount: group.expenses.length,
      percentage: 0, // Calculate in second pass
    });
  });

  // Second pass: calculate percentages
  contributions.forEach((contribution) => {
    contribution.percentage =
      totalExpenses > 0
        ? (contribution.totalExpenses / totalExpenses) * 100
        : 0;
  });

  // Sort by total (highest first)
  return contributions.sort((a, b) => b.totalExpenses - a.totalExpenses);
};

/**
 * Validate if a collection has valid group references
 */
export const validateCollectionGroups = (
  collection: Collection,
  groups: Group[]
): { valid: boolean; missingGroupIds: string[] } => {
  const groupIds = new Set(groups.map((g) => g.id));
  const missingGroupIds = collection.groupIds.filter(
    (id) => !groupIds.has(id)
  );

  return {
    valid: missingGroupIds.length === 0,
    missingGroupIds,
  };
};

/**
 * Clean up collection by removing invalid group references
 */
export const cleanupCollection = (
  collection: Collection,
  groups: Group[]
): Collection => {
  const groupIds = new Set(groups.map((g) => g.id));
  const validGroupIds = collection.groupIds.filter((id) => groupIds.has(id));

  return {
    ...collection,
    groupIds: validGroupIds,
    updatedAt: new Date(),
  };
};
