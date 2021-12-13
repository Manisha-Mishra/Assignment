const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

// set up express

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
app.use("/users", require("./routes/users"));



// set up mongoose


mongoose.connect('mongodb://127.0.0.1:27017/Assign',{
   useNewUrlParser:true,
   useUnifiedTopology:true,
},(err)=>{
    if(err){
        console.log(err.message);
    }else{
        console.log('successfully connected to database');
    }
})
app.listen(PORT, () => console.log(`The server has started on port: ${PORT}`));
// set up routes


// app.use("/todos", require("./routes/todo"));