// point these at the right relative paths in your project
import Tasks       from './tasks.model.js';
import Reservation from '../../modules/Reservation/Reservation.model.js';
import UserTask    from "./UserTask.model.js";

// GET all tasks
export const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find().sort({ createdAt: -1 });
    return res.status(200).json({ data: tasks });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch tasks' });
  }
};

// GET task by ID
export const getTaskById = async (req, res) => {
  try {
    const task = await Tasks.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json({ data: task });
  } catch (err) {
    if (err.name === 'CastError')
      return res.status(400).json({ message: 'Invalid task ID' });
    return res.status(500).json({ message: err.message });
  }
};

// POST create task
export const createTask = async (req, res) => {
  const {
    title, description,
    category, requiredReservations,
    startDate, endDate,
    pointToWin,
  } = req.body;

  try {
    const newTask = new Tasks({
      title,
      description,
      category,
      requiredReservations,
      startDate: new Date(startDate),
      endDate:   new Date(endDate),
      pointToWin,
    });
    await newTask.save();
    return res.status(201).json({ success: true, data: newTask });
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: err.message });
  }
};

// PUT update task
export const updateTask = async (req, res) => {
  const {
    title,
    category, requiredReservations,
    startDate, endDate,
    pointToWin,
  } = req.body;

  try {
    const updated = await Tasks.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category,
        requiredReservations,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate:   endDate   ? new Date(endDate)   : undefined,
        pointToWin,

      },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json({ success: true, data: updated });
  } catch (err) {
    if (['ValidationError','CastError'].includes(err.name))
      return res.status(400).json({ message: err.message });
    return res.status(500).json({ message: err.message });
  }
};

// DELETE task
export const deleteTask = async (req, res) => {
  try {
    const deleted = await Tasks.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    return res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    if (err.name === 'CastError')
      return res.status(400).json({ message: 'Invalid task ID' });
    return res.status(500).json({ message: err.message });
  }
};

// GET task status for current user
export const checkTaskStatus = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const task = await Tasks.findById(taskId);
  if (!task) return res.status(404).json({ message: 'Task not found' });

  const count = await Reservation.countDocuments({
    user:     userId,
    category: task.category,
    date: {
      $gte: task.startDate,
      $lte: task.endDate
    }
  });

  let ut = await UserTask.findOne({ user: userId, task: taskId });
  if (!ut) ut = await UserTask.create({ user: userId, task: taskId });

  if (!ut.isCompleted && count >= task.requiredReservations) {
    ut.isCompleted  = true;
    ut.completedAt  = new Date();
    await ut.save();
  }

  return res.json({
    required:    task.requiredReservations,
    done:        count,
    isCompleted: ut.isCompleted,
    isClaimed:   ut.isClaimed
  });
};

// POST claim points
export const claimTask = async (req, res) => {
  const userId = req.user.id;
  const { taskId } = req.params;

  const ut = await UserTask.findOne({ user: userId, task: taskId });
  if (!ut) return res.status(404).json({ message: 'Task not started' });
  if (!ut.isCompleted) return res.status(400).json({ message: 'Not completed' });
  if (ut.isClaimed)   return res.status(400).json({ message: 'Already claimed' });

  ut.isClaimed  = true;
  ut.claimedAt  = new Date();
  await ut.save();

  const task = await Tasks.findById(taskId);
  // TODO: add task.pointToWin to the user's points in your User model

  return res.json({ success: true, pointsAwarded: task.pointToWin });
};

// GET all claimed tasks for current user
export const getClaimedTasks = async (req, res) => {
  const userId = req.user.id;
  const list = await UserTask.find({ user: userId, isClaimed: true })
    .populate('task')
    .sort({ claimedAt: -1 });

  return res.status(200).json({ data: list });
};
