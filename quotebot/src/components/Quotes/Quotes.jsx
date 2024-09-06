import React, { useEffect, useState } from "react";
import "./Quotes.scss";

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);

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
      <ul className="quoteContainerList">
        {quotes.map((quote, index) => (
          <li key={index}>
            <p>{quote.quote}</p>
            <p>- {quote.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Quotes;
