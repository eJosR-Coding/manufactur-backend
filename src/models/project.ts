import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";

interface StageComment {
  body: string;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

interface ProjectStage {
  stageId: mongoose.Types.ObjectId;
  name: string;
  status: string; // Ejemplo: "pending", "in progress", "completed"
  progress: number; // Porcentaje de progreso
  expectedCompletion: Date;
  actualCompletion: Date;
  comments: StageComment[]; // Comentarios relacionados a la etapa
}

export interface IProject extends Document {
  name: string;
  description: string;
  createdBy: mongoose.Types.ObjectId | IUser;
  teamMembers: mongoose.Types.ObjectId[]; // Miembros del proyecto
  stages: ProjectStage[]; // Etapas del proyecto
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
  status: { type: String, default: "pending" }, // Estado inicial "pendiente"
  progress: { type: Number, default: 0 }, // Progreso inicial en 0%
  expectedCompletion: Date,
  actualCompletion: Date,
  comments: [stageCommentSchema], // Comentarios relacionados con esta etapa
});

const projectSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Miembros
    stages: [projectStageSchema], // Etapas
  },
  { timestamps: true }
);

export default mongoose.model<IProject>("Project", projectSchema);
