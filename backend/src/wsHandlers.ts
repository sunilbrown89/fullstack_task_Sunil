import { Server } from 'socket.io';
import { addTaskToCache } from './services/taskService';

export const wsHandlers = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('add', async (task: string) => {
      await addTaskToCache(task);
      io.emit('taskAdded', task); // Broadcast to all clients
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
