require('dotenv').config({ path: '../quotebot/env/password.env' });
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const quotesRouter = require("./quotesAPI.js");
const sgMail = require('@sendgrid/mail');

const data = require("../quotebot/src/assets/data/email/emails.json");

const app = express();
app.use(cors());

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

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (quote, author, emailList) => {
  const msg = {
    to: emailList,
    from: `"QuoteBot." <${process.env.email}>`,
    subject: 'Your Daily Quote Is Here..',
    text: `"${quote}" - ${author}`,
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// **
// TIME LOGIC
// **

const handleTime = async () => {
  const checkTime = async () => {
    const currentTime = moment().format("HH:mm");
    const targetTime = "20:05"; 

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

  setInterval(checkTime, 60000); // Check every minute
  console.log("Time checker started");
};

handleTime();