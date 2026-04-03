import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addTransaction,
  editTransaction,
  removeTransaction,
} from "../store/slices/userSlice";
import { setMode, toggleModal } from "../store/slices/pageSlice";
import type { Transaction } from "../../public/data";
import { formatMoney } from "./DashBoard";

const defaultForm = {
  date: new Date().toISOString().slice(0, 10),
  description: "",
  category: "",
  amount: 0,
  type: "income" as "income" | "expense",
};

const Modal = () => {
  const dispatch = useAppDispatch();
  const { active, mode, recentTransaction } = useAppSelector(
    (state) => state.page,
  );
  const transactions = useAppSelector((state) => state.user.transactions);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (mode === "edit" && recentTransaction) {
      setForm({
        date: new Date(recentTransaction.date).toISOString().slice(0, 10),
        description: recentTransaction.description,
        category: recentTransaction.category,
        amount: recentTransaction.amount,
        type: recentTransaction.type,
      });
    } else if (mode === "add") {
      setForm(defaultForm);
    } else if (mode === "search") {
      setQuery("");
      setForm(defaultForm);
    }
  }, [mode, recentTransaction]);

  const close = () => {
    dispatch(toggleModal());
    dispatch(setMode("search"));
  };

  const results = useMemo(() => {
    if (!active) return [];
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return transactions.filter((t) => {
      return (
        t.description.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term) ||
        t.type.toLowerCase().includes(term) ||
        String(t.amount).includes(term)
      );
    });
  }, [active, query, transactions]);

  if (!active) return null;

  const submitForm = (event: FormEvent<HTMLFormElement> | undefined) => {
    if (event) event.preventDefault();

    if (mode === "add") {
      const id = transactions.reduce((max, tx) => Math.max(max, tx.id), 0) + 1;
      const newTransaction: Transaction = {
        id,
        date: new Date(form.date),
        description: form.description,
        category: form.category,
        amount: Number(form.amount),
        type: form.type,
      };
      dispatch(addTransaction(newTransaction));
      close();
      return;
    }

    if (mode === "edit" && recentTransaction) {
      const updated: Transaction = {
        id: recentTransaction.id,
        date: new Date(form.date),
        description: form.description,
        category: form.category,
        amount: Number(form.amount),
        type: form.type,
      };
      dispatch(editTransaction(updated));
      close();
      return;
    }

    if (mode === "delete" && recentTransaction) {
      dispatch(removeTransaction(recentTransaction));
      close();
      return;
    }
  };

  const title =
    mode === "add"
      ? "Add Transaction"
      : mode === "edit"
        ? "Edit Transaction"
        : mode === "delete"
          ? "Delete Transaction"
          : "Search Transactions";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-8"
      onClick={(event) => {
        if (event.currentTarget === event.target) close();
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-xl rounded-[28px] bg-neutral-100 p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
            <p className="mt-2 text-sm text-neutral-600">
              {mode === "search"
                ? "Search transactions by description, category, type or amount."
                : mode === "delete"
                  ? "Confirm deletion of this transaction."
                  : "Fill the form and confirm to save your transaction details."}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full bg-neutral-100 p-3 text-neutral-600 transition hover:bg-neutral-200"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {mode === "search" ? (
          <div className="mt-5">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-2 text-sm"
              placeholder="search term"
              autoFocus
            />
            <div className="mt-3 max-h-64 overflow-auto rounded-xl bg-neutral-50 p-3">
              {query.trim().length === 0 ? (
                <p className="text-sm text-neutral-500">
                  Type to see matching transactions.
                </p>
              ) : results.length === 0 ? (
                <p className="text-sm text-neutral-500">No matches found.</p>
              ) : (
                <ul className="space-y-2 ">
                  {results.map((tx) => (
                    <li
                      key={tx.id}
                      className="rounded-lg flex items-center justify-between bg-neutral-100 p-2 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold">
                          {tx.description}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {new Date(tx.date).toLocaleDateString()} •{" "}
                          {tx.category} • {tx.type}
                        </p>
                      </div>
                      <p
                        className={`${tx.type === "income" ? "text-green-500" : "text-red-500"}`}
                      >
                        {tx.type === "expense" ? "-" : "+"}
                        {formatMoney(tx.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : mode === "delete" ? (
          <div className="mt-5 rounded-3xl bg-red-50 p-5 text-sm text-red-700">
            {recentTransaction ? (
              <>
                <p>
                  Delete <strong>{recentTransaction.description}</strong> (
                  {recentTransaction.category})?
                </p>
                <p className="mt-2">This action cannot be undone.</p>
              </>
            ) : (
              <p>Transaction not available.</p>
            )}
          </div>
        ) : (
          <form onSubmit={submitForm} className="mt-5 space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-neutral-700">
                Date
                <input
                  required
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, date: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2"
                />
              </label>
              <label className="space-y-1 text-sm text-neutral-700">
                Amount
                <input
                  required
                  type="number"
                  min={0}
                  step={1}
                  value={form.amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      amount: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-neutral-700">
              Description
              <input
                required
                type="text"
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                className="w-full rounded-xl border border-neutral-200 px-3 py-2"
              />
            </label>
            <label className="space-y-1 text-sm text-neutral-700">
              Category
              <input
                required
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full rounded-xl border border-neutral-200 px-3 py-2"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-1 text-sm text-neutral-700">
                Type
                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      type: e.target.value as "income" | "expense",
                    }))
                  }
                  className="w-full rounded-xl border border-neutral-200 px-3 py-2"
                >
                  <option value="income">Income</option>
                  <option value="expense">Expense</option>
                </select>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={close}
                className="rounded-2xl bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-2xl bg-primary-500 px-4 py-2 text-sm font-semibold text-neutral-50 hover:bg-primary-600"
              >
                {mode === "edit" ? "Save changes" : "Add transaction"}
              </button>
            </div>
          </form>
        )}

        {mode === "delete" && (
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-2xl bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => submitForm(undefined)}
              className="rounded-2xl bg-red-500 px-4 py-2 text-sm font-semibold text-neutral-100 hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        )}

        {mode === "search" && (
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={close}
              className="rounded-2xl bg-primary-500 px-4 py-2 text-sm font-semibold text-neutral-50 hover:bg-primary-600"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
