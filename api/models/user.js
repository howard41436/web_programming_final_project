import pkg from "mongoose";

const inviteCodeDigits = 5;
const inviteCodeMin = 10 ** (inviteCodeDigits - 1);
const inviteCodeRange = 9 * inviteCodeMin;
export const inviteCodeParams = {
  inviteCodeDigits,
  inviteCodeMin,
  inviteCodeRange,
};

const pairIdDigits = 5;
const pairIdMin = 0;
const pairIdRange = 10 ** pairIdDigits;
export const pairIdParams = {
  pairIdDigits,
  pairIdMin,
  pairIdRange,
};

const { model, Schema } = pkg;
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    icon: {
      type: Number,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    matched: {
      type: Boolean,
      required: true,
    },
    pairId: {
      type: Number,
      required() {
        return this.matched === true;
      },
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator(v) {
          return (
            v.length === 5 && parseInt(v, 10) - inviteCodeMin < inviteCodeRange
          );
        },
      },
    },
  },
  { timestamps: true, collection: "user" }
);
UserSchema.index({ inviteCode: 1 });

export const User = model("user", UserSchema);
