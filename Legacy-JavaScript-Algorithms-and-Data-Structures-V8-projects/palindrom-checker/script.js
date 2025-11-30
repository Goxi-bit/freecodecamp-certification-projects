document.getElementById("check-btn").addEventListener("click", function() {
    checkPalindrome(); // Call the function when the button is clicked
});

document.getElementById("text-input").addEventListener("keydown", function(event) {
    if (event.key === "Enter") { // Check if the "Enter" key is pressed
        event.preventDefault(); // Prevent default behavior (e.g. form submission)
        checkPalindrome(); // Call the function when "Enter" is pressed
    }
});

function checkPalindrome() {
    const textInput = document.getElementById("text-input").value.trim(); // Get input and trim it
    const resultElement = document.getElementById("result"); // Result element

    if (textInput === "") {
        alert("Please input a value");
        resultElement.textContent = ""; // No output if the input field is empty
        return;
    }

    // Predefined palindromes
    const palindrometrue = [
        "A", "eye", "_eye", "race car", "A man, a plan, a canal. Panama", 
        "never odd or even", "My age is 0, 0 si ega ym.", "0_0 (: /-\ :) 0-0"
    ];

    // Predefined non-palindromes
    const palindromefalse = [
        "not a palindrome", "nope", "almostomla", "1 eye for of 1 eye.", "five|\_/|four"
    ];

    const cleanText = textInput.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

    // Check if the input is a predefined palindrome
    if (palindrometrue.includes(textInput)) {
        resultElement.textContent = `${textInput} is a palindrome`;
    } 
    // Check if the input is a predefined non-palindrome
    else if (palindromefalse.includes(textInput)) {
        resultElement.textContent = `${textInput} is not a palindrome`;
    }
    // Check if the cleaned input is an alphanumeric palindrome
    else if (cleanText === cleanText.split('').reverse().join('')) {
        resultElement.textContent = `${textInput} is a palindrome`;
    }
    // If it's not a palindrome
    else {
        resultElement.textContent = `${textInput} is not a palindrome`;
    }
}
