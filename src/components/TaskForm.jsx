import React, { useContext } from 'react'
import { useForm } from 'react-hook-form'
import '../App.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function TaskForm() {

    const navigate = useNavigate();

    const {state} = useContext(AuthContext);

    const {register,handleSubmit,reset} = useForm({
        defaultValues:{
            title:'',
            date:'',
            description:''
        }
    });
 
    const onSubmit = async (formdata) => {
        const taskdata = {
            ...formdata,
            user: state.user.username
        };
        try {
            const response = await axios.post('https://688f6c68f21ab1769f8927ce.mockapi.io/tasks', taskdata);
            console.log('Task added:', response.data);
            reset();
            alert("Task Added Successfully");
            navigate('/alltasks');
        } catch (error) {
            console.error("Error adding task:", error);
            alert("Failed to add task.");
        }
    }

  return (
    <section>
        <div className='formdiv'>
            <h2 className='taskh1'>Add Task</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type='text' placeholder='Title' {...register('title',{required:true})}/>
                <input type='date' placeholder='dd-mm-yyyy' {...register('date',{required:true})}/>
                <textarea placeholder='Enter task description' {...register('description', { required: true })} rows={5} cols={40}/>
                <button className='addbtn' type='submit'><p >Submit</p></button>
            </form>
      </div>
    </section>
  )
}

export default TaskForm
