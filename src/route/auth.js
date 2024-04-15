import { Router } from 'express'
import { User } from '../db/schema/user.js'
import {hash}  from '../utils/hash.js'
import { compareSync } from 'bcrypt'


export const auth = Router()

auth.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })


    if (!user) {
        res.status(404).send({ "message": `user doesn't exist with this ${req.body.email} !!` })
    }
    else {
        if (compareSync(req.body.password, user.password)) {
            res.status(202).send("login successful")
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

auth.get('/forgotPassword', (req, res) => {
    res.send("forgot your password")
})

