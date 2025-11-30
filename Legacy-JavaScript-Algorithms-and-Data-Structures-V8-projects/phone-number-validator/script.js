const checkUserInput = () => {
  const userInput = document.getElementById("user-input").value; 
  
 
  const country = '^(1\\s?)?';  
  const area = '(\\([0-9]{3}\\)|[0-9]{3})';  
  const spaces = '[\\s\\-]?';  
  const number = '[0-9]{3}[\\s\\-]?[0-9]{4}$'; 
  const regex = new RegExp(`${country}${area}${spaces}${number}`);
  
 
  if (!userInput) {
    alert("Please provide a phone number");
    return;
  }

 
  if (regex.test(userInput)) {
    const results = document.getElementById("results-div");
    results.innerText = `Valid US number: ${userInput}`;
  } else {
    const results = document.getElementById("results-div");
    results.innerText = `Invalid US number: ${userInput}`;
  }
};


document.getElementById("check-btn").addEventListener("click", checkUserInput);


document.getElementById("user-input").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkUserInput();
  }
});


const clearInput = () => {
  document.getElementById("user-input").value = "";
  document.getElementById("results-div").innerText = "";
};


document.getElementById("clear-btn").addEventListener("click", clearInput);
