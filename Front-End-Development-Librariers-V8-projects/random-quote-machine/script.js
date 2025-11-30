const { useState, useEffect } = React;

const colors = [
  "#2C3E50", "#34495E", "#2C2C2C", "#616A6B", "#4A235A",
  "#2F4F4F", "#0E4B5A", "#36454F", "#2C3E50", "#800020"
];

// Helper to change background + text/button colors
const setColor = (color) => {
  document.body.style.backgroundColor = color;
  document.body.style.color = color;

  const textEl = document.getElementById("text");
  const authorEl = document.getElementById("author");
  const newQuoteBtn = document.getElementById("new-quote");
  const tweetLink = document.getElementById("tweet-quote");

  if (textEl) textEl.style.color = color;
  if (authorEl) authorEl.style.color = color;

  if (newQuoteBtn) {
    newQuoteBtn.style.backgroundColor = color;
    newQuoteBtn.style.color = "#FFFFFF";
  }

  if (tweetLink) {
    tweetLink.style.backgroundColor = color;
    tweetLink.style.color = "#FFFFFF";
  }
};

const QuoteApp = () => {
  const [quoteArr, setQuoteArr] = useState([]);
  const [quote, setQuote] = useState("");
  const [author, setAuthor] = useState("");

  // Fetch quotes and set the initial quote
  useEffect(() => {
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    setColor(colors[randomColorIndex]);

    fetch(
      "https://gist.githubusercontent.com/camperbot/5a022b72e96c4c9585c32bf6a75f62d9/raw/e3c6895ce42069f0ee7e991229064f167fe8ccdc/quotes.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setQuoteArr(data.quotes);
        generateNewQuote(data.quotes);
      })
      .catch((error) => console.error("Error loading quotes", error));
  }, []);

  // Generate a new quote and color
  const generateNewQuote = (quotes) => {
    if (!quotes || quotes.length === 0) return;

    const randomQuoteIndex = Math.floor(Math.random() * quotes.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const color = colors[randomColorIndex];

    setQuote(quotes[randomQuoteIndex].quote);
    setAuthor(quotes[randomQuoteIndex].author);

    setColor(color);
  };

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${quote}" - ${author}`
  )}`;

  return (
    <div id="quote-box">
      <h2 id="text">{quote}</h2>
      <p id="author">- {author}</p>

      <div className="buttons">
        <a
          id="tweet-quote"
          href={tweetUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-twitter" />
        </a>

        <button id="new-quote" onClick={() => generateNewQuote(quoteArr)}>
          New Quote
        </button>
      </div>
    </div>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<QuoteApp />);
