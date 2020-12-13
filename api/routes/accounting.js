import express from "express";
import Debug from "debug";
import Record from "../models/record";

const debug = Debug("accounting");
const router = express.Router();

router.get("/hello", (_req, res) => {
  res.status(200).send("Hello");
});

router.post("/newRecord", async (req, res) => {
  const record = req.body;
  debug("Received new record:\n%O", record);
  res.status(200).send();
});

router.get("/allRecords", async (_req, res) => {
  try {
    const allRecords = await Record.find({ pairId: 0 })
      .sort({ date: 1 })
      .exec();
    res.status(200).json(allRecords);
  } catch (err) {
    res.status(403).send();
  }
});

router.get("/monthlyRecords", async (req, res) => {
  let { year, month } = req.query;
  try {
    year = parseInt(year, 10);
    month = parseInt(month, 10);
    const monthlyRecords = await Record.find({
      pairId: 0,
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    })
      .sort({ date: 1 })
      .exec();
    res.status(200).json(monthlyRecords);
  } catch (err) {
    debug(err);
    res.status(403).send();
  }
});
export default router;
