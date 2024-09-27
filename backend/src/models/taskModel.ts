import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
});

export const Task = mongoose.model('sunilTodoTask', taskSchema);
