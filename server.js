const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();


app.use(express.json())
app.use(cors())

//store the todo item
//let todos = [];
//connecting to mongoDB
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/todos')
.then( () => {
 console.log("connect to mongoDB");
 })
 .catch( (err) => {
   console.log(err);
})

//creating schema
const todoSchema = new mongoose.Schema({
  title:{
    required:true,
    type:String
 
  },
  description:{
    required:true,
    type:String
 
  }
})

//creating model
const todomodel = mongoose.model('Todo' , todoSchema)

//craete the new a todos
app.post('/todos', async (req, res) => {
    const {title, description} = req.body;
   
    try{
          const newTodo = new todomodel({title,description});
          await  newTodo.save();
          res.status(201).json(newTodo);
    }
    catch(err){
          console.log(err);
          res.status(501).json({message:err.message})
    }
})


//get the all item
app.get('/todos' , async (req, res) => {
   try {
      const todos = await todomodel.find()
      res.status(201).json(todos)
   } catch (err) {
    console.log(err);
    res.status(501).json({message:err.message})
   }
})

//updated the item
app.put('/todos/:id', async (req, res) => {
    try {
        const {title, description} = req.body;
        const updatedtodo = await todomodel.findByIdAndUpdate(
            id,
            {title,description},
            {new : true}
        )
        if(!updatedtodo){
            return res.status(404).json({message: "todo not found"})
        }
        res.json(updatedtodo) 
    } catch (err) {
        console.log(err);
        res.status(501).json({message:err.message})
    }
    
})

//delete the item
app.delete('/todos/:id', async (req, res) => {
    try {
        const id = req.params.id;
    await todomodel.findByIdAndDelete(id);
    res.status(204).end();
        
    } catch (error) {
        console.log(error);
        res.status(501).json({message:err.message})
    }
   
})


const PORT = 8000;
app.listen(process.env.PORT || 8000, () => {
    console.log("server is working in Port"+PORT );
})