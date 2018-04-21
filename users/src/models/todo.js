import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const todoSchema = new Schema({
  name: { type: String, required: true, select: true },
  description: { type: String, required: false, select: true },
  dueDate: { type: Date, required: false },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  isComplete: { type: Boolean, default: false },
  tasks: { type: [{ type: Schema.Types.ObjectId, ref: 'Todo' }] },
  priority: { type: Number, default: 0 }
}, {
  id: false,
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
});

mongoose.model('Todo', todoSchema);
