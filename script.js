let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let expenseChartObj = null;
let incomeExpenseChartObj = null;

let visibleCount = 7;
const STEP = 10;

/* DOM */
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const addBtn = document.getElementById("addBtn");

const filterType = document.getElementById("filterType");
const filterMonth = document.getElementById("filterMonth");
const filterYear = document.getElementById("filterYear");

const transactionList = document.getElementById("transactionList");
const showMoreBtn = document.getElementById("showMoreBtn");
const emptyState = document.getElementById("emptyState");
const chartEmpty = document.getElementById("chartEmpty");

const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");
const balance = document.getElementById("balance");

const expenseCanvas = document.getElementById("expenseChart");
const incomeExpenseCanvas = document.getElementById("incomeExpenseChart");

const toggleChartBtn = document.getElementById("toggleChartBtn");
const chartTitle = document.getElementById("chartTitle");

/* Utils */
const formatCurrency = amt => "₹" + amt.toLocaleString("en-IN");

/* Category toggle */
categoryInput.style.display = "none";
categoryInput.disabled = true;

typeInput.addEventListener("change", () => {
    const isIncome = typeInput.value === "income";
    categoryInput.style.display = isIncome ? "none" : "block";
    categoryInput.disabled = isIncome;
});

/* Add */
addBtn.addEventListener("click", () => {
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!amount || !date) return alert("Fill all fields");
    if (type === "expense" && !category) return alert("Select category");

    transactions.unshift({
        id: Date.now(),
        amount,
        type,
        category: type === "expense" ? category : null,
        date
    });

    amountInput.value = "";
    dateInput.value = "";
    categoryInput.value = "";

    saveAndRender();
});

/* Delete */
transactionList.addEventListener("click", e => {
    if (!e.target.classList.contains("delete")) return;
    const id = Number(e.target.dataset.id);
    transactions = transactions.filter(t => t.id !== id);
    saveAndRender();
});

/* Filters */
function applyFilters() {
    return transactions.filter(t => {
        const d = new Date(t.date);
        if (filterType.value !== "all" && t.type !== filterType.value) return false;
        if (filterMonth.value !== "all" && d.getMonth() != filterMonth.value) return false;
        if (filterYear.value !== "all" && d.getFullYear() != filterYear.value) return false;
        return true;
    });
}

/* Years */
function populateYears() {
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))];
    filterYear.innerHTML = `<option value="all">All Years</option>`;
    years.sort((a,b)=>b-a).forEach(y=>{
        filterYear.innerHTML += `<option value="${y}">${y}</option>`;
    });
}

/* Render list */
function renderTransactions() {
    const data = applyFilters();
    transactionList.innerHTML = "";

    if (!data.length) {
        emptyState.style.display = "block";
        showMoreBtn.style.display = "none";
        return;
    }
    emptyState.style.display = "none";

    data.slice(0, visibleCount).forEach(t => {
        const li = document.createElement("li");
        li.className = t.type === "income" ? "income-item" : "expense-item";
        li.innerHTML = `
            <span>${t.type === "expense" ? t.category : "Income"} | ${t.date} | ${formatCurrency(t.amount)}</span>
            <div class="actions">
                <button class="delete" data-id="${t.id}">Delete</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    showMoreBtn.style.display = visibleCount < data.length ? "block" : "none";
}

/* Summary */
function updateSummary() {
    let income = 0, expense = 0;
    transactions.forEach(t => t.type === "income" ? income += t.amount : expense += t.amount);
    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    balance.textContent = formatCurrency(income - expense);
}

/* Charts */
function renderExpenseChart(data) {
    const map = {};
    data.filter(t=>t.type==="expense").forEach(t=>map[t.category]=(map[t.category]||0)+t.amount);

    if (expenseChartObj) expenseChartObj.destroy();
    if (!Object.keys(map).length) {
        chartEmpty.style.display="block";
        return;
    }
    chartEmpty.style.display="none";

    expenseChartObj = new Chart(expenseCanvas,{
        type:"pie",
        data:{labels:Object.keys(map),datasets:[{data:Object.values(map)}]},
        options:{responsive:true,maintainAspectRatio:false}
    });
}

function renderIncomeExpenseChart(data) {
    let inc=0, exp=0;
    data.forEach(t=>t.type==="income"?inc+=t.amount:exp+=t.amount);

    if (incomeExpenseChartObj) incomeExpenseChartObj.destroy();
    if (!inc && !exp) return;

    incomeExpenseChartObj = new Chart(incomeExpenseCanvas,{
        type:"bar",
        data:{
            labels:["Amount"],
            datasets:[
                {label:"Income",data:[inc],backgroundColor:"#22c55e"},
                {label:"Expense",data:[exp],backgroundColor:"#ef4444"}
            ]
        },
        options:{responsive:true,maintainAspectRatio:false}
    });
}

/* Toggle */
let showingExpense = true;
toggleChartBtn.addEventListener("click",()=>{
    showingExpense=!showingExpense;
    expenseCanvas.style.display=showingExpense?"block":"none";
    incomeExpenseCanvas.style.display=showingExpense?"none":"block";
    chartTitle.textContent=showingExpense?"Expense Breakdown":"Income vs Expense";
    toggleChartBtn.textContent=showingExpense?"Show Income vs Expense":"Show Expense Breakdown";
});

/* Save */
function saveAndRender() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    visibleCount = 7;
    populateYears();
    const filtered = applyFilters();
    renderTransactions();
    updateSummary();
    renderExpenseChart(filtered);
    renderIncomeExpenseChart(filtered);
}

/* Events */
showMoreBtn.onclick = () => { visibleCount += STEP; renderTransactions(); };
filterType.onchange = saveAndRender;
filterMonth.onchange = saveAndRender;
filterYear.onchange = saveAndRender;

/* Reset */
document.querySelector(".box").onclick = () => {
    if (!confirm("Reset all data?")) return;
    localStorage.removeItem("transactions");
    transactions = [];
    saveAndRender();
};

/* INIT */
saveAndRender();