const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
 
const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens:[{
        token:{
            type: String,
            required: true,
        }
    }]
   
});


// crate a token for register

registerSchema.methods.generateAuthToken = async function () {
    try {
        // console.log(this._id,this.name)
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
        // console.log(token);
        
        this.tokens = this.tokens.concat({token:token})
        // console.log(this.tokens);
        
         await this.save();
        // console.log(token);
        return token;
        
    } catch (error) {
        res.send("the error part" + error);
       console.log("the error part" + error);
    }
}






// create middleware function to  use userpassword hash and use in code
// in fisrt use schema and pre  method and that method stored a  db methods 
// and in this use ismodified method to if user update a password then it work other wise it send data in next
// for get user passoword use this.password method and 
// in this next method  use after user password is hash  then database stored 

registerSchema.pre("save", async function(next){
    
    if(this.isModified("password")){
        // console.log(`this is user old password ${this.password}`);
            this.password = await bcrypt.hash(this.password ,10);

    //  console.log(`this is user hash password ${this.password}`);

        }
    next();
})

const Register = mongoose.model("Register", registerSchema);
module.exports = Register;
