import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

export interface IComment extends Document {
  body: string;
  user: IUser["_id"];
  post: mongoose.Types.ObjectId;
  parentCommentId?: IComment["_id"]; // Cambiado a parentCommentId
  replies?: IComment["_id"][];
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema = new Schema(
  {
    body: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" }, // Cambiado a parentCommentId
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

export default mongoose.models.Comment || mongoose.model<IComment>("Comment", commentSchema);
