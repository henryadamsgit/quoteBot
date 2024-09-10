import React, { useEffect, useState } from "react";
import "./Quotes.scss";
import Button from "../Button/Button";


// I WANT TO:
// 1. SEND MYSELF AN EMAIL AT 6AM EVERY DAY OF ONE OF THE QUOTES

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const selectRandomQuote = (data) => {
    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setSelectedQuote(data[randomIndex]);
    }
  };

  const handleClick = () => {
    selectRandomQuote(quotes);
  };

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/quotes`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(data);
          selectRandomQuote(data);
        } else {
          throw new Error("Unable to fetch quotes");
        }
      } catch (error) {
        console.log("Unable to fetch quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  return (
    <div className="quoteContainer">
      {selectedQuote ? (
        <div className="quoteContainerBox">
          <p className="quoteText">{selectedQuote.quote}</p>
          <p className="quoteAuthor">- {selectedQuote.author}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Button onClick={handleClick}></Button>
    </div>
  );
};

export default Quotes;
