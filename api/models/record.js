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
    // `owner = -1` indicates owned by the couple
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
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    paid: {
      user0: {
        type: Number,
        min: 0,
        required: [
          function required() {
            return this.category !== "Income";
          },
          '"paid" field is required if this record is an expense rather than an income',
        ],
      },
      user1: {
        type: Number,
        min: 0,
        required: [
          function required() {
            return this.category !== "Income";
          },
          '"paid" field is required if this record is an expense rather than an income',
        ],
      },
    },
    owed: {
      user0: {
        type: Number,
        min: 0,
        required: [
          function required() {
            return this.category !== "Income";
          },
          '"owed" field is required if this record is an expense rather than an income',
        ],
      },
      user1: {
        type: Number,
        min: 0,
        required: [
          function required() {
            return this.category !== "Income";
          },
          '"owed" field is required if this record is an expense rather than an income',
        ],
      },
    },
  },
  { collection: "record" }
);
RecordSchema.index({ pairId: 1, date: 1 });

const Record = model("record", RecordSchema);

export default Record;
