const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "Please enter first name"],
    },
    lname: {
      type: String,
      required: [true, "Please enter last name"],
    },
    email: {
      type: String,
      required: [true, "Please enter email"],
    },
    username: {
      type: String,
      required: [true, "Please enter username"],
      unique: [
        true,
        "Username already exist. Please enter a different username",
      ],
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      required: true,
      unique: [
        true,
        "Phone already exist. Please enter a different phone number",
      ],
    },
    following: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: null,
    },
    followers: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: null,
    },
    details: {
      dob: {
        type: Date,
      },
      relation: {
        type: String,
        enum: {
          values: ["single", "married"],
          message: "{VALUE} is not supported!",
        },
      },
      gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: "{VALUE} is not supported!",
        },
      },
      bio: String,
      work: String,
      education: String,
      city: String,
      hometown: String,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
