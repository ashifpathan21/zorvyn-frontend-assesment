import Heading from "../components/Heading";
import Button from "../components/Button";
import FinanceChart from "../components/FinanceChart";
import StatCard from "../components/StatCard";
import { useAppSelector } from "../store/hooks";
import type { Transaction } from "../../public/data";
import {
  RiMoneyRupeeCircleLine,
  RiArrowUpSLine,
  RiArrowDownSLine,
} from "@remixicon/react";
import TransactionCard from "../components/TransactionCard";
import { exportToCSV, exportToPDF } from "../store/utils/export";

export interface IData {
  date: string;
  income: number;
  expense: number;
}
export const insights: (transactions: Transaction[]) => {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
  monthlyTransactions: Transaction[];
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyTrend: number;
  categoryTotals: Record<string, number>;
  totalOutflow: number;
  topCategories: { category: string; amount: number; percent: number }[];
  recentActivity: Transaction[];
  monthlyBalance: number;
} = (transactions) => {
  const latestTransaction = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  )[0];
  const referenceDate = latestTransaction ? latestTransaction.date : new Date();
  const currentMonth = referenceDate.getMonth();
  const currentYear = referenceDate.getFullYear();

  const totalIncome = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "income" ? sum + transaction.amount : sum,
    0,
  );

  const totalExpense = transactions.reduce(
    (sum, transaction) =>
      transaction.type === "expense" ? sum + transaction.amount : sum,
    0,
  );

  const totalBalance = totalIncome - totalExpense;

  const monthlyTransactions = transactions.filter(
    (transaction) =>
      transaction.date.getMonth() === currentMonth &&
      transaction.date.getFullYear() === currentYear,
  );

  const monthlyIncome = monthlyTransactions.reduce(
    (sum, transaction) =>
      transaction.type === "income" ? sum + transaction.amount : sum,
    0,
  );

  const monthlyExpense = monthlyTransactions.reduce(
    (sum, transaction) =>
      transaction.type === "expense" ? sum + transaction.amount : sum,
    0,
  );
  const monthlyBalance = monthlyIncome - monthlyExpense;
  const monthlyTrend =
    monthlyExpense === 0
      ? 18
      : Math.round(
          ((totalIncome - totalExpense) / Math.max(totalExpense, 1)) * 100,
        );

  const categoryTotals = transactions.reduce(
    (acc, transaction) => {
      if (transaction.type === "expense") {
        acc[transaction.category] =
          (acc[transaction.category] || 0) + transaction.amount;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalOutflow = Object.values(categoryTotals).reduce(
    (sum, amount) => sum + amount,
    0,
  );

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])

    .map(([category, amount]) => ({
      category,
      amount,
      percent: totalOutflow ? Math.round((amount / totalOutflow) * 100) : 0,
    }));

  const recentActivity = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 4);
  return {
    totalIncome,
    totalExpense,
    totalBalance,
    monthlyTransactions,
    monthlyIncome,
    monthlyExpense,
    monthlyTrend,
    categoryTotals,
    totalOutflow,
    topCategories,
    recentActivity,
    monthlyBalance,
  };
};
export const formatMoney = (value: number) => `₹${value.toLocaleString()}`;
const DashBoard = ({
  changeToTransaction,
}: {
  changeToTransaction: () => void;
}) => {
  const transactions = useAppSelector((state) => state.user.transactions);
  const {
    monthlyExpense,
    monthlyIncome,
    monthlyTrend,
    recentActivity,
    topCategories,
    totalBalance,
    totalOutflow,
  } = insights(transactions);
  const groupByDate = (transactions: Transaction[]) => {
    const map = new Map();
    transactions.forEach((t) => {
      const key = t.date.toISOString().split("T")[0];
      if (!map.has(key)) {
        map.set(key, {
          date: key,
          income: 0,
          expense: 0,
        });
      }
      const entry = map.get(key);
      if (t.type === "income") {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
    });
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  };

  const data: IData[] = groupByDate(transactions);

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <Heading
            heading="Financial Overview"
            subheading="Real-time performance tracking for enterprise accounts"
            size="lg"
          />
          <p className="mt-2 max-w-xl text-sm text-neutral-500">
            Monitor cash flow, spending allocation, and upcoming activity from
            one beautiful dashboard.
          </p>
        </div>

        <div className="flex justify-between flex-wrap items-center gap-3">
          <Button
            onClick={() => {
              exportToCSV(transactions);
            }}
            type="secondary"
            text="Download CSV"
          />
          <Button
            onClick={() => {
              exportToPDF(transactions);
            }}
            type="primary"
            text="Download PDF"
          />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Balance"
          icon={<RiMoneyRupeeCircleLine className="h-5 w-5" />}
          value={formatMoney(totalBalance)}
          subtitle="Net portfolio position"
          trend={monthlyTrend}
          color="indigo"
        />

        <StatCard
          title="Monthly Income"
          icon={<RiArrowUpSLine className="h-5 w-5" />}
          value={formatMoney(monthlyIncome)}
          subtitle="This month earnings"
          trend={monthlyIncome >= monthlyExpense ? 12 : -8}
          color="green"
        />

        <StatCard
          title="Monthly Expenses"
          icon={<RiArrowDownSLine className="h-5 w-5" />}
          value={formatMoney(monthlyExpense)}
          subtitle="This month spend"
          trend={monthlyExpense <= monthlyIncome ? -12 : 6}
          color="orange"
        />
      </section>

      <section className="flex flex-col gap-15 md:gap-5 lg:gap-4">
        <FinanceChart data={data} />

        <div className="grid gap-6">
          <div className="rounded-3xl bg-neutral-50 p-6 shadow-sm border border-neutral-200">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  Spending allocation
                </p>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                  Expense distribution
                </h3>
              </div>
              <div className="rounded-2xl bg-neutral-100 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-600">
                Total out
              </div>
            </div>

            <div className="space-y-4">
              {topCategories.map((category) => (
                <div key={category.category} className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-neutral-700">
                    <span>{category.category}</span>
                    <span>{category.percent}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-primary-500"
                      style={{ width: `${category.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-3xl bg-neutral-50 p-4 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <p className="font-medium text-neutral-900">Total outflows</p>
                <span className="text-neutral-500">
                  {formatMoney(totalOutflow)}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl w-full bg-neutral-100 p-6 shadow-sm border border-neutral-200">
            <div className="mb-5 flex items-center w-full justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
                  Recent activity
                </p>
                <h3 className="mt-3 text-xl font-semibold text-neutral-900">
                  Latest transactions
                </h3>
              </div>
              <Button
                type="ghost"
                text="View all"
                onClick={() => {
                  changeToTransaction();
                }}
                clicked={false}
              />
            </div>

            <div className="space-y-3">
              {recentActivity.map((transaction) => (
                <TransactionCard
                  transaction={transaction}
                  key={transaction.id}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DashBoard;
