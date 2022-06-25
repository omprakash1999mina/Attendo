import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const holidaySchema = new Schema({
    adminId: { type: String, required: true },
    days: { type: Array, required: true },
    dates: { type: Array, required: true },
}, { timestamps: true });

export default mongoose.model('Holiday', holidaySchema, 'holidays');
