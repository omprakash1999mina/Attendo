import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const teamSchema = new Schema({
    adminId: { type: Object, required: true },
    teamBg: { type: String, required: true },
    teamName: { type: String, required: true },
    abreviation: { type: Object, required: true }
}, { timestamps: true });

export default mongoose.model('Team', teamSchema, 'teams');
