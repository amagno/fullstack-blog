import mongoose, { Schema } from 'mongoose'


const postSchema = new Schema({
    title: {
        type: String
    },
    body: {
        type: String
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
}, { collection: 'posts', timestamps: true })


export const Post = mongoose.model('post', postSchema)