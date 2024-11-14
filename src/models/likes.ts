import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user';
import { IPost } from './post';
import { IComment } from './comment';

export interface ILike extends Document {
    user: IUser['_id'];
    post?: IPost['_id'];
    comment?: IComment['_id'];
}

const likeSchema: Schema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
    },
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
    }
}, { timestamps: true });

const Like = mongoose.model<ILike>('Like', likeSchema);
export default Like;
