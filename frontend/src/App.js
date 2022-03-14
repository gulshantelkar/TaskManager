import React, {useEffect ,useState} from "react";
import './App.css';
import {TextField,Button} from '@mui/material';
import DateAdapter from '@mui/lab/AdapterMoment';
import { DatePicker, LocalizationProvider } from "@mui/lab";
import axios from "axios";


function App() {
	const [title,updateTitle] = useState('');
	const [desc,updateDesc] = useState('');
	const [date,updateDate] = useState(null);

	const [tasks, updateTasks] = useState([]);

	const fetchTasks = async () => {
		try{
			const response = await axios.get('http://localhost:3001/');
			if(response.status === 200){
				const data = response.data;
				updateTasks(data);
			}
		}catch(err){
			console.log(err);
		}
		
	}

	const deleteTask = async (taskId) => {
		try{
			const response = await axios.delete(`http://localhost:3001/${taskId}`);
			if(response.status === 200){
				const newTasks = tasks.filter((task) => task._id!==taskId);
				updateTasks(newTasks);
			}
		}catch(err){
			console.log(err);
		}
	}

	const createTask = async () => {
		try{	
			if(!(title!=='' && desc!=='' && date!==null )){
				return;
			}
			const response = await axios.post(`http://localhost:3001/`,{title: title,desc:desc,date: date.format()});
			if(response.status === 200){
				const newTask = response.data;
				console.log(newTask);
				const copy = [...tasks];
				// const copy = tasks.filter();
				copy.push(newTask);
				updateTasks(copy);
			}
		}catch(err){
			console.log(err);
		}
	}

	const completeTask = async (taskId) => {
		try{	
			const response = await axios.post(`http://localhost:3001/complete`,{id:taskId});
			if(response.status === 200){
				const updatedTask = response.data;
				const copy = [...tasks];
				const index = copy.findIndex((e) => e._id === updatedTask._id);
				copy[index] = updatedTask;
				updateTasks(copy);
			}
		}catch(err){
			console.log(err);
		}
	}
	
  useEffect(() => {  
    fetchTasks();
  }, []);
  
  return (
    <div className="App">
      <center>
		<div id="interface">
			<h1>Task Manager</h1>
			<TextField value={title} onChange={(value)=>updateTitle(value.target.value)} id="title" label="Task Title" variant="outlined" fullWidth/>
			<br/><br/>
			<TextField value={desc} onChange={(value)=>updateDesc(value.target.value)} id="desc" multiline minRows={4} label="Task Description" variant="outlined" fullWidth/>
			<br/><br/>
				<LocalizationProvider dateAdapter={DateAdapter}>
      <DatePicker
        label="Date"
        value={date}
        onChange={(newValue) => {
          updateDate(newValue);
		  console.log(newValue);
        }}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
    </LocalizationProvider>
	<br/>
	<br/>
	<Button variant="contained" color="primary" onClick={() => createTask()}>
  Create
</Button>

			<br/><br/>
		</div>
		<br/><br/>
		<h1>Your Tasks</h1>
		{
			tasks.map((task,index) => <div key={`task_${index}`} className={`task ${task.completed ? 'completed': null}`}>
			{/* <div> */}
			<span>
			{index+1}.
			&nbsp;{task.title}
			</span>
			{/* <p>{task.desc}</p> */}
			{/* </div> */}
			<button className="delete-button" onClick={() => deleteTask(task._id)}>Delete</button>
			<button className="completed-button" onClick={() => completeTask(task._id)}>Completed</button>
		</div>)
		}
	</center>
    </div>
  );
}

export default App;
