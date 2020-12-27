import Debug from "debug";
import Settlement from "../settlement";

const debug = Debug("seeder:settlement");

export default async function seedSettlement() {
  try {
    const doc = await Settlement.create([
      {
        pairId: 0,
        receivedMoneyOfUser0: -100,
        date: new Date("2020-12-30"),
      },
    ]);
    debug("Created document:\n%O", doc);
  } catch (err) {
    debug("Error creating seed document:\n%O", err);
  }
}
