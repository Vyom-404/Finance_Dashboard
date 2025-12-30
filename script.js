let transactions = [];
let visibleCount = 5;
let selectedCategory = null;

const saved = localStorage.getItem("transactions");
if (saved) transactions = JSON.parse(saved);

const incomeModal = document.getElementById("income-modal");
const expenseModal = document.getElementById("expense-modal");

document.getElementById("add-income-btn").onclick = () =>
  incomeModal.classList.remove("hidden");

document.getElementById("add-expense-btn").onclick = () =>
  expenseModal.classList.remove("hidden");

const closeBtns = document.querySelectorAll(".close-modal");
for (let i = 0; i < closeBtns.length; i++) {
  closeBtns[i].onclick = () => {
    incomeModal.classList.add("hidden");
    expenseModal.classList.add("hidden");
  };
}

/* CATEGORY BUTTONS */
const cats = document.querySelectorAll(
  "#food-btn, #transport-btn, #entertainment-btn, #others-btn"
);

for (let i = 0; i < cats.length; i++) {
  cats[i].onclick = () => {
    for (let j = 0; j < cats.length; j++) cats[j].classList.remove("active");
    cats[i].classList.add("active");
    selectedCategory = cats[i].innerText;
  };
}

/* ADD INCOME */
document.getElementById("submit-income").onclick = () => {
  const amount = Number(document.getElementById("income-amount").value);
  const date = document.getElementById("income-date").value;
  const desc = document.getElementById("income-description").value;

  if (!amount || !date || !desc) return alert("Fill all fields");

  transactions.push({ type: "income", amount, date, desc });
  localStorage.setItem("transactions", JSON.stringify(transactions));

  incomeModal.classList.add("hidden");
  visibleCount = 5;
  updateUI();
};

/* ADD EXPENSE */
document.getElementById("submit-expense").onclick = () => {
  const amount = Number(document.getElementById("expense-amount").value);
  const date = document.getElementById("expense-date").value;
  const desc = document.getElementById("expense-description").value;

  if (!amount || !date || !desc || !selectedCategory)
    return alert("Fill all fields");

  transactions.push({
    type: "expense",
    amount,
    date,
    desc,
    category: selectedCategory
  });

  localStorage.setItem("transactions", JSON.stringify(transactions));

  selectedCategory = null;
  expenseModal.classList.add("hidden");
  visibleCount = 5;
  updateUI();
};

document.getElementById("load-more").onclick = () => {
  visibleCount += 5;
  renderHistory();
};

function updateUI() {
  updateSummary();
  renderHistory();
}

function updateSummary() {
  let inc = 0, exp = 0;
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].type === "income") inc += transactions[i].amount;
    else exp += transactions[i].amount;
  }
  document.getElementById("total-income").innerText = inc;
  document.getElementById("total-expenses").innerText = exp;
  document.getElementById("total-savings").innerText = inc - exp;
}

function renderHistory() {
  const box = document.getElementById("transaction-history");
  box.innerHTML = "";

  let count = 0;
  for (let i = transactions.length - 1; i >= 0 && count < visibleCount; i--) {
    const t = transactions[i];
    const div = document.createElement("div");

    div.style.borderLeftColor =
      t.type === "income" ? "#22c55e" : "#ef4444";

    div.innerText =
      t.type === "income"
        ? `Income ₹${t.amount} | ${t.date} | ${t.desc}`
        : `Expense ₹${t.amount} | ${t.date} | ${t.desc} | ${t.category}`;

    box.appendChild(div);
    count++;
  }

  document.getElementById("load-more").style.display =
    visibleCount >= transactions.length ? "none" : "block";
}

updateUI();