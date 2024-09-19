require('dotenv').config();
const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const moment = require('moment');
const data = require('../../assets/data/email/emails.json');
const quotesRouter = require("./quotesAPI.js");

const app = express();
app.use(cors());

app.use("/api", quotesRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// **
//  Email and Quote Handling
// **

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email, 
    pass: process.env.password, 
  },
});

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

const sendEmail = async (quote, author, emailList) => {
  emailList.forEach((recipient) => {
    const mailOptions = {
      from: '"QuoteBot" <quotebotapp@gmail.com>',
      to: recipient,
      subject: 'GM, Your Daily Quote Is Here...',
      text: `"${quote}" - ${author}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(`Error sending email to ${recipient}:`, error);
      } else {
        console.log(`Email sent successfully to ${recipient}: ${info.response}`);
      }
    });
  });
};

// **
//  Scheduling Logic
// **

const handleTime = async () => {
  const checkTime = async () => {
    const currentTime = moment().format('HH:mm');
    const targetTime = '11:00'; 

    if (currentTime === targetTime) {
      console.log("It's 11 AM! Time to send the daily quote.");
      
      const quotes = await fetchQuotes();
      
      if (quotes.length > 0) {
        const { quote, author } = selectRandomQuote(quotes);

        const emailList = data.emails.map(email => email.emailAddress);

        await sendEmail(quote, author, emailList);
      } else {
        console.log("No quotes available.");
      }
    }
  };

  const intervalId = setInterval(checkTime, 60000);
};

handleTime();
