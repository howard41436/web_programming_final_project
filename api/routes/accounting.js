import express from "express";
import Debug from "debug";
import mongoose from "mongoose";
import Record from "../models/record";

const debug = Debug("accounting");
const router = express.Router();

router.get("/hello", (_req, res) => {
  res.status(200).send("Hello");
});

router.post("/newRecord", async (req, res) => {
  const record = req.body;
  const pairId = parseInt(record.pairId, 10);
  debug("Received new record for pairId %d:\n%O", pairId, record);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Record.create(record);
    debug("Record succesfully created.");
    res.status(200).json(doc);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.post("/editRecord", async (req, res) => {
  const record = req.body;
  const pairId = parseInt(record.pairId, 10);
  let { _id } = req.query;
  _id = mongoose.Types.ObjectId(_id);
  debug("Edit record %O for pairId %d:\n%O", _id, pairId, record);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Record.findOneAndReplace({ _id, pairId }, record, {
      new: true,
    });
    if (doc === null) {
      debug("Error: Cannot find record with _id %O", _id);
      res.status(403).send();
    } else {
      debug("Record succesfully edited.");
      res.status(200).json(doc);
    }
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.post("/deleteRecord", async (req, res) => {
  let { pairId, _id } = req.query;
  pairId = parseInt(pairId, 10);
  _id = mongoose.Types.ObjectId(_id);
  debug("Delete record %O for pairId %d.", _id, pairId);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Record.deleteOne({ _id, pairId }).exec();
    if (doc.deletedCount === 1) {
      debug("Record succesfully deleted.");
      res.status(200).send();
    } else {
      debug("Error: Cannot find record with _id %O", _id);
      res.status(403).send();
    }
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.get("/allRecords", async (req, res) => {
  let { pairId } = req.query;
  pairId = parseInt(pairId, 10);
  debug(`All records for pairId ${pairId} requested:`);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const allRecords = await Record.find({ pairId }).sort({ date: 1 }).exec();
    debug(`There are ${allRecords.length} results.`);
    res.status(200).json(allRecords);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.get("/monthlyRecords", async (req, res) => {
  let { year, month, pairId } = req.query;
  pairId = parseInt(pairId, 10);
  year = parseInt(year, 10);
  month = parseInt(month, 10);
  debug(
    `Monthly records of ${year}/${month + 1} for pairId ${pairId} requested:`
  );
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  if (Number.isNaN(year) || !(month >= 0 && month < 12)) {
    debug("Error: Invalid date.");
    res.status(403).send();
    return;
  }
  try {
    const monthlyRecords = await Record.find({
      pairId,
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    })
      .sort({ date: 1 })
      .exec();
    debug(`There are ${monthlyRecords.length} results.`);
    res.status(200).json(monthlyRecords);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});
export default router;
