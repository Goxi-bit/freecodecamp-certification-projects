const { useState } = React;

const App = () => {
  const [displayText, setDisplayText] = useState("0");
  const [displayHistory, setDisplayHistory] = useState("");
  const [warning, setWarning] = useState("");

  const dot = ".";
  const multidivArr = ["/", "*"];
  const subaddiArr = ["+", "-"];
  const operatorArr = [...multidivArr, ...subaddiArr];

  const regex1 = /^[+-]?\d+(\.\d+)?$/;

  const handleClearbtn = (e) => {
    if (e.currentTarget.textContent === "AC") {
      setDisplayText("0");
      setDisplayHistory("");
      setWarning("");
    }
  };

  const handleClick = (e) => {
    let symbol = e.currentTarget.textContent;

    // Replace "x" with "*" for multiplication
    const replace = { x: "*" };
    if (replace[symbol]) {
      symbol = replace[symbol];
    }

    const lastNumber = displayText.split(/[\+\-\*\/]/).pop();

    // ---- DISPLAY HISTORY ----
    setDisplayHistory((prev) => {
      if (displayText === "0" && regex1.test(symbol)) return symbol;

      const lastChar = prev[prev.length - 1];
      const secondLastChar = prev[prev.length - 2];

      // If last two characters and new symbol are operators (except "-"), replace both with current
      if (
        operatorArr.includes(secondLastChar) &&
        operatorArr.includes(lastChar) &&
        operatorArr.includes(symbol) &&
        symbol !== "-"
      ) {
        return prev.slice(0, -2) + symbol;
      }

      // Block starting with / or * when history is effectively 0
      if (displayText === "0" && multidivArr.includes(symbol)) {
        return prev;
      }

      // Avoid multiple dots in the same number
      if (symbol === "." && lastNumber.includes(".")) return prev;

      // If history ends with "." and an operator is pressed, replace "." with operator
      if (prev.endsWith(".") && operatorArr.includes(symbol)) {
        return prev.slice(0, -1) + symbol;
      }

      // Block double dots
      if (prev[prev.length - 1] === dot && symbol === dot) return prev;

      // Replace previous operator when another operator (not "-") is pressed
      if (
        operatorArr.includes(prev[prev.length - 1]) &&
        operatorArr.includes(symbol) &&
        symbol !== "-"
      ) {
        return prev.slice(0, -1) + symbol;
      }

      // Allow "-" as a sign after operator or at start
      if (symbol === "-" && (prev === "" || operatorArr.includes(prev[prev.length - 1]))) {
        return prev + symbol;
      }

      return prev + symbol;
    });

    // ---- DISPLAY TEXT ----
    setDisplayText((prev) => {
      // Limit length, show warning
      if (prev.length >= 25 && /\d/.test(symbol)) {
        setWarning("Too many digits");
        return prev;
      }

      if (prev === "0" && regex1.test(symbol)) return symbol;

      // If display is "0" and a digit is pressed -> replace
      if (prev === "0" && /\d/.test(symbol)) {
        return symbol;
      }

      // If display is "0" and / or * is pressed -> ignore
      if (prev === "0" && multidivArr.includes(symbol)) {
        return prev;
      }

      // Block double dots
      if (prev[prev.length - 1] === dot && symbol === dot) {
        return prev;
      }

      const lastChar = prev[prev.length - 1];
      const secondLastChar = prev[prev.length - 2];

      // Same triple-operator logic as history
      if (
        operatorArr.includes(secondLastChar) &&
        operatorArr.includes(lastChar) &&
        operatorArr.includes(symbol) &&
        symbol !== "-"
      ) {
        return prev.slice(0, -2) + symbol;
      }

      // Replace previous operator (except when "-" is allowed as sign)
      if (
        operatorArr.includes(prev[prev.length - 1]) &&
        operatorArr.includes(symbol) &&
        symbol !== "-"
      ) {
        return prev.slice(0, -1) + symbol;
      }

      // Allow "-" as sign
      if (
        symbol === "-" &&
        (prev === "" || operatorArr.includes(prev[prev.length - 1]))
      ) {
        return prev + symbol;
      }

      // Avoid multiple dots in last number
      if (symbol === "." && lastNumber.includes(".")) return prev;

      // Otherwise just append
      return prev + symbol;
    });

    // If equals pressed via some future mapping, handle evaluation
    if (symbol === "=") {
      handleEquals();
    }
  };

  const handleEquals = () => {
    try {
      const result = math.evaluate(displayText);
      const roundresult = parseFloat(result.toFixed(4)); // round to 4 decimals
      setDisplayText(roundresult.toString());
      setDisplayHistory(displayText + " = " + roundresult);
    } catch (err) {
      setDisplayText("Error");
    }
  };

  return (
    <>
      <div id="calculator-machine">
        <div id="display-container">
          <div id="display-history">{displayHistory}</div>
          <div id="display">{displayText}</div>
        </div>

        <div className="calculator-grid">
          <button id="clear" onClick={handleClearbtn}>
            AC
          </button>
          <button id="divide" onClick={handleClick}>
            /
          </button>
          <button id="multiply" onClick={handleClick}>
            x
          </button>

          <button id="seven" onClick={handleClick}>
            7
          </button>
          <button id="eight" onClick={handleClick}>
            8
          </button>
          <button id="nine" onClick={handleClick}>
            9
          </button>
          <button id="subtract" onClick={handleClick}>
            -
          </button>

          <button id="four" onClick={handleClick}>
            4
          </button>
          <button id="five" onClick={handleClick}>
            5
          </button>
          <button id="six" onClick={handleClick}>
            6
          </button>
          <button id="add" onClick={handleClick}>
            +
          </button>

          <button id="one" onClick={handleClick}>
            1
          </button>
          <button id="two" onClick={handleClick}>
            2
          </button>
          <button id="three" onClick={handleClick}>
            3
          </button>
          <button id="equals" onClick={handleEquals}>
            =
          </button>

          <button id="zero" onClick={handleClick}>
            0
          </button>
          <button id="decimal" onClick={handleClick}>
            .
          </button>
        </div>
      </div>
    </>
  );
};

// Render app
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);

