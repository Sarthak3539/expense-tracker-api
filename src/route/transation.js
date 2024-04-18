import { Router } from 'express'
import { Transaction } from '../db/schema/transaction.js'
import { Wallet } from '../db/schema/wallet.js'



export const transaction = Router()



transaction.post('/get', async (req, res) => {
    try {

        await Transaction.find({ email: req.body.email })
            // We multiply the "limit" variables by one just to make sure we pass a number and not a string
            .limit(req.query._limit * 1)
            // I don't think i need to explain the math here
            .skip((req.query._page - 1) * req.query._limit)

            .then(async (transactions) => {
                const count = await Transaction.countDocuments({ email: req.body.email });
                res.json({ transactions, count: Math.ceil(count / req.query._limit) })
            })
            .catch((e) => {
                res.status(404).send(e.message)
            })


    }
    catch (e) {
        res.status(500).send(e.message)
    }
})

transaction.get('/get/:id', async (req, res) => {
    console.log('hello')
    await Transaction.find({ "_id": req.params.id })
        .then((s) => {
            res.json(s)
        })
        .catch((e) => {
            res.send(e.message)
        })

})
transaction.post('/add', async (req, res) => {
    console.log(req.body)
    try {
        const newTransaction = new Transaction(req.body)

        await newTransaction.save()
            .then(async () => {
                try {
                    const wallet = await Wallet.findOne({ "_id": req.body.wallet_id })

                    const new_wallet = req.body.mode == 0 ? ({ expense_this_month: wallet.expense_this_month + req.body.expense, balance: wallet.balance - req.body.expense }) : ({ income_this_month: wallet.income_this_month + req.body.expense, balance: wallet.balance + req.body.expense })
                    const update_wallet = await Wallet.findOneAndUpdate({ "_id": wallet._id }, new_wallet);
                    res.json(update_wallet)
                }
                catch (e) {
                    res.status(502).send(e.message)
                }
            })
            .catch((e) => {
                res.status(402).send(e.message)
            })
    } catch (e) {
        res.status(502).send(e.message)
    }
})




transaction.post('/update', async (req, res) => {

    try {
       if(!(req.body.expense=== 'number')) res.status(400).send(e.message)
        const transaction = await Transaction.findOne({ "_id": req.body._id })
        const new_wallet_id = req.body.wallet_id
        const old_wallet_id = transaction.wallet_id
        console.log({ new_wallet_id, old_wallet_id })

        await Transaction.findOneAndUpdate({ _id: transaction._id }, req.body)
            .then(async () => {

                const oldWallet = await Wallet.findOne({ "_id": old_wallet_id })
                // req.body -> new transaction
                // transactoin -> old transaction

                const old_update_wallet = {
                    balance: oldWallet.balance + (transaction.mode == 0 ? transaction.expense : (-1 * transaction.expense)),
                    income_this_month: oldWallet.income_this_month + (transaction.mode == 1 ? -1 * transaction.expense : 0),
                    expense_this_month: oldWallet.expense_this_month + (transaction.mode == 0 ? -1 * transaction.expense : 0)
                }
                await Wallet.findOneAndUpdate({ _id: oldWallet }, old_update_wallet)
                    .then(async () => {
                        const newWallet = await Wallet.findOne({ "_id": new_wallet_id })
                        const new_update_wallet = {
                            balance: newWallet.balance + (req.body.mode == 0 ? (-1 * req.body.expense) : req.body.expense),
                            income_this_month: newWallet.income_this_month + (req.body.mode == 1 ? req.body.expense : 0),
                            expense_this_month: newWallet.expense_this_month + (req.body.mode == 0 ? req.body.expense : 0)
                        }
                        
                        await Wallet.findOneAndUpdate({ _id: new_wallet_id }, new_update_wallet)
                            .catch((e) => {
                                res.status(400).send(e.message)
                            })
                            .then(() => {
                                res.send("sucessful")
                            })

                    })
                    .catch((e) => {
                        res.status(400).send(e.message)
                    })

                // const old_update_wallet = {
                //     balance: wallet.balance + (transaction.mode == 0 ? transaction.expense : (-1 * transaction.expense)) + (req.body.mode == 0 ? (-1 * req.body.expense) : req.body.expense),
                //     income_this_month: wallet.income_this_month + (transaction.mode == 1 ? -1 * transaction.expense : 0) + (req.body.mode == 1 ? req.body.expense : 0),
                //     expense_this_month: wallet.expense_this_month + (transaction.mode == 0 ? -1 * transaction.expense : 0) + (req.body.mode == 0 ? req.body.expense : 0)
                // }

            })
            .catch((e) => {
                res.status(400).send(e.message)
            })
    }

    catch (e) {
        res.status(500).send(e.message)
    }
})

transaction.post('/delete', async (req, res) => {
    try {
        await Transaction.findOneAndDelete({ "_id": req.body._id })
            .then(async (s) => {
                console.log(s)
                if (s != null) {

                    const wallet = await Wallet.findOne({ _id: s.wallet_id })
                    const new_wallet = {
                        balance: wallet.balance + (s.mode == 0 ? (s.expense) : (-1 * s.expense)),
                        income_this_month: wallet.income_this_month + (s.mode == 1 ? (-1 * s.expense) : 0),
                        expense_this_month: wallet.expense_this_month + (s.mode == 0 ? (-1 * s.expense) : 0)
                    }

                    await Wallet.findOneAndUpdate({ _id: s.wallet_id }, new_wallet)
                        .then(() => {
                            res.json(s)
                        })
                }
                else {
                    res.status(404).send("transaction doesn't exist")
                }

            })
            .catch((e) => {
                res.status(400).send(e.message)
            })
    }
    catch (e) {
        res.status(500).send(e.message)
    }
})


transaction.post('/filter', async (req, res) => {
    console.log(req.body);

    try {

        await Transaction.find({ ...req.body })
            // We multiply the "limit" variables by one just to make sure we pass a number and not a string
            .limit(req.query._limit * 1)
            // I don't think i need to explain the math here
            .skip((req.query._page - 1) * req.query._limit)

            .then(async (transactions) => {
                const count = await Transaction.countDocuments({ ...req.body });
                console.log(count);
                res.json({ transactions, count: Math.ceil(count / req.query._limit) })
            })
            .catch((e) => {
                res.status(404).send(e.message)
            })


    }
    catch (e) {
        res.status(500).send(e.message)
    }
})