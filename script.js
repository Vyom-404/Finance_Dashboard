let transactions = [];
const incomeAmount = document.getElementById('income-amount');  
const expenseAmount = document.getElementById('expense-amount');
const incomebtn = document.getElementById('add-income-btn');
const expensebtn = document.getElementById('add-expense-btn');
const totalIncome = document.getElementById('check-income-btn');
const totalExpense = document.getElementById('check-expense-btn');
const balance = document.getElementById('check-Remainingbalance-btn');
const expenseDate = document.getElementById('expense-date');
const expenseDesc = document.getElementById('expense-description');











incomebtn.addEventListener("click", function() {
    const amount = Number(incomeAmount.value);
    if (amount <= 0){
        alert("Please enter a valid value");
        return;
    }
    const transaction = {
        type: 'income',
        amount: amount
    };
    transactions.push(transaction);
    incomeAmount.value = '';
    console.log(transactions);
});

expensebtn.addEventListener("click" , function() {
    const amount = Number(expenseAmount.value);
    const date = expenseDate.value;
    const description = expenseDesc.value;
    if (amount <= 0){
        alert("Please enter a valid value");
        return;
    }
    if (!date || !description) {
        alert("Fill all fields");
        return;
    }
    const transaction = {
        type: 'expense',
        amount: amount,
        date: date,
        description: description
    };
    transactions.push(transaction);
    expenseAmount.value = '';
    expenseDate.value = '';
    expenseDesc.value = '';
    console.log(transactions);
});

totalIncome.addEventListener("click" , function(){
    let totalIncome = 0 ;
    for(let i = 0 ; i <transactions.length ; i++){
        if(transactions[i].type === "income"){
            totalIncome = totalIncome + transactions[i].amount;
        }
    }
    console.log("Total Income: " + totalIncome);
});

totalExpense.addEventListener("click" , function(){
    let totalExpense = 0 ;
    for(let i = 0 ; i <transactions.length ; i++){
        if(transactions[i].type === "expense"){
            totalExpense = totalExpense + transactions[i].amount;
        }
    }
    console.log("Total Expense: " + totalExpense);
});

balance.addEventListener("click" , function(){
    let totalIncome = 0 ;
    let totalExpense = 0 ;
    for(let i = 0 ; i <transactions.length ; i++){
        if(transactions[i].type === "income"){
            totalIncome = totalIncome + transactions[i].amount;
        } else if(transactions[i].type === "expense"){
            totalExpense = totalExpense + transactions[i].amount;
        }
    }
    const remainingBalance = totalIncome - totalExpense;
    console.log("Remaining Balance: " + remainingBalance);
});

