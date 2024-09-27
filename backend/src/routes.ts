import { Router, Request, Response } from 'express';
import { addTaskToCache, fetchAllTasks, deleteAllTasks } from './services/taskService';

const router = Router();


router.post('/add', async (req: Request, res: Response) => {
  const { task } = req.body;

  if (!task) {
    return res.status(400).send('Task is required');
  }

  try {
    await addTaskToCache(task);
    res.status(201).send(`${task} addeded successfully`);
  } catch (error) {
    res.status(500).send('Error adding task');
    console.log(error);
  }
});


router.get('/fetchAllTasks', async (req: Request, res: Response) => {
  try {
    const tasks = await fetchAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).send('Error fetching tasks');
  }
});


router.delete('/deleteAllTasks', async (req: Request, res: Response) => {
  try {
    await deleteAllTasks();
    res.send('All tasks deleted successfully');
  } catch (error) {
    res.status(500).send('Error deleting tasks');
  }
});

export default router;
