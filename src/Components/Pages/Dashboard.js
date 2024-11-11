import React, { useState, useEffect } from 'react';
import Header from '../Header/Index';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cards from '../cards/Index';
import AddExpenseModal from '../Modals/addExpense';
import AddIncomeModal from '../Modals/addIncome';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from "../../firebase";
import { toast } from 'react-toastify';
import moment from "moment";
import TransactionsTable from '../transactionsTable/Index';
import ChartComponent from '../Charts/Index';
import NoTransactions from '../NoTransactions';


const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = async (values, type) => {
    const newTransaction = {
      type,
      date: moment(values.date).format("YYYY-MM-DD"),
      amount: parseFloat(values.amount) || 0, // Ensure amount is a number
      tag: values.tag,
      name: values.name,
    };
    await addTransaction(newTransaction);
    type === "income" ? handleIncomeCancel() : handleExpenseCancel();
  };

  const addTransaction = async (transaction) => {
    try {
      const docRef = await addDoc(collection(db, `users/${user.uid}/transactions`), transaction);
      console.log("Document written with ID: ", docRef.id);
      toast.success("Transaction Added!");
      setTransactions((prevTransactions) => [...prevTransactions, transaction]);
      calculateBalance();
    } catch (e) {
      console.error("Error adding document:", e);
      toast.error("Couldn't add transaction");
    }
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expensesTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.amount && !isNaN(transaction.amount)) { // Check if amount is a valid number
        if (transaction.type === "income") {
          incomeTotal += transaction.amount;
        } else if (transaction.type === "expense") {
          expensesTotal += transaction.amount;
        }
      }
    });

    setIncome(incomeTotal);
    setExpense(expensesTotal);
    setTotalBalance(incomeTotal - expensesTotal);
  };

  const fetchTransactions = async () => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      const transactionArray = querySnapshot.docs.map(doc => doc.data());
      setTransactions(transactionArray);
      console.log("Transaction array", transactionArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  };

 let sortedTransactions= transactions.sort((a,b)=>{
    return new Date(a.date)- new Date(b.date);
 })

    
  return (
    <div>
      <ToastContainer />
      <Header />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            transactions={transactions}
            showExpenseModal={showExpenseModal}
           showIncomeModal={showIncomeModal}
          />
          {transactions.length!==0?<ChartComponent sortedTransactions={sortedTransactions}/>:<NoTransactions/>}
        
          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />

          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          <TransactionsTable transactions={transactions} addTransaction={addTransaction} fetchTransactions={fetchTransactions} />
        </>
      )}
    </div>
  );
};

export default Dashboard;