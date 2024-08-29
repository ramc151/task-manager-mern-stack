import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { login } from '../features/authSlice'

const Login = () => {
    const [auth, setAuth] = useState({ username: '', password: '' })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputHandler = (e) => {
        setAuth({ ...auth, [e.target.name]: e.target.value })
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        dispatch(login(auth)).then((action) => {
            if (action.type === '/login/fulfilled') {
                navigate('/task')
            }
        })
    }

    return (
        <div className="container mt-5">
            <h3>Login</h3>
            <form onSubmit={SubmitHandler}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username' value={auth.username} onChange={inputHandler} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput2" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleFormControlInput2" placeholder="Password" name='password' value={auth.password} onChange={inputHandler} />
                </div>
                <button type='submit' className='btn btn-info'>Login</button>
            </form>
            <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
        </div>
    )
}

export default Login