const numberInput = document.getElementById("number");
const convertbtn = document.getElementById("convert-btn");
const numberOutput = document.getElementById("output");

// Function to check the user input
const checkUserInput = () => {
  const inputInt = parseInt(numberInput.value); // The value is now fetched dynamically on each function call

  // Check if the input is empty or invalid
  if (!numberInput.value) {
    numberOutput.innerText = "Please enter a valid number";
    return;
  }
  
  // Check if the number is smaller than 1 or greater than 3999
  if (inputInt <= 0) {
    numberOutput.innerText = "Please enter a number greater than or equal to 1";
    return;
  }

  if (inputInt >= 4000) {
    numberOutput.innerText = "Please enter a number less than or equal to 3999";
    return;
  }

  // Convert the number to a Roman numeral and display the result
  const romanNumeral = convertToRoman(inputInt);
  numberOutput.innerText = romanNumeral; // Output the Roman numeral
};

// Event listener for the button
convertbtn.addEventListener("click", checkUserInput);

// Event listener for pressing the Enter key
numberInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});

// Function to convert Arabic numbers to Roman numerals
const convertToRoman = (inputInt) => {
  // Define the Arabic and Roman values
  const romanNumerals = [
    { arabic: 1000, roman: "M" },
    { arabic: 900, roman: "CM" },
    { arabic: 500, roman: "D" },
    { arabic: 400, roman: "CD" },
    { arabic: 100, roman: "C" },
    { arabic: 90, roman: "XC" },
    { arabic: 50, roman: "L" },
    { arabic: 40, roman: "XL" },
    { arabic: 10, roman: "X" },
    { arabic: 9, roman: "IX" },
    { arabic: 5, roman: "V" },
    { arabic: 4, roman: "IV" },
    { arabic: 1, roman: "I" }
  ];

  let romanString = ""; // Result string

  // Loop through the values and perform the conversion
  for (let i = 0; i < romanNumerals.length; i++) {
    while (inputInt >= romanNumerals[i].arabic) {
      romanString += romanNumerals[i].roman; // Add the Roman symbol
      inputInt -= romanNumerals[i].arabic;   // Subtract the corresponding Arabic value
    }
  }

  return romanString; // Return the Roman numeral
};
