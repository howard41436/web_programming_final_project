import Debug from "debug";
import Record from "../record";

const debug = Debug("seeder:record");

export default async function seedRecord() {
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
        category: "transportation",
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
}
