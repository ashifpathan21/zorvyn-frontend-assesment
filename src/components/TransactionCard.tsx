import type { Transaction } from "../../public/data";
import { formatMoney } from "../pages/DashBoard";

const TransactionCard = ({
  transaction,
}: {
  transaction: Transaction;
  
}) => {
  return (
    <div className="flex items-center justify-between gap-4 rounded-3xl bg-neutral-50 px-4 py-4">
      <div>
        <p className="font-semibold text-neutral-900">
          {transaction.description}
        </p>
        <p className="text-sm text-neutral-500">
          {transaction.category} ·{" "}
          {transaction.date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </p>
      </div>
      <div
        className={`text-sm font-semibold ${transaction.type === "income" ? "text-emerald-600" : "text-rose-500"}`}
      >
        {transaction.type === "income" ? "+" : "-"}
        {formatMoney(transaction.amount)}
      </div>
    </div>
  );
};

export default TransactionCard;
