export interface Transaction {
  id: number,
  date: Date,
  description: string,
  category: string,
  amount: number,
  type: 'income' | 'expense'
}

export const transactions = [
  {
    id: 1,
    date: new Date(2026, 2, 1), // March (0-indexed)
    description: "Salary",
    category: "Income",
    amount: 50000,
    type: "income",
  },
  {
    id: 2,
    date: new Date(2026, 2, 2),
    description: "Swiggy Order",
    category: "Food",
    amount: 450,
    type: "expense",
  },
  {
    id: 3,
    date: new Date(2026, 2, 3),
    description: "Uber Ride",
    category: "Transport",
    amount: 300,
    type: "expense",
  },
  {
    id: 4,
    date: new Date(2026, 2, 5),
    description: "Amazon Purchase",
    category: "Shopping",
    amount: 2200,
    type: "expense",
  },
  {
    id: 5,
    date: new Date(2026, 2, 7),
    description: "Freelance Payment",
    category: "Income",
    amount: 12000,
    type: "income",
  },
  {
    id: 6,
    date: new Date(2026, 2, 8),
    description: "Electricity Bill",
    category: "Bills",
    amount: 1800,
    type: "expense",
  },
  {
    id: 7,
    date: new Date(2026, 2, 10),
    description: "Gym Membership",
    category: "Health",
    amount: 1500,
    type: "expense",
  },
  {
    id: 8,
    date: new Date(2026, 2, 12),
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 649,
    type: "expense",
  },
  {
    id: 9,
    date: new Date(2026, 2, 15),
    description: "Stock Profit",
    category: "Investment",
    amount: 7000,
    type: "income",
  },
  {
    id: 10,
    date: new Date(2026, 2, 18),
    description: "Groceries",
    category: "Food",
    amount: 2500,
    type: "expense",
  }
];