import mongoose, { Schema } from 'mongoose'

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '1h'
    }
}, { collection: 'tokens', timestamps: true })

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { collection: 'users', timestamps: true } )

export const User = mongoose.model('user', userSchema)
export const Token = mongoose.model('token', tokenSchema)