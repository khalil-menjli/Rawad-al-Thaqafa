import mongoose from 'mongoose';
const { Schema } = mongoose;

const tasksSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Books', 'Museums', 'Library', 'Cinema'],
    required: true
  },
  requiredReservations: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  pointToWin: {
    type: Number,
    required: true
  },
  completedBy: {
    type: Number,
    required: false,
    default: 0
  }
}, { timestamps: true });

export default mongoose.model('Tasks', tasksSchema);
