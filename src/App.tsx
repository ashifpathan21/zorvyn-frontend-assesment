import { useState, type ReactElement } from "react";
import Navbar from "./components/Navbar";
import Button from "./components/Button";
import {
  RiDashboardLine,
  RiWallet2Fill,
  RiLineChartLine,
} from "@remixicon/react";
import DashBoard from "./pages/DashBoard";
import Transactions from "./pages/Transactions";
import Insights from "./pages/Insights";
import Modal from "./pages/Modal";

const App = () => {
  const icons = [<RiDashboardLine />, <RiWallet2Fill />, <RiLineChartLine />];
  const sections = ["Dashboard", "Transactions", "Insights"] as const;
  type TabName = (typeof sections)[number];
  const [activeTab, setActiveTab] = useState<TabName>("Dashboard");
  const changeToTransaction = () => {
    setActiveTab("Transactions");
  };
  const tabs: Record<TabName, ReactElement> = {
    Dashboard: <DashBoard changeToTransaction={changeToTransaction} />,
    Transactions: <Transactions />,
    Insights: <Insights />,
  };

  return (
    <div className="min-h-screen w-full  bg-neutral-100 text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-425">
        <aside className="hidden w-75 shrink-0 flex-col border-r border-neutral-200 bg-neutral-50 p-6 lg:flex">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 rounded-3xl bg-primary-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-500 text-neutral-50 shadow-sm">
                <RiWallet2Fill className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900">
                  Precision Finance
                </h2>
                <p className="text-sm text-neutral-500">Enterprise tier</p>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-3">
            {sections.map((section, index) => (
              <Button
                key={section}
                type="side"
                startIcon={icons[index]}
                text={section}
                onClick={() => setActiveTab(section)}
                clicked={activeTab === section}
              />
            ))}
          </nav>
        </aside>

        <div className="flex flex-1 flex-col bg-neutral-100">
          <Navbar />
          <div className="flex items-center justify-between gap-2 border-b border-neutral-200 bg-neutral-50 p-3 lg:hidden">
            {sections.map((section, index) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveTab(section)}
                className={`flex-1 rounded-2xl px-3 py-2 text-xs font-semibold transition ${
                  activeTab === section
                    ? "bg-primary-500 text-neutral-50"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {icons[index]}
                  <span>{section}</span>
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 p-4 min-h-screen  h-full bg-neutral-100  md:p-6 lg:px-8 relative">
            {tabs[activeTab]}
            <Modal />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
