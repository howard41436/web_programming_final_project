import express from "express";
import Debug from "debug";
import bcrypt from "bcrypt";
import { User, inviteCodeParams, pairIdParams } from "../models/user";
import Profile from "../models/profile";

const debug = Debug("api:account");
const router = express.Router();
const saltRounds = 12;
const { inviteCodeMin, inviteCodeRange } = inviteCodeParams;
const { pairIdMin, pairIdRange } = pairIdParams;

router.post("/register", async (req, res) => {
  const { name, icon, username, password } = req.body;
  if (typeof username !== "string" || typeof password !== "string") {
    res.status(403).send("Username and password must be strings.");
    return;
  }
  const userWithusername = await User.findOne({ username }).exec();
  if (userWithusername) {
    res.status(403).send("Username already exists.");
    return;
  }
  const passwordHash = await bcrypt.hash(password, saltRounds);
  let inviteCode;
  let userWithInviteCode;
  do {
    inviteCode = (
      Math.floor(Math.random() * inviteCodeRange) + inviteCodeMin
    ).toString();
    // eslint-disable-next-line no-await-in-loop
    userWithInviteCode = await User.findOne({ inviteCode }).exec();
  } while (userWithInviteCode);
  try {
    const newUser = await User.create({
      name,
      icon,
      username,
      passwordHash,
      matched: false,
      inviteCode,
    });
    debug("New user created:\n%O", newUser);
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
    return;
  }
  res.status(200).json({
    name,
    icon,
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
  const user = await User.findOne({ username }).exec();
  if (user === null) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  if (!(await bcrypt.compare(password, user.passwordHash))) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  if (user.matched) {
    res.status(200).json({
      name: user.name,
      icon: user.icon,
      username,
      matched: true,
      pairId: user.pairId,
    });
  } else {
    res.status(200).json({
      name: user.name,
      icon: user.icon,
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
  const user0 = await User.findOne({ username }).exec();
  if (user0 === null) {
    res.status(403).send("Username or password is incorrect.");
    return;
  }
  const user1 = await User.findOne({ inviteCode }).exec();
  if (user1 === null) {
    res.status(403).send("Invalid invite code.");
    return;
  }
  if (user0.matched || user1.matched) {
    res.status(403).send("Invalid invite code.");
    return;
  }
  let pairId;
  let userWithPairId;
  do {
    pairId = Math.floor(Math.random() * pairIdRange) + pairIdMin;
    // eslint-disable-next-line no-await-in-loop
    userWithPairId = await User.findOne({ pairId }).exec();
  } while (userWithPairId);
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
      await Profile.create({
        pairId,
        user0: {
          name: user0.name,
          icon: user0.icon,
          username: user0.username,
        },
        user1: {
          name: user1.name,
          icon: user1.icon,
          username: user1.username,
        },
      });
      res.status(200).json({
        name: user0.name,
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

router.get("/getProfile", async (req, res) => {
  let { pairId } = req.query;
  pairId = parseInt(pairId, 10);
  debug(`Profile for pairId ${pairId} requested:`);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  const profile = await Profile.findOne({ pairId }).exec();
  // debug("Profile:\n%O", profile);
  if (profile === null) {
    res.status(403).send("Profile doesn't exist");
  } else {
    res.status(200).json(profile);
  }
});

router.post("/editProfile", async (req, res) => {
  const profile = req.body;
  let { pairId } = req.query;
  pairId = parseInt(pairId, 10);
  if (Number.isNaN(pairId)) {
    debug("Error: Invalid pairId.");
    res.status(403).send();
    return;
  }
  try {
    const doc = await Profile.findOneAndUpdate({ pairId }, profile, {
      new: true,
    });
    if (doc === null) {
      debug("Error: Cannot find profile.");
      res.status(403).send("Profile doesn't exist");
    } else {
      debug("Profile succesfully edited.");
      res.status(200).json(doc);
    }
  } catch (err) {
    debug("Error:\n%O", err);
    res.status(403).send();
  }
});

export default router;
