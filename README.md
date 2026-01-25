# Personal Finance Dashboard

## Project Overview
This is a **Personal Finance Dashboard** web application that helps users track their income and expenses. Users can add transactions, categorize them, filter by type/month/year, and visualize their financial data through interactive charts.

---

## How to Run the Project

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or installation required!

### Steps to Run

1. **Download or Clone the Project**
   ```bash
   # If you have git
   git clone https://github.com/Vyom-404/Finance_Dashboard
   cd Finance_Dashboard_Project
   # Or simply download the files
   ```

2. **Open the Application**
   - **Option 1**: Double-click on `index.html` file
   - **Option 2**: Right-click on `index.html` → Open with → Choose your browser
   - **Option 3**: Drag `index.html` into your browser window

3. **That's it!** 
   - The dashboard will load in your browser
   - All your data will be saved automatically in your browser's local storage
   - Your transactions will persist even after closing the browser

   ## 🌐 Live Demo
👉 https://vyom-404.github.io/Finance_Dashboard/

### File Structure
```
Finance_Dashboard_Project/
├── index.html          # Main HTML file
├── script.js           # JavaScript logic
├── style.css           # Styling and responsive design
└── README.md           # This file
```

### Testing the Application
- Add an income/expense transaction
- Use filters to narrow down transactions
- Toggle between different chart views
- Click "Show More" to load additional transactions
- Use the Reset button to clear all data

---

## Features Implemented

### 1. **Transaction Management**
- Add income and expense transactions with amount, category, and date
- Delete transactions with confirmation
- Store all transactions in browser's local storage for persistence

### 2. **Financial Summary**
- Display total income
- Display total expenses  
- Calculate and show current balance (income - expenses)
- All amounts formatted in Indian Rupees (₹) with proper comma separation

### 3. **Transaction Filtering**
- Filter by transaction type (Income/Expense/All)
- Filter by month (January to December)
- Filter by year (automatically populated from transactions)
- Filters work together to show combined results

### 4. **Transaction History**
- Display all transactions in a list format
- Show 7 transactions initially with "Show More" button to load 10 additional transactions
- Color-coded indicators (green for income, red for expense)
- Delete button for each transaction with confirmation dialog

### 5. **Data Visualization**
- **Expense Breakdown Chart**: Pie chart showing expenses by category (Food, Bills, Transport, Others)
- **Income vs Expense Chart**: Bar chart comparing total income and expense with legend indicators
- Toggle between both charts with a single button

### 6. **Responsive Design**
- Mobile-friendly layout with media queries
- Components stack vertically on screens smaller than 1024px
- Form inputs and buttons expand to full width on mobile devices

### 7. **Reset Functionality**
- Button to clear all transactions and start fresh with confirmation dialog

---

## JavaScript Functions & APIs Used

### **Web APIs Used**

#### 1. **localStorage API**
- `localStorage.getItem()` - Retrieve transactions from browser storage
- `localStorage.setItem()` - Save transactions to browser storage
- `localStorage.removeItem()` - Clear all transactions
- **Purpose**: Makes data persistent even after closing the browser

#### 2. **DOM APIs**
- `document.getElementById()` - Select elements by ID
- `document.querySelector()` / `document.querySelectorAll()` - Select elements using CSS selectors
- `createElement()` - Create new HTML elements
- `appendChild()` - Add elements to DOM
- `addEventListener()` - Attach event listeners to elements
- **Purpose**: Interact with HTML elements and respond to user actions

#### 3. **JSON APIs**
- `JSON.parse()` - Convert JSON string to JavaScript object
- `JSON.stringify()` - Convert JavaScript object to JSON string
- **Purpose**: Convert data between formats for storage

#### 4. **Date APIs**
- `Date.now()` - Get unique timestamp for transaction IDs
- `new Date()` - Create date objects from transaction dates
- `getMonth()` - Extract month from date for filtering
- `getFullYear()` - Extract year from date for filtering
- **Purpose**: Handle date operations and unique IDs

