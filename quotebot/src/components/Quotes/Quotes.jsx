import React, { useEffect, useState } from "react";
import "./Quotes.scss";
import Button from "../Button/Button";
import data from '../../assets/data/email/emails.json';




// I WANT TO:
// 1. SEND MYSELF AN EMAIL AT 6AM EVERY DAY OF ONE OF THE QUOTES
// Import Date / Time
// Email address json
// while time != 6am, wait
// else call selectRandomQuote()

const Quotes = () => {
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);

  // **
  //
  //  Quote Handling
  //
  // **

  const selectRandomQuote = (data) => {
    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setSelectedQuote(data[randomIndex]);
    }
  };

  const handleClick = () => {
    selectRandomQuote(quotes);
  };

  // **
  // 
  // Date Time Handling
  // 
  // **

  const moment = require('moment');
  const currentTime = showTime;

  const showCurrentTime = () => {
    const showTime = moment().format('MMMM Do YYYY, h:mm:ss a');
    console.log(showTime);
  }


  const handleEmail = () => {
    const email = data.emails[0].emailAddress;

    if (currentTime != '6am') {
      
    }
  }

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
          showCurrentTime();
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
