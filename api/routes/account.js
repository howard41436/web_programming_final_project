import express from "express";
import Debug from "debug";
import bcrypt from "bcrypt";
import { User, inviteCodeParams, pairIdParams } from "../models/user";

const debug = Debug("api:account");
const router = express.Router();
const saltRounds = 12;
const { inviteCodeMin, inviteCodeRange } = inviteCodeParams;
const { pairIdMin, pairIdRange } = pairIdParams;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(403).send("Username and password must be strings.");
    return;
  }
  const usersWithSameUsername = await User.find({ username }).exec();
  if (usersWithSameUsername.length) {
    res.status(403).send("Username already exists.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);
  let inviteCode;
  let usersWithSameInviteCode;
  do {
    inviteCode = (
      Math.floor(Math.random() * inviteCodeRange) + inviteCodeMin
    ).toString();
    // eslint-disable-next-line no-await-in-loop
    usersWithSameInviteCode = await User.find({ inviteCode }).exec();
  } while (usersWithSameInviteCode.length);
  const newUser = await User.create({
    username,
    passwordHash,
    matched: false,
    inviteCode,
  });
  debug("New user created:\n%O", newUser);
  res.status(200).json({
    username,
    matched: false,
    inviteCode,
  });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(403).send("Username and password must be strings.");
    return;
  }
  const usersWithSameUsername = await User.find({ username }).exec();
  if (usersWithSameUsername.length !== 1) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  const user = usersWithSameUsername[0];
  if (!(await bcrypt.compare(password, user.passwordHash))) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  if (user.matched) {
    res.status(200).json({
      username,
      matched: true,
      pairId: user.pairId,
    });
  } else {
    res.status(200).json({
      username,
      matched: false,
      inviteCode: user.inviteCode,
    });
  }
});

router.post("/match", async (req, res) => {
  const { username, inviteCode } = req.body;
  if (typeof username !== "string" || typeof inviteCode !== "string") {
    res.status(403).send("Username and invite code must be strings.");
    return;
  }
  const usersWithSameUsername = await User.find({ username }).exec();
  if (usersWithSameUsername.length !== 1) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  const user0 = usersWithSameUsername[0];
  const usersWithTargetInviteCode = await User.find({ inviteCode }).exec();
  if (usersWithTargetInviteCode.length !== 1) {
    res.status(403).send("Invalid invite code.");
    return;
  }
  const user1 = usersWithTargetInviteCode[0];
  if (user0.matched || user1.matched) {
    res.status(403).send("Invalid invite code.");
    return;
  }
  let pairId;
  let usersWithSamePairId;
  do {
    pairId = Math.floor(Math.random() * pairIdRange) + pairIdMin;
    // eslint-disable-next-line no-await-in-loop
    usersWithSamePairId = await User.find({ pairId }).exec();
  } while (usersWithSamePairId.length);
  try {
    const doc0 = await User.findOneAndUpdate(
      { username: user0.username },
      {
        matched: true,
        pairId,
      },
      {
        new: true,
      }
    );
    const doc1 = await User.findOneAndUpdate(
      { username: user1.username },
      {
        matched: true,
        pairId,
      },
      {
        new: true,
      }
    );
    if (doc0 === null || doc1 === null) {
      debug("Error: Cannot find the users.");
      res.status(403).send();
    } else {
      debug("Users succesfully matched.");
      res.status(200).json({
        username: user0.username,
        matched: true,
        pairId,
      });
    }
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

export default router;
