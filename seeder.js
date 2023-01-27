
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGODB_URI, MONGODB_PRODUCTION_URI } = process.env;


/**
 * constants
 */
const client = new MongoClient(
  process.env.NODE_ENV === "production" ? MONGODB_PRODUCTION_URI : MONGODB_URI
);

