import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: {},
      required: true,
    },
    fav: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      // required: true,
      enum: ["admin", "organization", "user"]
    },
  },
  { timestamps: true }
);

export default mongoose.model("users", userSchema);