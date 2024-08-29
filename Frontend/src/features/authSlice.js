import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';
import { toast } from "react-toastify";

const Url = 'http://localhost:3000';

export const signup = createAsyncThunk('/signup', async (userData, thunkApi) => {
    try {
        const response = await axios.post(`${Url}/signup`, userData);
        if (response && response.status == 200) {
            toast.success(response.data.message)
        }
        return response.data
    } catch (error) {
        toast.warn(error.response.data.message)
        return thunkApi.rejectWithValue(error.response.data)
    }
})

export const login = createAsyncThunk('/login', async (userData, thunkApi) => {
    try {
        const response = await axios.post(`${Url}/login`, userData);
        const token = response.data.token;
        localStorage.setItem('token', token);
        if (token) toast.success(response.data.message)
        return token;
    } catch (error) {
        toast.warn(error.response.data.message)
        return thunkApi.rejectWithValue(error.response.data)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: localStorage.getItem('token') || null,
        error: null
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.token = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signup.fulfilled, (state, action) => {
                state.error = null;
            })
            .addCase(signup.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
})

export const { logout } = authSlice.actions;
export default authSlice.reducer;