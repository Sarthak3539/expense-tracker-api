import { Router } from 'express'
import  dotenv  from "dotenv";

import { User } from '../db/schema/user.js'
import { hash } from '../utils/hash.js'
import { compareSync } from 'bcrypt'
import { incrept,verifyToken} from '../utils/JWT.js'
import jwt from 'jsonwebtoken';
dotenv.config()



export const auth = Router()

auth.post('/login',async (req, res) => {
    // const token = req.header('jwt');
    // console.log(token)
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        res.status(404).send({ "message": `user doesn't exist with this ${req.body.email} !!` })
    }
    else {
        if (compareSync(req.body.password, user.password)) {
            const jwt =await incrept(user);
            res.json(
                { email: user.email, name: user.name,jwt:jwt}
            )
        }
        else {
            res.status(406).send("wrong password")
        }
    }

})



auth.get('/register', (req, res) => {
    res.send("register page")
})

auth.post('/register', async (req, res) => {
    try {
        console.log(req.body)
        req.body.password = await hash(req.body.password);
        const user = new User(req.body)
        await user.save()
            .then(() => {
                res.send(req.body)
            })
            .catch((e) => {
                res.status(406).send({ "message": e.message });
            });

    }
    catch (e) {
        res.status(406).send(e.message);
    }
})

auth.post('/autologin',(req,res)=>{
    console.log(req.body)
    try{
    if(req.body.jwt==null){
        res.status(406).send("jwt is null")
    }
    const data=jwt.verify(req.body.jwt, process.env.JWT_TOKEN);
    console.log(data)
    res.send(data)
  }
  catch(e){
    console.log(e.message)
res.status(406).send(e.message)
  }
})

auth.get('/forgotPassword', (req, res) => {
    res.send("forgot your password")
})


