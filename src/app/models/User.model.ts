import mongoose, { Document } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import bcryptjs from "bcryptjs";
import { generateToken } from "../../helpers/utils";
import { secretKey } from "../../config/jwt.config";

export interface SerializedUser {
  id: string;
  fullName: string;
  email: string;
  number: string;
  location:string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserDocument extends Document {
  fullName: string;
  email: string;
  number: string;
  passwordHash: string;
  location:string;
  token?: string;
  createJWT: (expiresIn: string) => string;
  comparePassword: (hashedPassword: string) => boolean;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      minlength: 3,
      maxlength: 20,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    number: {
      type: String,
      required: [true, "Phone number is required"],
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^\d{10}$/.test(v);
        },
        message: "Please enter a valid 10 digit phone number",
      },
    },
    passwordHash: {
      type: String,
      required: [true, "Password is required"],
    },
    location: {
      type: String,
      trim: true,
      maxlength: 20,
      default: 'my city',
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

userSchema.methods.createJWT = function (expiresIn: string) {
  return generateToken(
    { id: this.id, fullName: this.fullName },
    secretKey,
    expiresIn
  );
};

userSchema.methods.comparePassword = async function (candidatePassword: string) {
  const isMatch = await bcryptjs.compare(candidatePassword, this.passwordHash);
  return isMatch;
};

userSchema.methods.serialize = function (): SerializedUser {
  const userObject = this.toObject();
  return {
    id: userObject._id,
    fullName: userObject.fullName,
    email: userObject.email,
    number: userObject.number,
    location:userObject.location,
    createdAt: userObject.createdAt,
    updatedAt: userObject.updatedAt,
  };
};

const User = mongoose.model("User", userSchema);

export default User;
