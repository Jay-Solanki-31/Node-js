const jwt = require('jsonwebtoken');
const Register = require('../model/register');


const auth =  async (req , res , next) => {

    try {

        const token  = req.cookies.jwt;
        const userVerify = jwt.verify(token , process.env.SECRET_KEY);
        // console.log(userVerify);

        const userData = await Register.findOne({_id:userVerify._id});
        // console.log(userData);

        req.token = token
        req.userData = userData
        
        next();
        
    } catch (error) {
        res.status(401).send(console.error());
    }
}

module.exports = auth;