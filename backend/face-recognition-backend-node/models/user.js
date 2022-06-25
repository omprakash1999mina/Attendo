import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const userSchema = new Schema({
    role: { type: String, default: "staff" },
    adminId: { type: String, required: true },
    userName: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    teamName: { type: String, required: true },
    encodings: { type: String, required: true },
    attendance: { type: Object, required: true },
    workProfile: { type: String, required: true },
    contactNumber: { type: String, required: true },
    profileImgLink: { type: String, required: true },

}, { timestamps: true });

export default mongoose.model('User', userSchema, 'users');

