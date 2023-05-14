const express = require('express');
const { getDataUser, addCard, setBanckAccount, activateWallet, updateBalance, updateUserBalance, searchDestination, generateID, getChangesCurrencys, updateUserBalance2 } = require('../apiFirebase');
const { createCard, createBanckAccount, addMoney, getBalance, withdraw, withdraw2 } = require('../apiStripe');
const router = express.Router();

router.post("/createCard", async (req,res) => {
    const card = req.body.card;
    const User = req.body.user
    getDataUser(User.id).then(user => {
        createCard(card, user.stripe.customerID).then(card => {
            addCard(card, User.id).then(user => {
                res.status(200).send(user)
            }).catch(error => {console.log(error)})
        }).catch(error => {console.log(error)})
    }).catch(error => {console.log(error)})
})

router.post("/addBanckAccount", async (req,res) => {
    const id = req.body.id
    await getDataUser(id).then(user=>{
        if(user.stripe.accountID.length>1){
            createBanckAccount(user.stripe.accountID, user.name, user.lastName, user.country).then(account => {
                if(account.requirements.past_due.length == 0){
                    activateWallet(id).then((user) => {
                        setBanckAccount(id, account.external_accounts.data[0].id).then(user => {
                            res.status(200).send(user)
                        }).catch(error =>{res.status(404).send(error)})
                    }).catch(error =>{res.status(404).send(error)})
                }else {
                    setBanckAccount(id, account.id).then(user => {
                        res.status(200).send(user)
                    }).catch(error =>{res.status(404).send(error)})
                }
            }).catch(error =>{res.status(404).send(error)})
        }else{
            const error = {
                error: "Complete your profile info"
            }
            res.status(404).send(JSON.stringify(error))
        }
    }).catch(error =>{res.status(404).send(error)})
})

router.post("/chargeMoney", async (req, res) => {
    const id = req.body.id;
    const amount = req.body.amount
    const userAmount = parseFloat(req.body.amount) * 0.956
    const date = req.body.date;
    const localAmount = parseFloat(req.body.localAmount);
    const stripeAmount = localAmount * 100
    const currency = req.body.currency
    getDataUser(id).then(user=> {
        addMoney(user.stripe.customerID, stripeAmount, user.currency).then(charge=>{
            updateBalance(localAmount * 0.956).then(user => {
                updateUserBalance2(id, userAmount, currency, charge.id, "charge", "", charge.status, date).then(user=>{
                    res.status(200).send(user)
                })
            })
        })
    })
})

router.post("/withdraw2", async (req, res) => {
    const id = req.body.id;
    const amount = parseFloat(req.body.amount);
    const date = req.body.date;
    const localAmount = parseFloat(req.body.localAmount);
    const stripeAmount = localAmount * 100;
    const currency = req.body.currency
    getDataUser(id).then(async (user) => {
        const index = await user.amount.findIndex(element => element.currency === currency)
        console.log(index)
        if(amount <= user.amount[index].amount){
            withdraw2(user.stripe.accountID, stripeAmount, user.currency).then(transfer => {
                updateBalance(-amount).then(balance => {
                    updateUserBalance2(id, -amount, currency, transfer.id, "withdraw", "", "succeeded", date).then(user => {
                        res.status(200).send(user)
                    })
                })
            })
        }else {
            res.status(400).send({error: "Not suficient founds"})
        }
    })
})

router.post("/withdraw", async (req, res) => {
    const id = req.body.id;
    const amount = req.body.amount
    const stripeAmount = amount * 100;
    const date = req.body.date;
    getDataUser(id).then(user =>{
        if(user.amount.amount >= amount){
            withdraw(user.stripe.accountID, stripeAmount).then(transfer => {
                updateBalance(-amount).then(balance => {
                    updateUserBalance(id, -amount, transfer.id, "withdraw", "", "succeeded", date).then(user =>{
                        res.status(200).send(user)
                    })
                })
            })
        }else{
            res.status(400).send({error: "Not suficient founds"})
        }
    })
})

router.post("/userTransfer2", async (req, res) => {
    const id = req.body.id;
    const amount = parseFloat(req.body.amount);
    const stripeAmount = amount * 100
    const destination = req.body.destination;
    const date = req.body.date;
    const currency = req.body.currency;
    getDataUser(id).then(async (user) => {
        const index = await user.amount.findIndex(element => element.currency === currency)
        if(index === -1){
            res.status(400).send({error: "Not suficient founds"})
        }
        if(amount <= user.amount[index].amount && index != -1){
            const userEmail = user.email
            const transactionID = await generateID();
            searchDestination(destination).then(user => {
                updateUserBalance2(user.id, amount, currency, transactionID, "recived", userEmail, "succeeded", date).then(user => {
                    updateUserBalance2(id, -amount, currency, transactionID, "transfer", destination, "succeeded", date).then(user => {
                        res.status(200).send(user)
                    })
                })
            }).catch(error =>{
                if(error == 2){
                    res.status(402).send({error: "Not"})
                }else{
                    res.status(401).send({error: "Not"})
                }
            })
        }else{
            res.status(400).send({error: "Not suficient founds"})
        }
    })
})

router.post("/userTranfer", async (req, res)=> {
   /* const id = req.body.id;
    const amount = req.body.amount;
    const stripeAmount = amount * 100
    const destination = req.body.destination;
    const date = req.body.date;
    getDataUser(id).then(async(user)=>{
        if(user.amount.amount >= amount){
            const userEmail = user.email;
            const transactionID = await generateID();
            searchDestination(destination).then(user => {
                updateUserBalance(user.id, amount, transactionID, "recived", userEmail, "succeeded", date).then(user=>{
                    updateUserBalance(id, -amount, transactionID, "transfer", destination, "succeeded", date).then(user=>{
                        res.status(200).send(user)
                    })
                })
            })
            .catch(error =>{
                if(error == 2){
                    res.status(402).send({error: "Not"})
                }else{
                    res.status(401).send({error: "Not"})
                }
            })
        }else{
            res.status(400).send({error: "Not suficient founds"})
        }
    })*/

})


module.exports = router;