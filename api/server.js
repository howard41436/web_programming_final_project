import express from "express";
import cors from "cors";
import Debug from "debug";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import accountRoutes from "./routes/account";
import accountingRoutes from "./routes/accounting";
import settleUpRoutes from "./routes/settleUp";

dotenv.config();

const debug = Debug("server");
const app = express();
const port = process.env.PORT || 4000;
const dboptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  auto_reconnect: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  poolSize: 10,
};

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
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

if (!process.env.MONGO_URL) {
  debug("Error: missing MONGO_URL.");
  process.exit(1);
}
mongoose.connect(process.env.MONGO_URL, dboptions).catch((err) => {
  debug("Error connecting MongoDB:\n%O", err);
});
mongoose.connection.on("error", (err) => {
  debug("Error emmited from MongoDB:\n%O", err);
});

app.use("/api/account", accountRoutes);
app.use("/api", accountingRoutes);
app.use("/api", settleUpRoutes);

app.listen(port, () => {
  debug(`Server is up on port ${port}.`);
});
