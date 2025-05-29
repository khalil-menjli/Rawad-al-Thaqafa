// use named imports for Schema, then default-export the model
import mongoose, { Schema } from 'mongoose';

const UserTaskSchema = new Schema({
  user:        { type: Schema.Types.ObjectId, ref: 'User',  required: true },
  task:        { type: Schema.Types.ObjectId, ref: 'Tasks', required: true },
  isCompleted: { type: Boolean, default: false },
  isClaimed:   { type: Boolean, default: false },
  completedAt: { type: Date },
  claimedAt:   { type: Date }
}, { timestamps: true });

export default mongoose.model('UserTask', UserTaskSchema);
