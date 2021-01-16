import express from "express";
import Debug from "debug";
import mongoose from "mongoose";
import Record from "../models/record";
import Settlement from "../models/settlement";

const debug = Debug("api:settleUp");
const router = express.Router();

router.post("/newSettlement", async (req, res) => {
  const settlement = req.body;
  const pairId = parseInt(settlement.pairId, 10);
  debug("Received new settlement for pairId %d:\n%O", pairId, settlement);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Settlement.create(settlement);
    debug("Settlement succesfully created.");
    res.status(200).json(doc);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.post("/deleteSettlement", async (req, res) => {
  let { pairId, _id } = req.query;
  pairId = parseInt(pairId, 10);
  _id = mongoose.Types.ObjectId(_id);
  debug("Delete settlement %O for pairId %d.", _id, pairId);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Settlement.deleteOne({ _id, pairId }).exec();
    if (doc.deletedCount === 1) {
      debug("Settlement succesfully deleted.");
      res.status(200).send();
    } else {
      debug("Error: Cannot find settlement with _id %O", _id);
      res.status(403).send();
    }
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

router.get("/debt", async (req, res) => {
  let { pairId } = req.query;
  pairId = parseInt(pairId, 10);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  let allRecords;
  let allSettlements;
  try {
    allRecords = await Record.find({ pairId }).sort({ date: 1 }).exec();
    debug(`There are ${allRecords.length} records.`);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
    return;
  }
  try {
    allSettlements = await Settlement.find({ pairId }).sort({ date: 1 }).exec();
    debug(`There are ${allSettlements.length} settlements.`);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
    return;
  }
  const allRecordsWrapped = allRecords
    .filter((record) => !!(record.owed.user0 - record.paid.user0))
    .map((record) => ({
      type: "record",
      content: record,
    }));
  const allSettlementsWrapped = allSettlements.map((settlement) => ({
    type: "settlement",
    content: settlement,
  }));
  const merged = allRecordsWrapped
    .concat(allSettlementsWrapped)
    .sort((a, b) => a.content.date - b.content.date);
  const debtOfUser0 = merged.reduce((accumulated, current) => {
    const debtDeltaOfUser0 =
      current.type === "record"
        ? current.content.owed.user0 - current.content.paid.user0
        : current.content.receivedMoneyOfUser0;
    return accumulated + debtDeltaOfUser0;
  }, 0);
  res.status(200).json({
    debtOfUser0,
    recordsAndSettlements: merged,
  });
});

export default router;
