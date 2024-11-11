import React from 'react';
import { Line } from '@ant-design/charts';
import { Pie } from '@ant-design/charts';

function ChartComponent({ sortedTransactions }) {
  // Ensure sortedTransactions is an array
  const data = Array.isArray(sortedTransactions) ? sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  }) : [];

  // Filter and structure spending data
  const SpendingData = sortedTransactions
    .filter((transaction) => transaction.type === "expense")
    .map((transaction) => ({
      tag: transaction.tag,
      amount: transaction.amount,
    }));

  // Reduce spending data to get total amounts by tag
  let finalSpendings = SpendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});

  // Initialize newSpendings with default values
  let newSpendings = [
    { tag: "food", amount: 0 },
    { tag: "education", amount: 0 },
    { tag: "office", amount: 0 },
  ];

  SpendingData.forEach((item) => {
    if (item.tag === "food") {
      newSpendings[0].amount += item.amount;
    } else if (item.tag === "education") {
      newSpendings[1].amount += item.amount;
    } else {
      newSpendings[2].amount += item.amount;
    }
  });

  const config = {
    data,
    width: 500,
    height: 400,
    autoFit: true,
    xField: 'date',
    yField: 'amount',
  };

  const spendingConfig = {
    data: newSpendings,
    width: 500,
    height: 400,
    angleField: 'amount',
    colorField: 'tag',
    color: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFC300'],
  };

  let chart;
  let pieChart;

  // Check if there are any income or expense transactions
  const hasIncome = sortedTransactions.some(transaction => transaction.type === "income");
  const hasExpense = sortedTransactions.some(transaction => transaction.type === "expense");

  return (
    <div className='charts-wrapper'>
      <div>
        <h2 style={{ marginTop: 0, marginBottom: "10px" }}>Your Analytics</h2>
        {data.length > 0 ? (
          <Line {...config} onReady={(chartInstance) => (chart = chartInstance)} />
        ) : (
          <p>You haven't added any income.</p>
        )}
      </div>
      <div>
        <h2 style={{margin:"20px"}}>Your Spending</h2>
        {hasExpense ? (
          <Pie {...spendingConfig} onReady={(chartInstance) => (pieChart = chartInstance)} style={{width:"400px"}}/>
        ) : (
          <p>You haven't added any expenses.</p>
        )}
      </div>
    </div>
  );
}

export default ChartComponent;