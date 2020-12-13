import pkg from "mongoose";
// import uniqueValidator from "mongoose-unique-validator";

const { model, Schema } = pkg;
const RecordSchema = new Schema(
  {
    pairId: {
      type: Number,
      min: 0,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    owner: {
      type: Number,
      min: -1,
      max: 1,
      required: true,
    },
    price: {
      type: Number,
      min: 0,
      required: true,
    },
    name: String,
    date: {
      type: Date,
      required: true,
      index: true,
    },
    paid: {
      user0: {
        type: Number,
        min: 0,
      },
      user1: {
        type: Number,
        min: 0,
      },
    },
    owed: {
      user0: {
        type: Number,
        min: 0,
      },
      user1: {
        type: Number,
        min: 0,
      },
    },
  },
  { collection: "record" }
);
RecordSchema.index({ pairId: 1, date: 1 });

const Record = model("record", RecordSchema);

export default Record;
