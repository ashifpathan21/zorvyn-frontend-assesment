import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Transaction } from "../../../public/data";

export const exportToPDF = (transactions: Transaction[]) => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.text("Transaction Report", 14, 15);

    // Table Data
    const tableData = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type.toUpperCase(),
        t.category,
        t.description,
        `${t.amount.toLocaleString()}`,
    ]);

    // Totals
    const totalIncome = transactions
        .filter((t) => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = totalIncome - totalExpense;

    autoTable(doc, {
        startY: 25,
        head: [["Date", "Type", "Category", "Description", "Amount"]],
        body: tableData,
    });

    // Summary section
    const finalY = (doc as any).lastAutoTable.finalY + 10;

    doc.setFontSize(12);
    doc.text(`Total Income: ${totalIncome.toLocaleString()}`, 14, finalY);
    doc.text(`Total Expense: ${totalExpense.toLocaleString()}`, 14, finalY + 7);
    doc.text(`Net Balance: ${balance.toLocaleString()}`, 14, finalY + 14);

    doc.save("transactions.pdf");
};



export const exportToCSV = (transactions: Transaction[]) => {
    const headers = [
        "Date",
        "Type",
        "Category",
        "Description",
        "Amount",
    ];

    const rows = transactions.map((t) => [
        new Date(t.date).toLocaleDateString(),
        t.type,
        t.category,
        `"${t.description}"`, // protect commas
        t.amount,
    ]);

    const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers, ...rows].map((row) => row.join(",")).join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};