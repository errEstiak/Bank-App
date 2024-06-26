'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Sasuke Uchiha',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300, 100000],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Naruto Uzumaki',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Kakashi Hatake',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Hinata Hyuga',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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
const labelTransferWrongMsg = document.querySelector('.wrongMsg')

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
// -------------------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ============= DISPLAY MOVEMENTS =================
const displayMovements = function (movements) {
  containerMovements.innerHTML = '';
  movements.forEach((movs, i) => {
    const type = movs > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      i + 1
    }. ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${Math.abs(movs)} €</div>
    </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);
// -------------------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ============= CREATING USERNAME =================

// First we create this basic function to make a username
// const createUserName = function (acc) {
//   const userName = acc
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0])
//     .join(''); // do the chaining one by one to grasp the situation
//     return userName;
// };
// console.log(createUserName('Estiak Dewan Emon'));

// now we can dinamically use this function to passs into the accounts array & creating a username property inside each account object

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner //creating username variable & implementing on owner property
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // this map method creating a new array without mutating the original
      .join('');
  });
};

createUserName(accounts);
// console.log(accounts);
// -------------------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ============= DISPLAY Summary =================

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes} €`;

  const withdraw = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(withdraw)} €`;

  // Lets fix an 1.2% interest for our program on every deposit
  // suppose bank add an condition recently on interest rate
  // only if an interest that is bigger than one than it will be added to the total value
  // so where should we add this in the chai? (yes the ans is in between where we calculating and adding the interest rate)
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((interest, i, arr) => {
      // console.log(arr); // check out the array for debugging / understanding this part
      return interest >= 1;
    })
    .reduce((acc, interest) => acc + interest, 0);

  labelSumInterest.textContent = `${interest} €`;
};

// calcDisplaySummary(account1.movements);
// -------------------------------------------

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// ============= DISPLAY TOTAL BALANCE =================

const displayTotalBalance = function (acc) {
  const balance = acc.movements.reduce(function (acc, mov) {
    return acc + mov;
  }, 0);
  // crating balance property for accounts object to hold value
  acc.balance = balance;
  labelBalance.textContent = `${balance} €`;
};

// displayTotalBalance(account1.movements);
// -------------------------------------------

/////////////////////////////////////////////////
// ============= Update Ui funtion =================
const updateUi = function (acc) {
  // Display Movements
  displayMovements(acc.movements);
  // Display Balance
  displayTotalBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
};

// -------------------------------------------

/////////////////////////////////////////////////
// ============= User log in =================

let currentAccout;
btnLogin.addEventListener('click', function (e) {
  // to prevent the form from submitting
  e.preventDefault();
  currentAccout = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  // console.log(currentAccout);

  // if the username doesn't match value it will return an error that why we can use optional chaining in the condition
  // if current account is true, mean if the current username exit than it will check for pin
  if (currentAccout?.pin === Number(inputLoginPin.value)) {
    // Display Ui and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccout.owner.split(' ')[0]
    }`;
    // at first the app class opacity will be 0
    // but after a successful log in it will show the user interface
    containerApp.style.opacity = 100;
    // containerApp.style.pointerEvents = auto;
    // containerApp.style.visibility = visible;

    // clearing input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // // Display Movements
    // displayMovements(currentAccout.movements);
    // // Display Balance
    // displayTotalBalance(currentAccout);
    // // Display Summary
    // calcDisplaySummary(currentAccout);

    // Resusable function to update Ui
    updateUi(currentAccout);
  }
});

// -------------------------------------------

/////////////////////////////////////////////////
// ============= TRANSFER MONEY =================

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts.find(
    acc => acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = '';
  inputTransferTo.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAccount &&
    currentAccout.balance >= amount &&
    receiverAccount &&
    receiverAccount.username !== currentAccout.username
  ) {
    currentAccout.movements.push(-amount);
    receiverAccount.movements.push(amount);
    updateUi(currentAccout);
    labelTransferWrongMsg.textContent = '';
  } else {
    labelTransferWrongMsg.textContent = 'Wrong! Try again'
    labelTransferWrongMsg.style.color = "#A34343";
  }
});

// -------------------------------------------
