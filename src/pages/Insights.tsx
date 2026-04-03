import Heading from "../components/Heading";
import { useAppSelector } from "../store/hooks";
import { useState, useMemo, useCallback } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

const Insights = () => {
  const transactions = useAppSelector((state) => state.user.transactions);

  const [expenseRange, setExpenseRange] = useState<"30" | "60" | "all">("30");
  const [incomeRange, setIncomeRange] = useState<"30" | "60" | "all">("30");
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const generateDateRange = (days: number) => {
    const today = new Date();
    const arr: string[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      arr.push(d.toISOString().split("T")[0]);
    }
    return arr;
  };

  const getChartData = useCallback(
    (type: "expense" | "income", range: "30" | "60" | "all") => {
      let dateMap: Record<string, number> = {};

      if (range === "all") {
        transactions.forEach((t) => {
          const key = new Date(t.date).toISOString().split("T")[0];
          if (!dateMap[key]) dateMap[key] = 0;
          if (t.type === type) dateMap[key] += t.amount;
        });
      } else {
        const days = parseInt(range);
        const dates = generateDateRange(days);
        dates.forEach((d) => (dateMap[d] = 0));

        transactions.forEach((t) => {
          const key = new Date(t.date).toISOString().split("T")[0];
          if (dateMap[key] !== undefined && t.type === type) {
            dateMap[key] += t.amount;
          }
        });
      }

      return Object.entries(dateMap).map(([date, value]) => ({
        date,
        value,
      }));
    },
    [transactions],
  );

  const expenseData = useMemo(
    () => getChartData("expense", expenseRange),
    [getChartData, expenseRange],
  );

  const incomeData = useMemo(
    () => getChartData("income", incomeRange),
    [getChartData, incomeRange],
  );

  const totalExpense = expenseData.reduce((a, b) => a + b.value, 0);
  const totalIncome = incomeData.reduce((a, b) => a + b.value, 0);

  const avgExpense =
    expenseData.length > 0 ? totalExpense / expenseData.length : 0;

  const projectedMonthly = avgExpense * 30;

  const peakExpense = Math.max(...expenseData.map((d) => d.value), 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const handleClick = useCallback((index: number) => {
    setClickedIndex(index);
  }, []);

  const formatValue = (value: any) => [`₹${value ?? 0}`, "Amount"];
  const formatLabel = (label: any) => new Date(label).toDateString();

  const RenderChart = ({
    data,
    clickColor,
    range,
    setRange,
  }: {
    data: { date: string; value: number }[];
    clickColor: string;
    range: "30" | "60" | "all";
    setRange: (r: "30" | "60" | "all") => void;
  }) => (
    <div>
      <div className="flex gap-2 mb-3">
        {["30", "60", "all"].map((r) => (
          <button
            key={r}
            onClick={() => setRange(r as any)}
            className={`px-2 py-1 text-xs rounded ${
              range === r
                ? "bg-primary-600 text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {r === "all" ? "ALL" : `${r}D`}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <XAxis dataKey="date" hide />
          <YAxis hide />
          <Tooltip formatter={formatValue} labelFormatter={formatLabel} />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            activeBar={{ fill: "var(--color-secondary-500)" }}
          >
            {data.map((_, index) => {
              const isClicked = index === clickedIndex;
              return (
                <Cell
                  key={index}
                  fill={isClicked ? clickColor : "var(--color-neutral-400)"}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleClick(index)}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <main className="space-y-6">
      <section>
        <Heading
          heading="Financial Insights"
          subheading={`Analysis ending ${new Date().toDateString()}`}
          size="lg"
        />
      </section>

      <section className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 bg-neutral-100 p-4 rounded-xl shadow">
          <p className="text-sm mb-2 text-neutral-600">Expense</p>
          <RenderChart
            data={expenseData}
            clickColor="var(--color-primary-600)"
            range={expenseRange}
            setRange={setExpenseRange}
          />
        </div>

        <div className="flex-1 bg-neutral-100 p-4 rounded-xl shadow">
          <p className="text-sm mb-2 text-neutral-600">Income</p>
          <RenderChart
            data={incomeData}
            clickColor="var(--color-tertiary-600)"
            range={incomeRange}
            setRange={setIncomeRange}
          />
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-neutral-100 p-4 rounded-xl shadow">
          <p className="text-xs text-neutral-600 mb-1">SPENDING VELOCITY</p>
          <h2 className="text-2xl font-bold text-primary-600 mb-3">
            ₹{totalExpense.toLocaleString()}
          </h2>
          <RenderChart
            data={expenseData}
            clickColor="var(--color-primary-600)"
            range={expenseRange}
            setRange={setExpenseRange}
          />
        </div>

        <div className="bg-neutral-100 p-4 rounded-xl flex flex-col items-start justify-between shadow space-y-4">
          <div>
            <p className="text-xs text-neutral-600">PEAK SPENDING</p>
            <h3 className="text-lg font-semibold text-primary-600">
              ₹{peakExpense.toLocaleString()}
            </h3>
          </div>

          <div>
            <p className="text-xs text-neutral-600">MONTHLY SHIFT</p>
            <h3 className="text-sm font-semibold text-secondary-600">
              ₹{(totalExpense - totalIncome).toLocaleString()}
            </h3>
          </div>

          <div>
            <p className="text-xs text-neutral-600">BURN RATE</p>
            <h3 className="text-sm font-semibold text-tertiary-600">
              ₹{avgExpense.toFixed(2)}
            </h3>
            <p className="text-xs text-neutral-500">
              Projected ₹{projectedMonthly.toFixed(2)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-neutral-100 p-4 rounded-xl shadow">
        <div className="flex justify-between mb-4">
          <h3 className="text-sm font-semibold">
            Recent Impact Transactions
          </h3>
        </div>

        <div className="grid grid-cols-4 text-xs text-neutral-500 mb-2">
          <span>CATEGORY</span>
          <span>DESCRIPTION</span>
          <span>IMPACT</span>
          <span className="text-right">AMOUNT</span>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((t) => {
            const impact =
              totalExpense > 0
                ? ((t.amount / totalExpense) * 100).toFixed(1)
                : "0";

            return (
              <div
                key={t.id}
                className="grid grid-cols-4 text-sm items-center"
              >
                <span className="px-2 py-1 bg-neutral-200 rounded-xl text-xs w-fit">
                  {t.category}
                </span>

                <span>{t.description}</span>

                <span
                  className={`text-xs ${
                    t.type === "expense"
                      ? "text-secondary-600"
                      : "text-tertiary-600"
                  }`}
                >
                  {t.type === "expense" ? "-" : "+"}
                  {impact}%
                </span>

                <span className="text-right">
                  ₹{t.amount.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default Insights;