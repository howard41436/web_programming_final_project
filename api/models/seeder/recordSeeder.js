import Debug from "debug";
import Record from "../record";

const debug = Debug("seeder:record");

const getRandomInt = (max, flag) =>
  flag
    ? Math.floor((Math.random() * Math.floor(max)) / 10) * 10
    : Math.floor(Math.random() * Math.floor(max));

const generateSeed = () => {
  const cate = ["food", "transportation", "education", "others"];
  const result = [];
  Array.from({ length: 12 }, (_, key) => {
    Array.from({ length: key === 0 ? 30 : 60 }, (__, k) => {
      const owner = getRandomInt(3) - 1;
      const price = getRandomInt(1000, true) + 50;
      const percent =
        getRandomInt(100) < 85 ? 0.7 : getRandomInt(100) < 50 ? 0.57 : 0.8;
      const owed = Math.floor((price * percent) / 10) * 10;
      const paid = Math.floor((price * 0.7) / 10) * 10;

      result.push({
        pairId: 0,
        category: cate[Math.max(getRandomInt(5), 1) - 1],
        owner,
        price,
        name: `seed_${key === 0 ? 2021 : 2020}_${key + 1}_${k}`,
        date: new Date(
          `${key === 0 ? 2021 : 2020}-${key + 1}-${
            getRandomInt(key === 0 ? 19 : 28) + 1
          }`
        ),
        paid: {
          user0: owner === 0 ? price : owner === 1 ? 0 : paid,
          user1: owner === 1 ? price : owner === 0 ? 0 : price - paid,
        },
        owed: {
          user0: owner === 0 ? price : owner === 1 ? 0 : owed,
          user1: owner === 1 ? price : owner === 0 ? 0 : price - owed,
        },
      });
      return true;
    });
    return true;
  });
  return result;
};

export default async function seedRecord() {
  try {
    const doc = await Record.create([
      ...generateSeed(),
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
