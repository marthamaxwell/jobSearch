import mongoose from "mongoose";
import validator from "validator";

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error(`Invalid email address: ${value}`);
        }
      },
    },
    password: {
      type: String,
      trim: true,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error(
            `Weak password: ${value}. Your password must include lowercase, uppercase, digits, symbols and must be at least 8 characters`
          );
        }
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    permissions: {
      job: {
        create: {
          type: Boolean,
          default: true,
        },
        read: {
          type: Boolean,
          deafult: true,
        },
        update: {
          ype: Boolean,
          deafult: true,
        },
        remove: {
          ype: Boolean,
          deafult: false,
        },
      },
    },
    profile: {
      bio: String,
      contactNumber: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const User = mongoose.model("User", userSchema);

export default User;
