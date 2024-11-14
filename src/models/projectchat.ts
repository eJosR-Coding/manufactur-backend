import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IProject } from './project';

export interface IProjectChat extends Document {
  projectId: IProject['_id'];
  sender: IUser['_id'];
  message: string;
  imageUrl?: string; // URL de imagen en caso de que el mensaje contenga una imagen
  createdAt: Date;
}

const projectChatSchema: Schema = new Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  imageUrl: { type: String }, // Campo opcional para la imagen
}, { timestamps: true });

export default mongoose.models.ProjectChat || mongoose.model<IProjectChat>('ProjectChat', projectChatSchema);
