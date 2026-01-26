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

/* Currency */
function formatCurrency(amount) {
    return "₹" + amount.toLocaleString("en-IN");
}

/* Toggle category */
typeInput.addEventListener("change", () => {
    categoryInput.style.display = typeInput.value === "income" ? "none" : "block";
    if (typeInput.value === "income") categoryInput.value = "";
});

/* Add Transaction */
addBtn.addEventListener("click", () => {
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;

    if (!amount || !date) return alert("Fill all required fields");
    if (type === "expense" && !category) return alert("Select category");

    transactions.unshift({
        id: Date.now(),
        amount,
        type,
        category: type === "expense" ? category : null,
        date
    });

    amountInput.value = "";
    categoryInput.value = "";
    dateInput.value = "";

    saveDataAndRender();
});

/* Delete (with confirmation — RESTORED) */
transactionList.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
        const id = Number(e.target.dataset.id);
        if (!confirm("Delete this transaction?")) return;
        transactions = transactions.filter(t => t.id !== id);
        saveDataAndRender();
    }
});

/* Filters */
function applyFilters() {
    return transactions.filter(t => {
        const d = new Date(t.date);
        if (filterType.value !== "all" && t.type !== filterType.value) return false;
        if (filterMonth.value !== "all" && d.getMonth().toString() !== filterMonth.value) return false;
        if (filterYear.value !== "all" && d.getFullYear().toString() !== filterYear.value) return false;
        return true;
    });
}

/* Populate years ONLY when transactions change */
function populateYears() {
    const years = [...new Set(
        transactions.map(t => new Date(t.date).getFullYear())
    )];

    filterYear.innerHTML = `<option value="all">All Years</option>`;

    years.sort((a, b) => b - a).forEach(year => {
        const opt = document.createElement("option");
        opt.value = year;
        opt.textContent = year;
        filterYear.appendChild(opt);
    });
}

/* Transactions */
function renderTransactions() {
    const filtered = applyFilters();
    transactionList.innerHTML = "";

    if (!filtered.length) {
        emptyState.style.display = "block";
        showMoreBtn.style.display = "none";
        return;
    }

    emptyState.style.display = "none";

    filtered.slice(0, visibleCount).forEach(t => {
        const li = document.createElement("li");
        li.classList.add(t.type === "income" ? "income-item" : "expense-item");

        li.innerHTML = `
            <span>
                ${t.type === "expense" ? t.category + " | " : "Income | "}
                ${t.date} | ${formatCurrency(t.amount)}
            </span>
            <div class="actions">
                <button class="delete" data-id="${t.id}">Delete</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    showMoreBtn.style.display = visibleCount < filtered.length ? "block" : "none";
}

/* Summary */
function updateSummary() {
    let income = 0, expense = 0;
    transactions.forEach(t => t.type === "income" ? income += t.amount : expense += t.amount);

    totalIncome.textContent = formatCurrency(income);
    totalExpense.textContent = formatCurrency(expense);
    balance.textContent = formatCurrency(income - expense);
}

/* Expense Pie Chart */
function renderExpenseChart(filtered) {
    const map = {};
    filtered.filter(t => t.type === "expense")
        .forEach(t => map[t.category] = (map[t.category] || 0) + t.amount);

    if (expenseChartObj) expenseChartObj.destroy();
    if (!Object.keys(map).length) {
        chartEmpty.style.display = "block";
        return;
    }
    chartEmpty.style.display = "none";

    expenseChartObj = new Chart(expenseCanvas, {
        type: "pie",
        data: {
            labels: Object.keys(map),
            datasets: [{ data: Object.values(map) }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/* Income vs Expense Bar Chart */
function renderIncomeExpenseChart(filtered) {
    let income = 0;
    let expense = 0;

    filtered.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    if (incomeExpenseChartObj) incomeExpenseChartObj.destroy();
    if (income === 0 && expense === 0) return;

    incomeExpenseChartObj = new Chart(incomeExpenseCanvas, {
        type: "bar",
        data: {
            labels: ["Amount"],
            datasets: [
                { label: "Income", data: [income], backgroundColor: "#22c55e" },
                { label: "Expense", data: [expense], backgroundColor: "#ef4444" }
            ]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

/* Toggle Charts */
let showingExpense = true;

toggleChartBtn.addEventListener("click", () => {
    showingExpense = !showingExpense;

    expenseCanvas.style.display = showingExpense ? "block" : "none";
    incomeExpenseCanvas.style.display = showingExpense ? "none" : "block";

    chartTitle.textContent = showingExpense
        ? "Expense Breakdown"
        : "Income vs Expense";

    toggleChartBtn.textContent = showingExpense
        ? "Show Income vs Expense"
        : "Show Expense Breakdown";
});

/* Render ONLY (filters) */
function renderUI() {
    visibleCount = 7;
    const filtered = applyFilters();

    renderTransactions();
    updateSummary();
    renderExpenseChart(filtered);
    renderIncomeExpenseChart(filtered);
}

/* Save + Render (data changes only) */
function saveDataAndRender() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
    populateYears();
    renderUI();
}

/* Events */
showMoreBtn.addEventListener("click", () => {
    visibleCount += STEP;
    renderTransactions();
});

filterType.addEventListener("change", renderUI);
filterMonth.addEventListener("change", renderUI);
filterYear.addEventListener("change", renderUI);

/* INIT */
categoryInput.style.display = "none";
populateYears();
renderUI();

/* Reset (unchanged) */
document.querySelector('.box').addEventListener('click', () => {
    if (!confirm("Are you sure you want to reset all data?")) return;
    localStorage.removeItem("transactions");
    transactions = [];
    saveDataAndRender();
});