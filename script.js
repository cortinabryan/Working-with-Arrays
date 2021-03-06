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

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHtml = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
          <div class="movements__type movements__type--deposit">${i + 1}</div>
          <div class="movements__date">${type}</div>
          <div class="movements__value">${mov}???</div>
        </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}???`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}???`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${Math.abs(out)}???`;
};

// calcDisplaySummary(account1.movements);

// Computing Usernames
const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(currentAccount.movements);

  // Displacy Balance
  calcDisplayBalance(currentAccount);

  // Display Summary
  calcDisplaySummary(currentAccount);
};

// Event Handlersssssss

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting

  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Claer input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

// console.log(accounts);

// console.log(containerMovements.innerHTML);

// Implementing transfers

btnTransfer.addEventListener('click', function (e) {
  // Prevenmt form from submitting
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add movement

    currentAccount.movements.push(amount);

    // Updated UI
    updateUI(currentAccount);
  }
});

// the find Index method

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    console.log(index);
    // .indexOf(23);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

// Sort Button

let sorted = false;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
//
/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// Slice Method

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1)); // Always the last element of an array
// console.log(arr.slice(1, -2));
// console.log(arr.slice());
// console.log([...arr]);

// // Splice - Almost the same thing as Slice but it Mutates the array or it changes the original array

// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr);
// arr.splice(1, 2);
// console.log(arr);

// // REVERSE

// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT

// const letters = arr.concat(arr2);
// console.log(letters);
// console.log([...arr, ...arr2]);

// // JOIN

// console.log(letters.join(' - ')); // Result turns into string and the parameter is the separator

// The New At Method

// const arr = [23, 11, 64];

// console.log(arr[0]);
// console.log(arr.at(0));

// // getting last array element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);
// console.log(arr.at(-1));

// // it also works for strings

// const bryan = 'Bryan';

// console.log('Bryan'[0]);
// console.log(bryan[bryan.length - 1]);
// console.log('Bryan'.at(0));
// console.log('Bryan'.at(-1));

// -

// Looping Arrays:forEach

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // for (const movement of movements) {
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('----- FOREACH -----');
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}: You deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`);
//   }
// });

// 0: function(200)
// 1: function(450)
// 2: function(400)

// forEach with Maps and Sets

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function (value, _, map) {
//   console.log(`${value}: ${value}`);
// });

// Set

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });

// Project "Bankist" app

// Coding Challenge # 1

// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   // const dogsJuliaCorrected = dogsJulia.splice();

//   dogsJuliaCorrected.splice(0, 1);
//   dogsJuliaCorrected.splice(-2);
//   // dogsJulia.slice(1,3);

//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);

//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is an adult, and is still a puppy`);
//     }
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// The map Method

// const eurToUsd = 1.1;

// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });

// Old School

// const movementsUSDfor = [];

// for (const mov of movements) movementsUSDfor.push(mov * eurToUsd);
// console.log(movementsUSDfor);

// ES6
// const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);

// const movementsDescriptions = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );

// console.log(movementsDescriptions);

// The filter Method

// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// const depositsFor = [];

// for (const mov of movements) if (mov > 0) depositsFor.push(mov);

// console.log(depositsFor);

// const withdrawals = movements.filter(function (mov) {
//   return mov < 0;
// });

// console.log(withdrawals);

// The reduce Method

// console.log(movements);

// accumulator -> SNOWBALL

// const balance = movements.reduce((acc, cur, i, arr) => {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);

// const balance = movements.reduce((acc, cur) => acc + cur, 0);

// console.log(balance);

//

// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

// Maximum value

// const max = movements.reduce((acc, mov) => {
//   if (mov < acc) {
//     return acc;
//   } else {
//     return mov;
//   }
// }, movements[0]);

// console.log(max);

// Coding Challenge 2

const dogAges1 = [5, 2, 4, 1, 15, 8, 3];
const dogAges2 = [16, 6, 10, 5, 6, 1, 4];

// const calcAverageHumanAge = function (dogAges) {
//   // turn dog ages to human ages
//   // [5, 2, 4, 1, 15, 8, 3];
//   // const dogAges = []; // dog ages

// const humanAges = dogAges.map(dogAge => {
//   if (dogAge <= 2) {
//     return 2 * dogAge;
//   } else {
//     return 16 + dogAge * 4;
//   }
// });

// const adultDogs = humanAges.filter(humanAge => humanAge >= 18);

// const sum = adultDogs.reduce((sum, cur) => sum + cur);

// const averageAdultDogAges = sum / adultDogs.length;

// return averageAdultDogAges;

// Coding Challenge #3

// const humanAges2 = dogAges =>
//   dogAges
//     .map(dogAge => (dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4))
//     .filter(humanAge => humanAge >= 18)
//     .reduce((sum, cur, i, arr) => sum + cur / arr.length, 0);

// console.log(humanAges2(dogAges1));
// console.log(humanAges2(dogAges2));

// console.log(calcAverageHumanAge(dogAges1));
// console.log(calcAverageHumanAge(dogAges2));
// console.log(calcAverageHumanAge.averageAdultDog);

// The Magic of Chaining Methods

// PIPELINE

// const eurToUsd = 1.1;
// console.log(movements);

// const totalDepositsUSD = movements
//   .filter(mov => mov < 0)
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   // .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(totalDepositsUSD);

// Coding Challenge #3

// The find method

const firstWithdrawal = movements.find(mov => mov < 0);
const firstWithdrawal2 = movements.filter(mov => mov < 0);

console.log(movements);
console.log(firstWithdrawal);
console.log(firstWithdrawal2);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');

console.log(account);

// .map - we apply the condition to every element of the array
// .filter - we look for the elements that satisfies the condition

