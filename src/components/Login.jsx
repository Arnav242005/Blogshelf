import React, { useContext, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom';
import '../login.css'
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import bcrypt from "bcryptjs";

function Login() {

  const navigate = useNavigate();

  const {dispatch} = useContext(AuthContext);
  const [errorMessage,setErrorMessage] = useState('');

  const {register,reset,handleSubmit} = useForm({
    defaultValues:{
      username:'',
      password:'',
    }
  });

  const onSubmit = async (formdata) => {
    const {username,password} = formdata;

    try{
      dispatch({type:"LOGIN_START"});
      
      const res = await axios.get(`https://688f6c68f21ab1769f8927ce.mockapi.io/users`);

      const user = res.data.find((u) => u.username === username);
      if(!user){
        dispatch({type:"LOGIN_FAILURE",payload:"User not found"});
        setErrorMessage("User Not Found. ");
        return;
      }

      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        dispatch({ type: "LOGIN_FAILURE", payload: "Incorrect password" });
        setErrorMessage("Incorrect password.");
        return;
      }

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      reset();
      alert("Login Successfull");
      navigate("/taskform");

    }catch(error){
      console.error(error);
      dispatch({ type: "LOGIN_FAILURE", payload: "Login failed" });
      setErrorMessage("Something went wrong. Try again.");
    }
  }

  return (
    <div className='logincont'>
      <form onSubmit={handleSubmit(onSubmit)} className='formdiv'>
        <h2 className='loginh2'>Login Form</h2>
        <input type='text' placeholder='Username' {...register('username',{required:true})}/>
        <input type='password' placeholder='password' {...register('password',{required:true})}/>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <button type='submit' className='loginbtn'>Login</button>
        <p className='otherp'>Not a User? <Link to={"/register"}>Register</Link></p>
      </form>
    </div>
  )
}

export default Login
