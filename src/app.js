require('dotenv').config()
const express = require("express");
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
const register  = require("module");
const app = express();
const bcrypt = require('bcryptjs');
require('./db/conn');

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
// console.log(template_path);
const partials_path = path.join(__dirname, "../templates/partials"); 
const Register = require('./model/register');
const exp = require("constants");
const { log } = require("console");

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static(static_path));   
app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);



// console.log(process.env.SECRET_KEY);
// define routs for  an application 

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});


app.post("/register", async (req, res) => 
    {
    try {
       
        const password = req.body.password;
            const registerEmp = new Register({
                name: req.body.name,
                email: req.body.email,
                password: password,
            });

            // midddlewere for auth token 
            // console.log(registerEmp);
            const  token =  await registerEmp.generateAuthToken();            
            // console.log(token);
            
            const registered = await registerEmp.save();
            res.status(201).redirect("/login");
        } 
     catch (error) { 
        res.status(400).send(error);
    }
});


app.post("/login", async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        const userEmail = await Register.findOne({ email: email });
        const passMatch = await bcrypt.compare(password, userEmail.password)
        const token = await userEmail.generateAuthToken();
        // console.log(token);
        


        if (passMatch) {
            res.status(200).redirect("/"); 
        } else {
            res.status(401).send("Invalid Login Details");
        }
    } catch (error) {
        res.status(500).send(error);
    }
});





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
