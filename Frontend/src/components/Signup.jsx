import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { signup } from '../features/authSlice'

const Signup = () => {
    const [auth, setAuth] = useState({ username: '', password: '' })
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const inputHandler = (e) => {
        setAuth({ ...auth, [e.target.name]: e.target.value })
    }

    const SubmitHandler = (e) => {
        e.preventDefault();
        dispatch(signup(auth)).then((action) => {
            if (action.type === '/signup/fulfilled') {
                navigate('/')
            }
        })
    }

    return (
        <div className="container mt-5">
            <h3>Signup</h3>
            <form onSubmit={SubmitHandler}>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput1" className="form-label">Username</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Username" name='username' value={auth.username} onChange={inputHandler} />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleFormControlInput2" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleFormControlInput2" placeholder="Password" name='password' value={auth.password} onChange={inputHandler} />
                </div>
                <button type='submit' className='btn btn-info'>Signup</button>
            </form>
            <p>Already have an account? <Link to="/">Login here</Link></p>
        </div>
    )
}

export default Signup