import mongoose from 'mongoose';
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offer: {
    type: Schema.Types.ObjectId,
    ref: 'Offers',
    required: true
  },
  category: {
    type: String,
    enum: ['Books', 'Museums', 'Library', 'Cinema'],
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model('Reservation', ReservationSchema);
