const express = require("express");
const router = express.Router();
const { connectDB } = require("./db");

router.get("/quotes", async (req, res) => {
  try {
    const db = await connectDB();
    console.log("Connected to DB, fetching quotes...");
    const quotes = await db.collection("quoteBotCollection").find().toArray();
    console.log("Fetched quotes:", quotes);

    const formattedQuotes = quotes.map((quote) => ({
      quote: quote.quote,
      author: quote.author,
    }));

    res.json(formattedQuotes);
  } catch (err) {
    console.error("Error fetching quotes:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
