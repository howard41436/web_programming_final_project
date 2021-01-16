import Debug from "debug";
import Profile from "../profile";

const debug = Debug("seeder:profile");

export default async function seedProfile() {
  try {
    const doc = await Profile.create([
      {
        pairId: 0,
        user0: {
          name: "Peipei",
          icon: 0,
          username: "wujun_pei",
        },
        user1: {
          name: "Fiona",
          icon: 2,
          username: "fionahsu_1004",
        },
        budget: {
          user0: {
            total: 20000,
            food: 10000,
            transportation: 3000,
          },
          user1: {
            total: 15000,
            food: 8000,
            transportation: 2000,
            education: 2000,
            others: 3000,
          },
        },
        defaultExpenseAllocation: {
          allocationType: "percentage",
          details: {
            percentage: {
              user0: 70,
              user1: 30,
            },
          },
        },
      },
    ]);
    debug("Created document:\n%O", doc);
  } catch (err) {
    debug("Error creating seed document:\n%O", err);
  }
}
