const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/mearproj")
.then(()=>{console.log('connection is sucess...')})
.catch((e)=>{console.log(e)})