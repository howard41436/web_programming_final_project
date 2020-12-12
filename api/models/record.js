import pkg from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

const { model, Schema } = pkg;

const RecordSchema = new Schema({
  pairID: { type: Number, required: true },
  records: [
    {
      category: {
        type: String,
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
  ],
});

RecordSchema.plugin(uniqueValidator);
const Record = model("record", RecordSchema);

export default Record;
