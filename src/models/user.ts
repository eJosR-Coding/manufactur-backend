import mongoose, { Schema, Document } from "mongoose";

interface Profile {
  bio: string;
  profilePicture: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  profile: Profile;
  createdAt: Date;
  updatedAt: Date;
}

const profileSchema: Schema = new Schema({
  bio: String,
  profilePicture: String,
});

const userSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: profileSchema,
  },
  { timestamps: true }
);

export default mongoose.model<IUser>("User", userSchema);
