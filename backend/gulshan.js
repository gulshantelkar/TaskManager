const express = require('express');
const mongoose = require('mongoose');
const mongoUrl = 'mongodb://localhost:27017/gulshan';
const cors = require('cors');

mongoose.connect(mongoUrl, err => console.log(err?.message || 'Connected to DB'));

const TaskSchema = new mongoose.Schema({
	title:  {type:String,required:true},
	desc: {type:String,required:true},
	date:  {type:Date,required:true},
	completed: {
		type: Boolean,
		default: false,
	},
});

var Task = mongoose.model('Task', TaskSchema );

const app = express();
app.use(express.json());
app.use(cors())
const server = app.listen(3001, () => {});

app.get('/', async (req, res) => {
	try{
		const tasks = await Task.find();
		res.status(200).json(tasks);
	}catch(err){
		res.status(400).json(err);
	}
});

app.post('/',async (req,res) => {
	try{
		const {title, desc,date} = req.body;
		const task = new Task({ title: title, desc: desc,date: date });
		const createdTask = await task.save();

		res.status(200).json(createdTask);
	}catch(err){
		console.log(err);
		res.status(400).json(err);
	}
});

app.post('/complete',async (req,res) => {
	try{
		const {id} = req.body;
		await Task.updateOne({_id:id},{completed: true});
		const task = await Task.findOne({_id:id});

		res.status(200).json(task);
	}catch(err){
		res.status(400).json(err);
	}
});

app.delete('/:id',async (req,res) => {
	try{
		const id = req.params.id;
		const task = await Task.findOne({_id:id});
		await task.delete();
		res.status(200).json('Deleted!');
	}catch(err){
		console.log(err);
		res.status(400).json(err);
	}
});