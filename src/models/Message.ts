// models/Message.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IConversation } from './Conversation';

export interface IMessage extends Document {
  conversation: IConversation['_id'];
  sender: IUser['_id'];
  content?: string; // Optional for file-only messages
  file?: string; // Stores the GridFS file ID
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    conversation: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    file: { type: String }, // Stores GridFS file ID
  },
  { timestamps: true }
);

export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
