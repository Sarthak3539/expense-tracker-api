import { Router } from 'express'
import { Wallet } from '../db/schema/wallet.js'

export const wallet = Router()


wallet.get('/get',async(req,res)=>{
   
    try{

        await Wallet.find({})
        // We multiply the "limit" variables by one just to make sure we pass a number and not a string
        .limit(req.query._limit * 1)
        // I don't think i need to explain the math here
        .skip((req.query._page - 1) * req.query._limit)
        // We sort the data by the date of their creation in descending order (user 1 instead of -1 to get ascending order)
        .sort({ createdAt: -1 })
        
        .then(async(wallets)=>{
            const count = await Wallet.countDocuments();
            res.json({wallets,count:Math.ceil(count / req.query._limit)})
        })
        .catch((e)=>{
            res.status(404).send(e.message)
        })


    }
    catch(e){
        res.status(500).send(e.message)
    }
})

wallet.post('/add', async (req, res) => {
    try {

        const newWallet = new Wallet({ ...req.body, income_this_month: req.body.balance })
        await newWallet.save()
            .then(() => {
                res.json(newWallet)
            })
            .catch((e) => {
                res.status(406).send({ "message": e.message });
            });

    }
    catch (e) {
        res.status(402).send("schema is wrong")
    }

})

wallet.post('/update', async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ "_id": req.body._id })
        
        const NewUpdate = (req.body.balance > wallet.balance) == 0 ? ({ ...req.body,expense_this_month: wallet.expense_this_month + (req.body.balance - wallet.balance) }) : ({ ...req.body,income_this_month: wallet.income_this_month + (req.body.balance - wallet.balance) })
        const newWallet = await Wallet.findOneAndUpdate({ _id: req.body._id }, NewUpdate);

        res.json(newWallet)
    }
    catch (e) {

        res.status(406).send({ "message": e.message });
    }
})

wallet.post('/delete', async(req, res) => {
    try{
        await Wallet.findOneAndDelete({ "_id": req.body._id })
        .then((s)=>{
            if(s!=null){

                res.send("deleted sucessfuly")
            }
            else res.status(404).send("don't exist wallet")
        })
        .catch((e)=>{
            res.send(e.message)
        })
    }
    catch(e){
        res.send(e.message)
    }
})
