import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IProject } from './project';

export interface IPost extends Document {
  title: string;
  body: string;
  user: IUser['_id'];
  project: IProject['_id']; // Relación con el proyecto
  createdAt: Date;
}

const postSchema: Schema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true }, // Nueva relación con el proyecto
}, { timestamps: true });

export default mongoose.models.Post || mongoose.model<IPost>('Post', postSchema);
