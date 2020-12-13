import mongoose from "mongoose";
import Debug from "debug";
import dotenv from "dotenv";
import Record from "../record";

dotenv.config();

const debug = Debug("seeder");
const dboptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  auto_reconnect: true,
  useUnifiedTopology: true,
  poolSize: 10,
};

async function main() {
  if (!process.env.MONGO_URL) {
    debug("Error: missing MONGO_URL.");
    process.exit(1);
  }
  try {
    await mongoose.connect(process.env.MONGO_URL, dboptions);
  } catch (err) {
    debug("Error connecting MongoDB:\n%O", err);
  }
  mongoose.connection.on("error", (err) => {
    debug("Error emmited from MongoDB:\n%O", err);
  });

  try {
    await mongoose.connection.db.dropCollection("record");
    debug('Collection "record" reset.');
  } catch (err) {
    debug('Collection "record" reset failed:\n%O', err);
  }

  try {
    const doc = await Record.create([
      {
        pairId: 0,
        category: "food",
        owner: -1,
        price: 100,
        name: "pasta",
        date: new Date("2020-12-07"),
        paid: {
          user0: 30,
          user1: 70,
        },
        owed: {
          user0: 50,
          user1: 50,
        },
      },
      {
        pairId: 0,
        category: "transport",
        owner: 0,
        price: 140,
        name: "taxi back home",
        date: new Date("2020-12-05"),
        paid: {
          user0: 0,
          user1: 140,
        },
        owed: {
          user0: 140,
          user1: 0,
        },
      },
      {
        pairId: 0,
        category: "food",
        owner: 1,
        price: 350,
        name: "scones",
        date: new Date("2020-11-20"),
        paid: {
          user0: 0,
          user1: 350,
        },
        owed: {
          user0: 0,
          user1: 350,
        },
      },
    ]);
    debug("Created document:\n%O", doc);
  } catch (err) {
    debug("Error creating seed document:\n%O", err);
  }

  await mongoose.disconnect();
}

main();
