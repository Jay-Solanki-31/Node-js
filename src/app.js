require('dotenv').config()
const express = require("express");
const path = require('path');
const hbs = require('hbs');
const jwt = require('jsonwebtoken');
const register  = require("module");
const app = express();
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
require('./db/conn');

const port = process.env.PORT || 3000;
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
// console.log(template_path);
const partials_path = path.join(__dirname, "../templates/partials"); 
const Register = require('./model/register');
const auth = require("./middleware/auth");
const exp = require("constants");


app.use(express.json());
app.use(cookieParser());
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

app.get("/secret", auth , (req, res) => {
    // console.log(`this is cookie value form  ${req.cookies.jwt}`);
    res.render("secret");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login",(req, res) => {
    res.render("login");
});


app.get("/logout",auth, async (req, res) => {
    try {
        console.log(req.userData);

        // for logout one user 
        // req.userData.tokens = req.userData.tokens.filter((currElement) => {
        //     return currElement.token !== req.token; 
        // });
        // res.clearCookie("jwt");

        // to delete all user token from database
        // res.userData.tokens = [];


        console.log("logout sucessfully");
        await req.userData.save();
        res.render('login')
    } catch (error) {
        res.status(401).send(error)
    }
});



app.get("*",(req,res)=>{
    res.render('404');
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
            res.cookie("jwt", token, {
                expires: new Date(Date.now() + 60000), 
                httpOnly: true, 
                secure: false, 
            });

            console.log(cookie);
            
            
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
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000), 
            httpOnly: true, 
            secure: false, 
        });
        
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
