// models/Conversation.ts
import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IMessage } from './Message';

export interface IConversation extends Document {
  participants: IUser['_id'][];
  messages: IMessage['_id'][];
}

const conversationSchema = new Schema<IConversation>({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
});

export default mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', conversationSchema);
