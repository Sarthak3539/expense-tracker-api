import e, { Router } from 'express'
import { Wallet } from '../db/schema/wallet.js'

export const wallet = Router()


wallet.get('/get',async(req,res)=>{
   
    try{

        await Wallet.find({ email: req.header('email') })
        .limit(req.query._limit * 1)
        .skip((req.query._page - 1) * req.query._limit)
        // .sort({ createdAt: -1 })
        .then(async (wallets) => {
            const count = await Wallet.countDocuments({ email: req.header('email') });
            res.json({ wallets, count: Math.ceil(count / (req.query._limit)) });
        })
        .catch((e) => {
            res.status(404).send(e.message);
        });
    


    }
    catch(e){
        res.status(500).send(e.message)
    }
})

wallet.post('/add', async (req, res) => {
    try {
        const newWallet = new Wallet({ ...req.body, income_this_month: req.body.balance,expense_this_month:0 })
       
        
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
        if(typeof req.body.balance === 'number'){

            const wallet = await Wallet.findOne({ "_id": req.body._id })
            
            const NewUpdate = (req.body.balance > wallet.balance) == 0 ? ({ ...req.body,expense_this_month: wallet.expense_this_month + (req.body.balance - wallet.balance) }) : ({ ...req.body,income_this_month: wallet.income_this_month + (req.body.balance - wallet.balance) })
            const newWallet = await Wallet.findOneAndUpdate({ _id: req.body._id }, NewUpdate);
            
            res.json(newWallet)
        }
        else res.status(406).send({"message":e.message})
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
wallet.get("/total", async (req, res) => {
    const email  = req.header('email');
    if (!email) {
      return res.status(400).json({ error: "Email is required in request body" });
    }
  
    await Wallet.aggregate([
      { $match: { email } },
      {
        $group: {
          _id: "$email",
          total_income_this_month: { $sum: "$income_this_month" },
          total_expense_this_month: { $sum: "$expense_this_month" }
        }
      },
      {
        $project: {
          email: "$_id",
          total_income_this_month: 1,
          total_expense_this_month: 1,
          _id: 0
        }
      }
    ])
    .exec()
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    });
  });
  