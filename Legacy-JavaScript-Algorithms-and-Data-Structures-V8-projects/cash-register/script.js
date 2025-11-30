let price = 1.87;
let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const currencyValues = new Map([
  ['PENNY', 0.01],
  ['NICKEL', 0.05],
  ['DIME', 0.10],
  ['QUARTER', 0.25],
  ['ONE', 1],
  ['FIVE', 5],
  ['TEN', 10],
  ['TWENTY', 20],
  ['ONE HUNDRED', 100]
]);

// updateDisplay function to update the UI with remaining amounts
const updateDisplay = () => {
  document.getElementById("penny").textContent = `Pennies: $${cid[0][1]}`;
  document.getElementById("nickel").textContent = `Nickels: $${cid[1][1]}`;
  document.getElementById("dimes").textContent = `Dimes: $${cid[2][1]}`;
  document.getElementById("quarters").textContent = `Quarters: $${cid[3][1]}`;
  document.getElementById("ones").textContent = `Ones: $${cid[4][1]}`;
  document.getElementById("fives").textContent = `Fives: $${cid[5][1]}`;
  document.getElementById("tens").textContent = `Tens: $${cid[6][1]}`;
  document.getElementById("twenties").textContent = `Twenties: $${cid[7][1]}`;
  document.getElementById("hundreds").textContent = `Hundreds: $${cid[8][1]}`;
}

const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const changeDue = document.getElementById("change-due");
const totalScore = document.getElementById("totalscore");

// total price dynamik
totalScore.querySelector("p").innerText = `Total: $${price}`;

// total cash in the drawer sum amount and rounded
const sumCid = Math.floor(cid.reduce((sum, item) => sum + item[1], 0) * 100) / 100;

purchaseBtn.addEventListener("click", () => {
  let cashValue = parseFloat(cash.value);

  // want to pay more than in cid
  if (cashValue > sumCid) {
    changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
    return;
  }
  // customer paid exact
  if (cashValue === price) {
    changeDue.textContent = "No change due - customer paid with exact cash";
    return;
  }
  // customer not enough money
  if (cashValue < price) {
    alert("Customer does not have enough money to purchase the item");
    return;
  } else {
let changeToReturn = cashValue - price;
let change = [];

for (let i = cid.length - 1; i >= 0; i--) {
  // arra cid name actuall from iteration i penny etc 
  let currencyName = cid[i][0];
  // arr from newmap keyword geting value so this is value
  let currencyValue = currencyValues.get(currencyName);
  //this is value from my cid array
  let currencyAmount = cid[i][1];
  let currencyCount = 0;
  while (changeToReturn >= currencyValue && currencyAmount > 0) {
    changeToReturn = Math.round((changeToReturn - currencyValue) * 100) / 100;
    currencyAmount = Math.round((currencyAmount - currencyValue) * 100) / 100;
    currencyCount += currencyValue;
  }
  
  if (currencyCount > 0) {
    change.push([currencyName, currencyCount.toFixed(2)]);
    cid[i][1] = currencyAmount; // Aktualisiere die Kasse
  }
}


    if (changeToReturn > 0) {
      changeDue.textContent = "Status: INSUFFICIENT_FUNDS";
      return;
    }
let refresh = Math.floor(cid.reduce((sum, item) => sum + item[1], 0) * 100) / 100;
if (price < cashValue && changeToReturn === 0 && refresh === 0) {
  changeDue.innerHTML = "Status: CLOSED<br>" + change.map(item => `${item[0]}: $${item[1]}`).join("<br>");
  return;
}


    
    changeDue.innerHTML = "Status: Open<br>" + change.map(item => `${item[0]}: $${item[1]}`).join("<br>");

    // Update the display after the transaction
    updateDisplay();

  }
});
