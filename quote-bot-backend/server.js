require('dotenv').config({ path: '../quotebot/env/password.env' });
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const moment = require("moment");
const path = require("path");
const fs = require("fs");
const quotesRouter = require("./quotesAPI.js");

const data = require("../quotebot/src/assets/data/email/emails.json");


const app = express();
app.use(cors());


app.use("/api", quotesRouter);

const PORT = 5001;
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

const sgMail = require('@sendgrid/mail')
console.log('SendGrid API Key:', process.env.SENDGRID_API_KEY);
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
const msg = {
  to: 'georgeadams0204@gmail.com', // Change to your recipient
  from: 'henrybruce.adams@icloud.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
}
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent')
  })
  .catch((error) => {
    console.error(error)
  })



// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.email, 
//     pass: process.env.password, 
//   },
// });


// const sendEmail = async (quote, author, emailList) => {
//   emailList.forEach((recipient) => {
//     const mailOptions = {
//       from: `"QuoteBot" <${process.env.email}>`, 
//       to: recipient,
//       subject: "GM, Your Daily Quote Is Here...",
//       text: `"${quote}" - ${author}`,
//     };

//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error(`Error sending email to ${recipient}:`, error);
//       } else {
//         console.log(
//           `Email sent successfully to ${recipient}: ${info.response}`
//         );
//       }
//     });
//   });
// };



// **
// TIME LOGIC
// **



const handleTime = async () => {

  const checkTime = async () => {
    const currentTime = moment().format("HH:mm");
    const targetTime = "13:38"; 

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

  // const intervalId = setInterval(checkTime, 600000); // every minute
  // console.log(setInterval, "I'm looking...");
  
};

handleTime();