// Implementing Login

// implementing transferss

// Some and Every

// console.log('Some and Every');

// console.log(movements);

// // Equality
// console.log(movements.includes(-130));

// // .some() - Condition
// console.log(movements.some(mov => mov === -130));

// const anyDeposits = movements.some(mov => mov > 0);

// console.log(anyDeposits);

// // .every() - condition

// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Separate callback

// const deposit = mov => mov < 0;
// // console.log(movements.some(deposit));
// // console.log(movements.every(deposit));
// // console.log(movements.filter(deposit));

// .flat()

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];

// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);

// console.log(accountMovements);

// const allMovements = accountMovements.flat();

// console.log(allMovements);

// const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0); // Adds the elements together

// console.log(overallBalance);

// // Chaining methods

// const overallBalance2 = accounts
//   .map(acc => acc.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance2);

// // .flatMap()

// const overallBalance3 = accounts
//   .flatMap(acc => acc.movements)
//   .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance3);

// Sorting Arrays

// Strings
const owners = ['Bryan', 'Zach', 'Adam', 'Martha'];

console.log(owners);
console.log(owners.sort());
console.log(owners);

// Numbers

console.log(movements);
// console.log(movements.sort());

// return < 0, A, B (keep order)
// return > 0, B, A (switch order)

// Ascendingas
movements.sort((a, b) => a - b);

console.log(movements);

// Descending
movements.sort((a, b) => b - a);

console.log(movements);

// More ways of Creating and Filing Arrays

const arr = [1, 2, 3, 4, 5, 6, 7];
console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// Empty Arrays + fill method
const x = new Array(7); // Creates an array with 7 empty elements
console.log(x);

// .fill()

// x.fill(1); // Fill every element with 1

x.fill(1, 3, 5);

console.log(x);

arr.fill(23, 2, 6);

console.log(arr);

// const y = ['yooo', 'hi there', 44, 'mango'];

// y.fill(2, 2).push(44, 5, 6, 7);

// console.log(y);

// Array.from() - .from() was introduced to create arrays from array like structures

const y = Array.from({ length: 7 }, () => 1); // An Array Constructor
console.log(x);

const z = Array.from({ length: 7 }, (_, i) => i + 1); // Similar to .map() - The _ means a throwaway variable. it means we dont need the current value at all but we need to define something as the first parameter

console.log(z);

labelBalance.addEventListener('click', function () {
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => el.textContent.replace('???', '')
  );
  console.log(movementsUI);
  const movementsUI2 = [...document.querySelectorAll('movements__value')];
});

// Which Array method to use?

// ask yourself

// Do i want?

// To mutate original array? :

// Add to original:
// .push - (end)
// .unshift - (start)

// Remove from original:
// .pop - (end)
// .shift - (start)
// .splice - (any)

// Others
// .reverse
// .sort
// .fill

// A new Array? :

// Computed from original:
// .map - (loop)

// Filtered using condition:
// .filter

// Portion of original:
// .slice

// Adding original to other:
// .concat

// Flatenning the original:
// .flat
// .flatMap

// An array index? :

// Based on value:
// .indexOf

// Based on test condition:
// .findIndex

// Based on test condition:
// .findIndex

// An Array Element? :

// Based on test condition
// .find

// know if array incluides?:

// Based on value:
// .includes

// Based on test condition:
// .some
// .every

// A new string?
// .join

// to transform to value?
// Based on accumulator
// .reduce

// to just loop array?
// .forEach - (Does not create a bew array, it just loops over it)

// Array Methods Practice

console.log('Array Methods Practice');

const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur, 0); // Snowball the sum and accumulator

console.log(bankDepositSum);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? ++count : count), 0);

console.log(numDeposits1000);

// Prefixed ++ operator

let a = 10;
console.log(++a);
console.log(a);

// 3.

const { deposits, withdrawals } = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sums, cur) => {
      // cur > 0 ? (sums.deposits += cur) : (sums.withdrawals += cur);
      sums[cur > 0 ? 'deposits' : 'withdrawals'];
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(deposits, withdrawals);

// 4.

// This is a nice title -> This Is a Nice Title
const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);

  const exceptions = ['a', 'an', 'the', 'but', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word) ? word : word[0].toUpperCase() + word.slice(1)
    )
    .join(' ');
  return capitalize(titleCase);
};

console.log(convertTitleCase('this is a nice title'));
console.log(convertTitleCase('this is a LONG title but not too long'));
console.log(convertTitleCase('and here is another title with an EXAMPLE'));

// CODING CHALLENGE #4

// TEST DATA:

console.log('Coding Challenge #4');

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// 1.

// forEach - DOES NOT CREATE A NEW ARRAY

dogs.forEach(dog => (dog.recFood = Math.trunc(dog.weight ** 0.75 * 28)));

console.log(dogs);

// 2.

const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));

console.log(dogSarah);
console.log(
  `Sarah's Dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// 3.

const ownersEatTooMuch = dogs
  .filter(dog => dog.curFood > dog.recFood)
  .flatMap(dog => dog.owners);
// .flat()
console.log(ownersEatTooMuch);

const ownersEatTooLittle = dogs
  .filter(dog => dog.curFood < dog.recFood)
  .flatMap(dog => dog.owners);
console.log(ownersEatTooLittle);

// 4.

console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// 5.

console.log(dogs.some(dog => dog.curFood === dog.recFood));

// 6.

const checkEatingOkay = dog =>
  dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1;

console.log(dogs.some(checkEatingOkay));

// 7.

console.log(dogs.filter(checkEatingOkay));

// 8.

const dogsSorted = dogs.slice().sort((a, b) => a.recFood - b.recFood);

console.log(dogsSorted);
