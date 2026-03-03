const Task = require('./schema');

// 1. Get All Tasks with Filters
exports.getTasks = async (req, res) => {
  try {
    // URL se status aur category dono nikaalna
    // Example: /api/tasks?status=active&category=Work
    const { status, category } = req.query;
    
    let query = {};

    // 1. Status Filter Logic
    if (status && status !== 'all') {
      query.status = status;
    }

    // 2. Category Filter Logic (Added this)
    if (category && category !== 'All') {
      query.category = category;
    }

    // Database se filter kiya hua data lana
    const tasks = await Task.find(query).sort({ createdAt: -1 });
    
    // Humesha calculate karna ki kitne tasks pending/active hain
    const tasksLeft = await Task.countDocuments({ status: 'active' });

    res.status(200).json({ 
      success: true,
      tasks, 
      tasksLeft 
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// 2. Create Task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task(req.body);
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 3. Update/Toggle Task Status
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 4. Delete Task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 5. Clear Completed
exports.clearCompleted = async (req, res) => {
  try {
    await Task.deleteMany({ status: 'completed' });
    res.status(200).json({ message: "Completed tasks cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};