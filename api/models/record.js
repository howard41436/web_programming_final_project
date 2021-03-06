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
      enum: ["food", "transportation", "education", "others"],
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
      validate: {
        validator(v) {
          return (
            this.paid.user0 + this.paid.user1 === v &&
            this.owed.user0 + this.owed.user1 === v
          );
        },
        message: "paid and owed price should both add up to total price",
      },
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
        required: true,
      },
      user1: {
        type: Number,
        min: 0,
        required: true,
      },
    },
    owed: {
      user0: {
        type: Number,
        min: 0,
        required: true,
      },
      user1: {
        type: Number,
        min: 0,
        required: true,
      },
    },
  },
  { timestamps: true, collection: "record" }
);
RecordSchema.index({ pairId: 1, date: 1 });

const Record = model("record", RecordSchema);

export default Record;
