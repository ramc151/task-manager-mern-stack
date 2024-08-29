import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { createTask, deleteTask, fetchTask, updateTask } from '../features/taskSlice';
import { Link } from 'react-router-dom';

const TaskManager = () => {
    const [task, setTask] = useState({ title: '', description: '' })
    const dispatch = useDispatch();
    const [editingTaskId, setEditingTaskId] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const { tasks } = useSelector(state => state.task);

    useEffect(() => {
        dispatch(fetchTask())
    }, [dispatch])

    const inputHandler = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    }

    const TaskSubmitHandler = (e) => {
        e.preventDefault();
        dispatch(createTask(task))
        setTask({ title: '', description: '' })
    }

    const editTaskHandler = (taskId, currentTitle, currentDescription) => {
        setEditingTaskId(taskId);
        setEditTitle(currentTitle);
        setEditDescription(currentDescription);
    }

    const updateTaskHandler = (taskId) => {
        dispatch(updateTask({ taskId, title: editTitle, description: editDescription }));
        setEditingTaskId(null)
    }

    return (
        <div className="container mt-5">
            <h3>Task Manager</h3>
            <form onSubmit={TaskSubmitHandler}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Title</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Title" name='title' value={task.title} onChange={inputHandler} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput2" className="form-label">Description</label>
                    <input type="text" className="form-control" id="exampleFormControlInput2" placeholder="Description" name='description' value={task.description} onChange={inputHandler} />
                </div>
                <button type='submit' className='btn btn-info'>Add Task</button>
                <Link to='/logout' className='btn btn-danger'>LogOut</Link>
            </form>

            <ul>
                {tasks && tasks.map((task) => {
                    return (
                        <li key={task._id}>
                            {
                                editingTaskId === task._id ? (
                                    <div className='d-flex my-3 w-50'>
                                        <input type="text" className="form-control" id="exampleFormControlInput1" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                                        <input type="text" className="form-control" id="exampleFormControlInput2" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} />
                                        <button className='btn btn-secondary' onClick={() => updateTaskHandler(task._id)}>Save</button>
                                    </div>) : (
                                    <div className='my-3'>
                                        <h4>{task.title}</h4>
                                        <p>{task.description}</p>
                                        <button className='btn btn-success' onClick={() => editTaskHandler(task._id, task.title, task.description)}>Edit Task</button>
                                        <button className='btn btn-danger' onClick={() => dispatch(deleteTask(task._id))}>Delete Task</button>
                                    </div>)
                            }
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default TaskManager