import pkg from "mongoose";

const budgetType = {
  total: Number,
  food: Number,
  transportation: Number,
  education: Number,
  others: Number,
};

const { model, Schema } = pkg;
const ProfileSchema = new Schema(
  {
    pairId: {
      type: Number,
      min: 0,
      required: true,
      unique: true,
    },
    user0: {
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
      },
    },
    user1: {
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
      },
    },
    budget: {
      user0: budgetType,
      user1: budgetType,
      total: budgetType,
    },
    defaultExpenseAllocation: {
      allocationType: {
        type: String,
        default: "equal",
        enum: ["user0 pays", "user1 pays", "equal", "percentage", "AA"],
      },
      details: {
        percentage: {
          user0: {
            type: Number,
            required() {
              return (
                this.defaultExpenseAllocation.allocationType === "percentage"
              );
            },
          },
          user1: {
            type: Number,
            required() {
              return (
                this.defaultExpenseAllocation.allocationType === "percentage"
              );
            },
            validate(v) {
              return (
                this.defaultExpenseAllocation.details.percentage.user0 + v ===
                100
              );
            },
          },
        },
      },
    },
  },
  { timestamps: true, collection: "profile" }
);
ProfileSchema.index({ pairId: 1 });

const Profile = model("profile", ProfileSchema);

export default Profile;
