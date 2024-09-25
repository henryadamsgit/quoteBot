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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Configure Nodemailer with environment variables
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL, // Use the email from .env
    pass: process.env.PASSWORD, // Use the password from .env
  },
});

// Function to fetch the quotes from your backend API
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

// Function to select a random quote
const selectRandomQuote = (quotes) => {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
};

// Function to send an email with the selected quote
const sendEmail = async (quote, author, emailList) => {
  emailList.forEach((recipient) => {
    const mailOptions = {
      from: `"QuoteBot" <${process.env.EMAIL}>`, // Send from your QuoteBot email
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

// Scheduling Logic
const handleTime = async () => {
  console.log("handleTime called");

  const checkTime = async () => {
    const currentTime = moment().format("HH:mm");
    console.log(`Checking time: ${currentTime}`);
    const targetTime = "21:13"; // Set this to the time you want, e.g. 06:00 for 6 AM

    if (currentTime === targetTime) {
      console.log("It's 6 AM! Time to send the daily quote.");

      const quotes = await fetchQuotes();

      if (quotes.length > 0) {
        const { quote, author } = selectRandomQuote(quotes);

        const emailList = data.emails.map((email) => email.emailAddress);

        await sendEmail(quote, author, emailList);
      } else {
        console.log("No quotes available, no email sent");
      }
    }
  };

  const intervalId = setInterval(checkTime, 6000); // Check every minute
};

handleTime();
