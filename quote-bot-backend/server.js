require("dotenv").config(); // Import the 'dotenv' library and load environment variables from .env
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const quotesRouter = require("./quotesAPI.js");

const data = require("../quotebot/src/assets/data/email/emails.json");

// Create an Express app
const app = express();
app.use(cors());

// Mount the quotesRouter at the /api endpoint
app.use("/api", quotesRouter);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


// **
// QUOTES / DATA
// ** 


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
      const quotes = await response.json();
      return quotes;
    } else {
      throw new Error("Unable to fetch quotes");
    }
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return [];
  }
};

const selectRandomQuote = (quotes) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};



// **
// EMAIL
// **


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email, // Use the email from .env
    pass: process.env.password, // Use the password from .env
  },
});


const sendEmail = async (quote, author, emailList) => {
  emailList.forEach((recipient) => {
    const mailOptions = {
      from: `"QuoteBot" <${process.env.email}>`, // Send from your QuoteBot email
      to: recipient,
      subject: "GM, Your Daily Quote Is Here...",
      text: `"${quote}" - ${author}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${recipient}:`, error);
      } else {
        console.log(
          `Email sent successfully to ${recipient}: ${info.response}`
        );
      }
    });
  });
};



// **
// TIME
// **


// Scheduling Logic
const handleTime = async () => {

  const checkTime = async () => {
    const currentTime = moment().format("HH:mm");
    const targetTime = "15:48"; // Set this to the time you want, e.g. 06:00 for 6 AM

    if (currentTime === targetTime) {

      const quotes = await fetchQuotes();

      if (quotes.length > 0) {
        const { quote, author } = selectRandomQuote(quotes);

        const emailList = data.emails.map((email) => email.emailAddress);

        await sendEmail(quote, author, emailList);
        console.log('sendEmail called');
        
      } else {
        console.log("No quotes available, no email sent");
      }
    }
  };

  const intervalId = setInterval(checkTime, 60000); // Check every minute
  console.log(setInterval, "I'm looking...");
  
};

handleTime();
