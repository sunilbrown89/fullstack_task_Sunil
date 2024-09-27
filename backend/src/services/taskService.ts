import { redisClient } from '../config';
import { Task } from '../models/taskModel';


const TASK_KEY = "FULLSTACK_TASK_SUNIL";
const LIMIT_KEY = "LIMIT_EXCEEDED"; 


export const addTaskToCache = async (task: string) => {
  const limitFlag = await redisClient.get(LIMIT_KEY);

  if (limitFlag) {
    await Task.create({ task });
    console.log('Task added directly to MongoDB after limit exceeded.');
    return;
  }

  let tasks = await redisClient.get(TASK_KEY);
  let taskList = tasks ? JSON.parse(tasks) : [];
  taskList.push(task);

  if (taskList.length > 2) {
    await Task.insertMany(taskList.map((t: string) => ({ task: t })));
    await redisClient.del(TASK_KEY); 
    await redisClient.set(LIMIT_KEY, "true"); 
    console.log('Moved tasks to MongoDB and flushed Redis cache. Switching to MongoDB for future tasks.');
  } else {
    await redisClient.set(TASK_KEY, JSON.stringify(taskList));
    console.log('Task added to Redis cache.');
  }
};


export const fetchAllTasks = async () => {
  const limitFlag = await redisClient.get(LIMIT_KEY);

  if (limitFlag) {
    const mongoTasks = await Task.find();
    console.log('Fetched tasks from MongoDB because Redis is bypassed.');
    return mongoTasks;
  }

  
  const redisTasks = await redisClient.get(TASK_KEY);

  if (redisTasks) {
    console.log('Fetched tasks from Redis');
    return JSON.parse(redisTasks).map((t: string) => ({ task: t }));
  }

  
  const mongoTasks = await Task.find();
  console.log('Fetched tasks from MongoDB');
  return mongoTasks;
};

export const deleteAllTasks = async () => {
  try {
    await redisClient.del(TASK_KEY);
    await redisClient.del(LIMIT_KEY); 
    console.log('All tasks and limit flag deleted from Redis.');

    await Task.deleteMany({});
    console.log('All tasks deleted from MongoDB.');

  } catch (error) {
    console.error('Error deleting tasks:', error);
  }
};