#### 5. **Chart.js Library**
- `new Chart()` - Create interactive charts
- `.destroy()` - Remove old charts before redrawing
- **Purpose**: Visualize data in pie and bar charts

---

## Key JavaScript Functions

### **Event Listeners**

```javascript
addBtn.addEventListener("click", () => {...})
```
- Listens for the "Add" button click
- Validates input (amount, date, category)
- Creates new transaction object with unique ID
- Clears form fields after adding
- Calls saveAndRender()

```javascript
transactionList.addEventListener("click", (e) => {...})
```
- Uses **event delegation** to handle delete button clicks
- Confirms deletion with user
- Removes transaction from array
- Updates display

```javascript
filterType/Month/Year.addEventListener("change", saveAndRender)
```
- Listens for filter changes
- Immediately updates displayed transactions

```javascript
toggleChartBtn.addEventListener("click", () => {...})
```
- Toggles between expense breakdown and income vs expense charts
- Updates chart visibility and button text

### **Core Functions**

```javascript
function applyFilters()
```
- Filters transactions based on selected type, month, and year
- Returns filtered array matching all criteria

```javascript
function renderTransactions()
```
- Displays filtered transactions in a list
- Implements pagination (shows 7 items initially)
- Shows "No transactions found" when empty
- Creates HTML elements with delete buttons

```javascript
function updateSummary()
```
- Calculates total income and total expenses
- Computes balance (income - expenses)
- Updates the summary cards on page

```javascript
function renderExpenseChart(filtered)
```
- Creates pie chart showing expense breakdown by category
- Groups expenses by category and sums amounts
- Automatically destroys old chart before creating new one
- Hides chart if no expense data exists

```javascript
function renderIncomeExpenseChart(filtered)
```
- Creates bar chart comparing income vs expense
- Shows separate colored bars for income (green) and expense (red)
- Displays legend with indicators on the right side
- Hides chart if no data exists

```javascript
function saveAndRender()
```
- **Main orchestrator function**
- Saves all transactions to localStorage
- Resets visible count to 7
- Calls all rendering functions to update the entire dashboard
- Called whenever data changes

### **Utility Functions**

```javascript
function formatCurrency(amount)
```
- Formats numbers with Indian Rupee symbol (₹)
- Adds thousand separators for readability
- Example: 5000 becomes "₹5,000"

---

## Technology Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Structure and form elements |
| **CSS3** | Styling and responsive layout |
| **Vanilla JavaScript** | Logic and interactivity |
| **localStorage** | Data persistence |
| **Chart.js** | Data visualization |
| **Google Fonts (Poppins)** | Typography |

---

## Data Structure

Each transaction is an object:
```javascript
{
    id: 1234567890,           // Unique timestamp ID
    amount: 5000,              // Transaction amount in rupees
    type: "income",            // "income" or "expense"
    category: null,            // Category for expenses (Food, Bills, etc.)
    date: "2026-01-25"         // Date in YYYY-MM-DD format
}
```

---

## How It Works

1. **User adds transaction** → Input validated → Object created → Stored in localStorage → Page updates
2. **User filters data** → applyFilters() returns matching transactions → Charts and lists regenerate
3. **Data is persistent** → localStorage keeps data even after browser closes
4. **Charts update dynamically** → Destroy old chart → Create new chart with filtered data
5. **User deletes transaction** → Event delegation catches click → Transaction removed → Page updates

---

## Responsive Breakpoints

- **Desktop (>1024px)**: Side-by-side layout with history on left, charts on right
- **Tablet/Mobile (<1024px)**: Stacked vertical layout, full-width inputs and buttons

---

## Future Enhancements
- Export data to CSV/PDF
- Monthly budget goals
- Multiple user accounts
- Dark/Light theme toggle
- Search transactions
- Recurring transactions

---

**Created by**: Vyom Gupta 

**Date**: January 2026  
**Purpose**: End-Term Assignment
