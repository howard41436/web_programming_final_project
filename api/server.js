import express from "express";
import cors from "cors";
import Debug from "debug";
import accountingRoutes from "./routes/accounting";
// import mongoose from 'mongoose';

// require('dotenv').config();
const debug = Debug("MyApp");

const app = express();

app.use(cors());
app.use(express.json());
app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

const port = process.env.PORT || 4000;
// const dboptions = {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   auto_reconnect: true,
//   useUnifiedTopology: true,
//   poolSize: 10,
// };

// mongoose.connect(process.env.MONGO_URL, dboptions);

app.use("/", accountingRoutes);

app.listen(port, () => {
  debug(`Server is up on port ${port}.`);
  // console.log(`Server is up on port ${port}.`);
});
