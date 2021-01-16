import mongoose from "mongoose";
import Debug from "debug";
import dotenv from "dotenv";
import seedRecord from "./recordSeeder";
import seedSettlement from "./settlementSeeder";
import seedUser from "./userSeeder";
import seedProfile from "./profileSeeder";

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

  const collectionNames = ["record", "settlement", "user", "profile"];
  collectionNames.forEach(async (collectionName) => {
    try {
      await mongoose.connection.db.dropCollection(collectionName);
      debug(`Collection ${collectionName} reset.`);
    } catch (err) {
      debug(`Collection ${collectionName} reset failed:\n%O`, err);
    }
  });

  await seedRecord();
  await seedSettlement();
  await seedUser();
  await seedProfile();

  await mongoose.disconnect();
}

main();
