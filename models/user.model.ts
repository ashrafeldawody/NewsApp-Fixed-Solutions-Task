import mongoose, { Schema, Document } from 'mongoose';
import { sign } from 'jsonwebtoken';
import { jwtSecret } from '../config';
export interface IUser extends Document {
    email: string;
    fullName: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    fullName: { type: String, required: true },
    password: { type: String, required: true },
});

UserSchema.methods.generateToken = function() {
    return sign({_id: this._id}, jwtSecret);
};

export default mongoose.model<IUser>('User', UserSchema);
