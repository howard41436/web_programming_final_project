import pkg from "mongoose";

const { model, Schema } = pkg;
const SettlementSchema = new Schema(
  {
    pairId: {
      type: Number,
      min: 0,
      required: true,
    },
    receivedMoneyOfUser0: {
      type: Number,
      required: true,
      validate: {
        validator(v) {
          return v !== 0;
        },
        message: "net money flow should not be zero.",
      },
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true, collection: "settlement" }
);
SettlementSchema.index({ pairId: 1, date: 1 });

const Settlement = model("settlement", SettlementSchema);

export default Settlement;
