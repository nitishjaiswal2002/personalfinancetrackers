import React, { useState } from 'react';
import { Select, Table, Radio } from 'antd';
import searchImg from "../../Assets/search.svg";
import { unparse, parse } from 'papaparse';
import { toast } from 'react-toastify';

function TransactionsTable({ transactions, addTransaction, fetchTransactions }) {
  const { Option } = Select;
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  const importFromCsv = (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    
    if (!file) {
      toast.error("No file selected");
      return;
    }

    parse(file, {
      header: true,
      complete: async (results) => {
        const transactionsToAdd = results.data.map(transaction => {
          return {
            ...transaction,
            amount: parseFloat(transaction.amount) || 0, // Ensure amount is a number
          };
        });

        // Filter out any invalid transactions
        const validTransactions = transactionsToAdd.filter(transaction => 
          transaction.name && transaction.amount && transaction.type && transaction.date
        );

        if (validTransactions.length > 0) {
          for (const transaction of validTransactions) {
            await addTransaction(transaction, true);
          }
          toast.success("All Transactions Added");
          fetchTransactions(); // Refresh the transactions list
        } else {
          toast.error("No valid transactions found in the CSV.");
        }
        event.target.value = null; // Reset the input value
      },
      error: (error) => {
        toast.error("Error parsing CSV: " + error.message);
      }
    });
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: 'Tag',
      dataIndex: 'tag',
      key: 'tag',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
  ];

  const filteredTransactions = transactions.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) &&
    (typeFilter ? item.type === typeFilter : true)
  );

  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "amount") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });

  const exportCSV = () => {
    const csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: "93vw", padding: "0rem 2rem" }}>
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        gap: "1rem",
        alignItems: "center",
        marginBottom: "1rem",
      }}>
        <div className="input-flex">
          <img src={searchImg} width="16" alt='search' />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter }
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          marginBottom: "1rem",
        }}>
          <h2>My Transactions</h2>

          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="">No Sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            width: "400px",
          }}>
            <button className="btn" onClick={exportCSV}>
              Export to CSV
            </button>

            <label for="file-csv" className="btn btn-blue">
              Import from CSV
            </label>

            <input
              id="file-csv"
              type="file"
              accept=".csv"
              required
              onChange={importFromCsv}
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table columns={columns} dataSource={sortedTransactions} />
      </div>
    </div>
  );
}

export default TransactionsTable;