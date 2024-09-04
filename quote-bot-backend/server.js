// Import necessary modules
const express = require("express");
const cors = require("cors");
const quotesRouter = require("./quotesAPI");

// Create an Express app
const app = express();

// Enable CORS
app.use(cors());

// Mount the quotesRouter at the /api endpoint
app.use("/api", quotesRouter);

// Define your port and start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
