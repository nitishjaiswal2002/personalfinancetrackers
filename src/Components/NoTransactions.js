import React from 'react'
import transactions from "../Assets/transactions.svg"



function NoTransactions() {


  return (
    <div
    style={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        flexDirection:"column",
        marginBottom:"2rem",
    }}
 >
<img src={transactions} style={{width:"200px",Margin:"4rem"}} alt='notransaction'/>
<p style={{textAlign:"center",fontSize:"1.2rem"}}>You have no Transactions Currently</p>
    </div>
  )
}

export default NoTransactions