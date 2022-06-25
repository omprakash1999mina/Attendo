import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const attendanceTimeSchema = new Schema({
    adminId: { type: String, required: true },
    attendanceTime: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model('AttendanceTime', attendanceTimeSchema, 'attendanceTimes');
