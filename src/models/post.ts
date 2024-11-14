import mongoose, { Schema, Document } from "mongoose";

export interface IPost extends Document {
  _id: string;
  title: string;
  body: string;
  user: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  comments: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}


const postSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    imageUrl: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model<IPost>("Post", postSchema);
