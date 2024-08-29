const express = require('express')
const bodyParser = require('body-parser');
const User = require('./src/schema/auth')
const Task = require('./src/schema/task')
const jwt = require('jsonwebtoken');
const cors = require('cors');
const authenticate = require('./src/authenticate/auth')
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5173',
    credentials: true
}))
app.use(bodyParser.json())

app.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'plz filled properly' });

    const userExist = await User.findOne({ username })
    if (userExist) return res.status(402).json({ message: 'already registered plz login' });

    const newUser = new User({ username, password })
    try {
        const user = await newUser.save();
        if (user) return res.status(200).json({ message: 'User Registration Successfully' });
    } catch (error) {
        res.status(400).json({ message: 'registration failed' })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'plz filled properly' });

    const userExist = await User.findOne({ username, password })
    if (!userExist) return res.status(402).json({ message: 'Invalid Info' });

    const token = jwt.sign({ _id: userExist._id }, 'mynameisram', { expiresIn: '1h' })
    res.header('Authorization', token)
    res.status(200).json({ message: 'Login Successfully', token })
})

// create task
app.post('/task', authenticate, async (req, res) => {
    const { title, description } = req.body;
    if (!title || !description) return res.status(404).json({ message: 'plz filled properly' })
    const newTask = new Task({ title, description, userId: req.user._id });
    try {
        const task = await newTask.save();
        res.status(200).json({ message: 'Task Added Successfully', task });
    } catch (error) {
        res.status(400).json({ message: 'task create failed' })
    }
})

// get task
app.get('/task', authenticate, async (req, res) => {
    try {
        const task = await Task.find({ userId: req.user._id });
        res.json(task);
    } catch (error) {
        res.status(400).send(error)
    }
})

// update task
app.put('/task/:id', authenticate, async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate({ userId: req.user._id, _id: req.params.id }, { title: req.body.title, description: req.body.description }, { new: true });

        if (!updatedTask) return res.status(402).json({ message: 'Task not found' });
        res.status(200).json(updatedTask);

    } catch (error) {
        res.status(400).json({ message: 'update task failed' })
    }
})

// delete task
app.delete('/task/:id', authenticate, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ userId: req.user._id, _id: req.params.id });

        if (!deletedTask) return res.status(401).json({ message: 'Task not found' });
        res.status(200).json({ message: "Task deleted" })

    } catch (error) {
        res.status(400).json({ message: 'delete Task failed' })
    }
})

app.listen(3000, () => {
    console.log('server is listening');
})