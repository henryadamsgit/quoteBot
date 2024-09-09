import React, { useEffect, useState } from "react";
import "./Quotes.scss";
import Button from "../Button/Button";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);

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

          const randomIndex = Math.floor(Math.random() * data.length);
          setSelectedQuote(data[randomIndex]);

        } else {
          throw new Error("Unable to fetch quotes");
        }
      } catch (error) {
        console.log("Unable to fetch quotes:", error);
      }
    };

    fetchQuotes();
  }, []);

  // I WANT TO:
  // 1. Only show one quote in the box. Add selected quote state. Add conditional
  // 2. Have a new quote be generated onClick()
  // 3. Have a new quote appear at the start of each day


  return (
    <div className="quoteContainer">
      <ul>
          {selectedQuote ? (
          <div className="quoteContainerBox">
            <p className="quoteText">{selectedQuote.quote}</p>
            <p className="quoteAuthor">-{selectedQuote.author}</p>
          </div>
        ) : 
        <p>Loading...</p>}
      </ul>
      {/* <Button onClick={}></Button> */}
    </div>
  );
};

export default Quotes;
