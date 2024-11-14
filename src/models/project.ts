// models/project.ts
import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

interface ProjectStage {
  stageId: mongoose.Types.ObjectId;
  name: string;
  status: string;
  progress: number;
  expectedCompletion: Date;
  actualCompletion: Date;
  comments: StageComment[];
}

interface StageComment {
  body: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

export interface IProject extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId | IUser;
  teamMembers: mongoose.Types.ObjectId[];
  stages: ProjectStage[];
  createdAt: Date;
  updatedAt: Date;
}

const stageCommentSchema: Schema = new Schema({
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const projectStageSchema: Schema = new Schema({
  name: { type: String, required: true },
  status: { type: String, default: "pending" },
  progress: Number,
  expectedCompletion: Date,
  actualCompletion: Date,
  comments: [stageCommentSchema],
});

const projectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    stages: [projectStageSchema],
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
