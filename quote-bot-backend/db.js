const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://henrybruceadams:a2G9xEI6mfPMpjA6@quotebotcluster.ppwskzt.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connectDB = async () => {
  try {
    await client.connect();
    return client.db("quoteBotDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

module.exports = { connectDB };
