const balanceEl = document.getElementById("balance");
const moneyPlusEl = document.getElementById("money-plus");
const moneyMinusEl = document.getElementById("money-minus");
const form = document.getElementById("form");
const textInput = document.getElementById("text");
const amountInput = document.getElementById("amount");
const transactionList = document.getElementById("list");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
); // null

// let transactions = localStorageTransactions || [];
let transactions =
  localStorageTransactions !== null ? localStorageTransactions : [];

function startTheApp() {
  transactionList.innerHTML = "";

  updateDOMValues();
  transactions.forEach((transaction) => addTransactionToHistory(transaction));
  // transactions.forEach(addTransactionToHistory);
}

startTheApp();

form.addEventListener("submit", addTransaction);

function addTransaction(e) {
  e.preventDefault();

  if (textInput.value.trim() === "" || amountInput.value.trim() === "") {
    alert("Please add a text and amount!");
  } else {
    // [
    //     {
    //        id: 1,
    //        text: "Groceries",
    //        amount: 250
    //     }
    // ]

    const transaction = {
      id: Math.floor(Math.random() * 100000000),
      text: textInput.value, // string
      amount: +amountInput.value,
    };

    transactions.push(transaction);

    addTransactionToHistory(transaction);

    updateDOMValues();

    updateLocalStorage();

    textInput.value = "";
    amountInput.value = "";
  }
}

function addTransactionToHistory(transaction) {
  //     {
  //        id: 1,
  //        text: "Groceries",
  //        amount: -250
  //     }
  const { text, id, amount } = transaction;

  const customClass = amount < 0 ? "minus" : "plus";
  const sign = amount < 0 ? "-" : "+";

  const historyItem = `
        <li class="${customClass}">
          ${text} <span>${sign}$${Math.abs(
    amount
  )}</span><button class="delete-btn" onclick="removeTransaction(${id})">x</button>
        </li>
    `;

  transactionList.innerHTML += historyItem;
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);

  updateLocalStorage();

  startTheApp();
}

function updateLocalStorage() {
  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function updateDOMValues() {
  const amounts = transactions.map((transaction) => transaction.amount); // [20, -34, 500]

  const balanceTotal = amounts
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    .toFixed(2);

  const income = amounts.filter((amount) => amount > 0); // [100, 40]

  const totalIncome = income
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
    .toFixed(2);

  const expense = amounts.filter((amount) => amount < 0); // [-300, -100]

  const totalExpense = (
    expense.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      0
    ) * -1
  ).toFixed(2);

  //   balanceEl.innerText = "$" + balanceTotal
  balanceEl.innerText = `$${balanceTotal}`;
  moneyPlusEl.innerText = `$${totalIncome}`;
  moneyMinusEl.innerText = `$${totalExpense}`;

  console.log("balanceTotal", balanceTotal);
}
