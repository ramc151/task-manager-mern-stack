import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from 'react-toastify'

const Url = 'http://localhost:3000';

export const createTask = createAsyncThunk('/task/create', async (taskData, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.token;
        const response = await axios.post(`${Url}/task`, taskData, {
            headers: { Authorization: token }
        });
        if (response && response.status == 200) {
            toast.success(response.data.message)
        }
        return response.data.task;

    } catch (error) {
        toast.warn(error.response.data.message)
        return thunkApi.rejectWithValue(error.response.data)
    }
})

export const fetchTask = createAsyncThunk('/task/fetch', async (_, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.token;
        const response = await axios.get(`${Url}/task`, {
            headers: { Authorization: token }
        });
        return response.data;

    } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})

export const deleteTask = createAsyncThunk('/task/delete', async (taskId, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.token;
        const response = await axios.delete(`${Url}/task/${taskId}`, { headers: { Authorization: token } });
        if (response && response.status == 200) {
            toast.dark(response.data.message)
        }
        return taskId;
    } catch (error) {
        toast.warn(error.response.data.message)
        return thunkApi.rejectWithValue(error.response.data);
    }
})

export const updateTask = createAsyncThunk('/task/update', async ({ taskId, title, description }, thunkApi) => {
    try {
        const token = thunkApi.getState().auth.token;
        const response = await axios.put(`${Url}/task/${taskId}`, { title, description }, { headers: { Authorization: token } });
        return response.data;
    } catch (error) {
        return thunkApi.rejectWithValue(error.response.data)
    }
})

const taskSlice = createSlice({
    name: 'task',
    initialState: {
        tasks: [],
        error: null
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTask.fulfilled, (state, action) => {
                state.tasks.push(action.payload)
            })
            .addCase(createTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(fetchTask.fulfilled, (state, action) => {
                state.tasks = action.payload;
            })
            .addCase(fetchTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.tasks = state.tasks.filter(task => task._id !== action.payload)
            })
            .addCase(deleteTask.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                const index = state.tasks.findIndex(task => task._id === action.payload._id);
                if (index !== -1) {
                    state.tasks[index] = action.payload;
                }
            })
            .addCase(updateTask.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
})

export default taskSlice.reducer;