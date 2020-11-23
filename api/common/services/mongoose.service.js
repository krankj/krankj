const mongoose = require("mongoose");
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = "debug";
let count = 0;

// let mongoDBUrl = "mongodb://127.0.0.1/test";
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD;
const MONGO_DB_USERNAME = process.env.MONGO_DB_USERNAME;
let mongoDBUrl = `mongodb+srv://${MONGO_DB_USERNAME}:${MONGO_DB_PASSWORD}@cluster0.fpezm.mongodb.net/test?retryWrites=true&w=majority`;
const options = {
  autoIndex: false, // Don't build indexes
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  // all other approaches are now deprecated by MongoDB:
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const connectWithRetry = () => {
  logger.debug("Setting up MongoDB connection with retry");
  mongoose
    .connect(mongoDBUrl, options)
    .then(() => {
      logger.info("MongoDB is connected");
    })
    .catch((err) => {
      logger.error(
        "MongoDB connection unsuccessful, retry after 5 seconds. Retry attempt: ",
        ++count
      );
      if (count <= 5) {
        setTimeout(connectWithRetry, 5000);
      }
    });
};

connectWithRetry();

exports.mongoose = mongoose;