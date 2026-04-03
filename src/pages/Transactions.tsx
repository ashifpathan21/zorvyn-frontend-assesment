import {
  RiAddLargeLine,
  RiDeleteBin6Fill,
  RiMoneyRupeeCircleFill,
  RiPencilAi2Fill,
} from "@remixicon/react";
import { useState } from "react";
import Button from "../components/Button";
import Heading from "../components/Heading";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { formatMoney, insights } from "./DashBoard";
import StatCard from "../components/StatCard";
import Input from "../components/Input";
import {
  setMode,
  setRecentTransaction,
  toggleModal,
} from "../store/slices/pageSlice";
import { exportToCSV, exportToPDF } from "../store/utils/export";

const Transactions = () => {
  const role = useAppSelector((state) => state.user.role);
  const transactions = useAppSelector((state) => state.user.transactions);
  const { monthlyBalance, monthlyTrend, categoryTotals } =
    insights(transactions);
  const dispatch = useAppDispatch();
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("All");

  const filteredTransactions = transactions
    .filter((transaction) => {
      const matchesSearch = transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || transaction.category === selectedCategory;

      const matchesType =
        selectedType === "All" || transaction.type === selectedType;

      return matchesSearch && matchesCategory && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === "asc" ? diff : -diff;
      }

      if (sortBy === "amount") {
        const diff = a.amount - b.amount;
        return sortOrder === "asc" ? diff : -diff;
      }

      return 0;
    });
  return (
    <main className="space-y-4 bg-neutral-100">
      <section className="flex justify-between items-center w-full">
        <Heading
          heading="Transactions"
          subheading="Manage enterprise-wide fiscal flows and reconcilation"
          size="lg"
        />
        {role === "admin" && (
          <Button
            text="Add Transaction"
            onClick={() => {
              dispatch(setMode("add"));
              dispatch(toggleModal());
            }}
            type="primary"
            startIcon={<RiAddLargeLine />}
          />
        )}
      </section>
      <section className="flex flex-col md:flex-row overflow-hidden lg:flex-row items-start w-full gap-3 ">
        <section className="flex p-4 rounded-xl py-6 bg-primary-500  flex-col items-start gap-2">
          <div className="flex w-full  flex-col gap-2 text-neutral-100 p-2 ">
            <label htmlFor="">Search Records</label>
            <Input
              type="text"
              variant="search"
              className="text-primary-800"
              placeholder="Merchant or Description"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <section className="flex-1  flex  items-center gap-3 ">
            <div className="flex flex-col gap-2 text-neutral-100 p-2 ">
              <label htmlFor="category">Category</label>
              <select
                className="bg-neutral-100 text-primary-800 p-2 px-4  rounded-xl "
                name="category"
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All</option>
                {Object.keys(categoryTotals).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2 text-neutral-100 p-2 ">
              <label htmlFor="type">Type</label>
              <select
                className="bg-neutral-100 text-primary-800 p-2 px-4 rounded-xl "
                name="type"
                id="type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="All">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div className="flex flex-col gap-2 text-neutral-100 p-2 ">
              <label>Sort By</label>
              <select
                className="bg-neutral-100 text-primary-800 p-2 px-4 rounded-xl"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
              >
                <option value="date">Date</option>
                <option value="amount">Amount</option>
              </select>
            </div>

            <div className="flex flex-col gap-2 text-neutral-100 p-2 ">
              <label>Order</label>
              <select
                className="bg-neutral-100 text-primary-800 p-2 px-4 rounded-xl"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </section>
        </section>
        <StatCard
          icon={<RiMoneyRupeeCircleFill className="h-5 w-5" />}
          title="Total Volume (30D)"
          value={formatMoney(monthlyBalance)}
          color="blue"
          subtitle="from last month"
          trend={monthlyTrend}
        />
      </section>
      <div className="flex  flex-wrap items-center gap-3">
        <Button
          onClick={() => {
            exportToCSV(filteredTransactions);
          }}
          type="secondary"
          text="Download CSV"
        />
        <Button
          onClick={() => {
            exportToPDF(filteredTransactions);
          }}
          type="primary"
          text="Download PDF"
        />
      </div>
      <section>
        <div className="overflow-x-auto bg-neutral-100 min-h-screen">
          <table className="min-w-full border-collapse ">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-4 py-2  text-left">Date</th>
                <th className="px-4 py-2  text-left">Description</th>
                <th className="px-4 py-2  text-left">Category</th>
                <th className="px-4 py-2  text-left">Type</th>
                <th className="px-4 py-2  text-right">Amount</th>
                {role === "admin" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody className="capitalize">
              {filteredTransactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="odd:bg-neutral-100 even:bg-primary-100 "
                >
                  <td className="px-4 py-2 ">
                    {transaction.date.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 ">{transaction.description}</td>
                  <td className="px-4 py-2 ">{transaction.category}</td>
                  <td
                    className={
                      "px-4 py-2  " +
                      ` ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`
                    }
                  >
                    {transaction.type}
                  </td>
                  <td
                    className={
                      "px-4 py-2  text-right" +
                      ` ${transaction.type === "income" ? "text-green-600" : "text-red-600"}`
                    }
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatMoney(transaction.amount)}
                  </td>
                  {role === "admin" && (
                    <td className="px-4 py-2 flex gap-3 items-center justify-center  ">
                      <button
                        onClick={() => {
                          dispatch(setMode("edit"));
                          dispatch(setRecentTransaction(transaction));
                          dispatch(toggleModal());
                        }}
                        className="bg-primary-500 hover:bg-primary-600 rounded-full p-2 "
                      >
                        <RiPencilAi2Fill className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => {
                          dispatch(setMode("delete"));
                          dispatch(setRecentTransaction(transaction));
                          dispatch(toggleModal());
                        }}
                        className="bg-primary-500 hover:bg-primary-600 rounded-full p-2 "
                      >
                        <RiDeleteBin6Fill className="h-3 w-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default Transactions;
