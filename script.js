'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
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
// functions
const formatMovDate = function (date, locale) {
  const calcDayPased = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDayPased(new Date(), date);
  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    // const day = `${date.getDate()}`.padStart(2, 0);
    // const month = `${date.getMonth() + 1}`.padStart(2, 0);
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;
    return new Intl.DateTimeFormat(locale).format(date);
  }
};
//formate currency
const formatcurrency = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};
// display movement function
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    //
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovDate(date, acc.locale);

    const formatcurr = formatcurrency(mov, acc.locale, acc.currency);
    const html = `
    
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__date">${displayDate}</div>
    <div class="movements__value"> ${formatcurr}</div>
  </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

//print acc of movements in balance value
const calcDisplayBalance = function (acc) {
  //set new property in opject
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  const formatcurr = formatcurrency(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formatcurr}`;
};

//calc all movements in summary
const calcDisplaySummry = function (acc) {
  //calc in comming
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  //formate currency
  labelSumIn.textContent = formatcurrency(incomes, acc.locale, acc.currency);
  // calc out comming

  const outcomes = acc.movements
    .filter(mov => mov <= 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = formatcurrency(outcomes, acc.locale, acc.currency);

  //calc interest

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  //formate currency
  labelSumInterest.textContent = formatcurrency(
    interest,
    acc.locale,
    acc.currency
  );
};
//create username property in evry object
//'Jonas Schmedtmann'=> js
const createUserName = function (accs) {
  accs.forEach(acc => {
    //set new prperty in object
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUserName(accounts);
const displayAllData = function (acc) {
  //display movments
  displayMovements(acc);
  //display balance
  calcDisplayBalance(acc);
  //display summery
  calcDisplaySummry(acc);
};

//event handeler

// login button
let currentAccount, timer;
//fake always logged in
// currentAccount = account1;
// displayAllData(currentAccount);
// containerApp.style.css.opacity = 100;

//date month year
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);
  //(?.)pin will read if account is right
  if (currentAccount?.pin === +inputLoginPin.value) {
    console.log('hi');
    //display ui and welcom msg
    labelWelcome.textContent = `Welcome Back ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //display date
    const now = new Date();
    const option = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      minte: 'numeric',
      hours: 'numeric',
      week: 'long',
    };
    // const locale = navigator.language;
    const formatdate = new Intl.DateTimeFormat(
      currentAccount.locale,
      option
    ).format(now);
    labelDate.textContent = formatdate;

    //clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    //to remove focus from pin input
    inputLoginPin.blur();
    //عشان التبمر ميستمرش لما نفتح اكونت تاني
    if (timer) clearInterval(timer);
    timer = countDownTimer();

    //updater ui
    displayAllData(currentAccount);
  }
});
//loan button
btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const loanAmount = Math.floor(inputLoanAmount.value);
  console.log(loanAmount);
  if (
    loanAmount > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmount * 0.1)
  ) {
    setTimeout(function () {
      // add loan amount to movemwnts
      currentAccount.movements.push(loanAmount);
      // add date
      currentAccount.movementsDates.push(new Date().toISOString());
      // display ui
      displayAllData(currentAccount);
      clearInterval(timer);
      timer = countDownTimer();
    }, 3000);
    inputLoanAmount.value = '';
  }
});
//transfer buttons and operation
btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const reciverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  console.log(amount, reciverAcc);
  //check if current account have enf money to transfer & if amount is +
  if (
    amount > 0 &&
    reciverAcc && //check if this acc is mogod or not
    currentAccount.balance >= amount &&
    reciverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    reciverAcc.movements.push(amount);
    //add date
    currentAccount.movementsDates.push(new Date().toISOString());
    reciverAcc.movementsDates.push(new Date().toISOString());
    //new Date return object
    //toISOStriog convert date to string
    clearInterval(timer);
    timer = countDownTimer();

    displayAllData(currentAccount);
  }

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();
});
//close current account
btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    //delet acc from accounts arr
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(index, 1);
    //hide ui deleted acc
    containerApp.style.opacity = 0;
    //clear input fields
    inputCloseUsername.value = '';
    inputClosePin.value = '';
    //to remove focus from pin input
    inputLoginPin.blur();
    // //clear input fields
    // inputLoginUsername.value = '';
    // inputLoginPin.value = '';
    // //to remove focus from pin input
    // inputLoginPin.blur();
  }
});

// sort button
let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

///countDoum timer

function countDownTimer() {
  const tick = function () {
    const min = String(Math.trunc(counter / 60)).padStart(2, 0);
    const sec = String(Math.trunc(counter % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (counter === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Log In To Get Started`;
      containerApp.style.opacity = 0;
    }
    counter--;
  };
  let counter = 120;
  const timer = setInterval(tick, 1000);

  return timer;
}

//
//js, ld. stw, sm
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

// const findMov = movements.find(mov => mov < 0);
// console.log(movements);
// console.log(findMov);

// const account = accounts.find(acc => acc.owner === 'Jonas Schmedtmann');
// console.log(account);
// for (acc of accounts) {
//   acc.owner === 'Jonas Schmedtmann';
//   console.log(acc);
// }

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);
// const withdrawals = movements.filter(mov => mov <= 0);
// console.log(withdrawals);
// const balancs = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balancs);
