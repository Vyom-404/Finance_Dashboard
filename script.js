let transactions = [];
const incomeAmount = document.getElementById('income-amount');
const expenseAmount = document.getElementById('expense-amount');
const incomebtn = document.getElementById('add-income-btn');
const expensebtn = document.getElementById('add-expense-btn');
const expenseDate = document.getElementById('expense-date');
const expenseDesc = document.getElementById('expense-description');
const incomeDate = document.getElementById('income-date');
const incomeDesc = document.getElementById('income-description');
const totalIncome = document.getElementById('total-income');
const totalExpense = document.getElementById('total-expenses');
const balance = document.getElementById('total-savings');
const transactionHistory = document.getElementById('transaction-history');
const savedData = localStorage.getItem("transactions");
let visibleTransactionscount = 5;
const loadMoreBtn = document.getElementById('load-more');
let selectedCategory = null;
const categoryButtons = document.querySelectorAll('#food-btn, #transport-btn, #entertainment-btn, #others-btn');

if (savedData) {
    transactions = JSON.parse(savedData);
    updateAccountSummary();
    getTransactionhistory();
}

incomebtn.addEventListener("click", function () {
    const amount = Number(incomeAmount.value);
    const date = incomeDate.value;
    const description = incomeDesc.value;

    if (amount <= 0) {
        alert("Please enter a valid value");
        return;
    }
    if (!date || !description) {
        alert("Fill all fields");
        return;
    }
    const transaction = {
        type: 'income',
        amount: amount,
        date: date,
        description: description
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    visibleTransactionscount = 5;
    incomeAmount.value = '';
    incomeDate.value = '';
    incomeDesc.value = '';
    updateAccountSummary();
    getTransactionhistory();
});

expensebtn.addEventListener("click", function () {
    const amount = Number(expenseAmount.value);
    const date = expenseDate.value;
    const description = expenseDesc.value;
    if (amount <= 0) {
        alert("Please enter a valid value");
        return;
    }
    if (!date || !description) {
        alert("Fill all fields");
        return;
    }
    if (selectedCategory === null) {
    alert("Please select a category");
    return;
    }
    const transaction = {
        type: 'expense',
        amount: amount,
        date: date,
        description: description,
        category: selectedCategory
    };
    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    selectedCategory = null;
    for (let i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].classList.remove("active");
    }
    visibleTransactionscount = 5;
    expenseAmount.value = '';
    expenseDate.value = '';
    expenseDesc.value = '';
    updateAccountSummary();
    getTransactionhistory();
});

function updateAccountSummary() {
    let totalInc = 0;
    let totalExp = 0;
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].type === 'income') {
            totalInc += transactions[i].amount;
        }
        if (transactions[i].type === 'expense') {
            totalExp += transactions[i].amount;
        }
    }
    totalIncome.textContent = totalInc;
    totalExpense.textContent = totalExp;
    balance.textContent = totalInc - totalExp;
}

function getTransactionhistory() {
    transactionHistory.innerHTML = '';
    let count = 0;

    for (let i = transactions.length - 1; i >= 0; i--) {
        if (count === visibleTransactionscount) {
            break;
        }
        const t = transactions[i];
        const item = document.createElement('div');
        if (t.type === 'income') {
            item.textContent = `Income: ₹${t.amount} | Date: ${t.date} | Description: ${t.description}`;
        } else {
            item.textContent = `Expense: ₹${t.amount} | Date: ${t.date} | Description: ${t.description} | Category: ${t.category}`;
        }
        transactionHistory.appendChild(item);
        count++;
    }
    if (visibleTransactionscount >= transactions.length) {
        loadMoreBtn.style.display = "none";
    } else {
        loadMoreBtn.style.display = "block";
    }
}

loadMoreBtn.addEventListener("click", function () {
    visibleTransactionscount += 10;
    getTransactionhistory();
})

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].addEventListener("click", function () {
        if (categoryButtons[i].classList.contains("active")) {
            categoryButtons[i].classList.remove("active");
            selectedCategory = null;
            return;
        }

        for (let j = 0; j < categoryButtons.length; j++) {
            categoryButtons[j].classList.remove("active");
        }

        categoryButtons[i].classList.add("active");

        if (categoryButtons[i].id === "food-btn") {
            selectedCategory = "Food";
        } else if (categoryButtons[i].id === "transport-btn") {
            selectedCategory = "Transport";
        } else if (categoryButtons[i].id === "entertainment-btn") {
            selectedCategory = "Entertainment";
        } else if (categoryButtons[i].id === "others-btn") {
            selectedCategory = "Misc";
        }

        console.log("Selected category:", selectedCategory);
    });
}