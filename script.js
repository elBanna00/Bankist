'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
//======================================================
// Data
//======================================================
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
//=====================================
// Elements
//====================================
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
let currentAccount;

// fake login

currentAccount = account1;
displayUI(currentAccount);
containerApp.style.opacity = 100;
/*========================================
FUNCTIONS
=========================================*/
function displayUI(acc) {
  displayMovment(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummary(currentAccount);
}
// ================================================================
// display the each movment in an account with a card on the page
// =================================================================
function displayMovment(acc, sorted = false) {
  containerMovements.innerHTML = '';
  const mov = sorted
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  mov.forEach((mov, i) => {
    let type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__date">3 days ago</div>
        <div class="movements__value">${Math.abs(mov)}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}
// ================================================================
// creats a username for each about based on the account owner name
// =================================================================
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
// ================================================================
// calculte the balance for a given account using the movemnts array
// =================================================================
function calcDisplayBalance(acc) {
  const calcBalace = acc.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${calcBalace} €`;
  return calcBalace;
}
// ================================================================
// calulcate the summary for a given account
// =================================================================
function calcDisplaySummary(acc) {
  const incoming = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  const outgoing = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => int >= 1)
    .reduce((acc, int) => acc + int, 0);
  labelSumIn.textContent = `${incoming} €`;
  labelSumOut.textContent = `${Math.abs(outgoing)} €`;
  labelSumInterest.textContent = `${interest}€`;
}

// ================================================================
// Login process
// =================================================================

createUsernames(accounts);
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    user => user.username === inputLoginUsername.value
  );
  // console.log(currentAccount);

  if (currentAccount?.pin == inputLoginPin.value) {
    inputLoginPin.value = inputLoginUsername.value = '';
    inputClosePin.blur();
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    displayUI();
  }
});

//=====================================================
//Managing transfers
//====================================================
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  let receivingAccount = accounts.find(
    user => user.username === inputTransferTo.value
  );
  let amount = Number(inputTransferAmount.value);
  if (
    receivingAccount &&
    amount > 0 &&
    amount < calcDisplayBalance(currentAccount) &&
    receivingAccount?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receivingAccount.movements.push(amount);
    displayUI();
  }
  console.log(receivingAccount);
});
//=====================================================
//Loan
//====================================================
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    displayUI();
  }
  inputLoanAmount.value = '';
});
//=====================================================
//Closing an account
//====================================================
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = 0;

    inputClosePin.value = inputCloseUsername.value = '';
  }
});
//=====================================================
//Sorting movments
//====================================================
let isSorted = false;
btnSort.addEventListener('click', e => {
  // console.log(currentAccount);
  e.preventDefault();
  displayMovment(currentAccount, !isSorted);
  isSorted = !isSorted;
  // console.log(isSorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
