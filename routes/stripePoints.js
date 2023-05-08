const express = require('express');
const { getDataUser, addCard, setBanckAccount, activateWallet, updateBalance, updateUserBalance, searchDestination } = require('../apiFirebase');
const { createCard, createBanckAccount, addMoney, getBalance, withdraw } = require('../apiStripe');
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
    const amount = req.body.amount * 100
    const userAmount = req.body.amount * 0.956
    getDataUser(id).then(user=> {
        addMoney(user.stripe.customerID, amount).then(charge=>{
            console.log(charge)
            updateBalance(userAmount).then(user => {
                updateUserBalance(id, userAmount).then(user=>{
                    res.status(200).send(user)
                })
            })
        })
    })
})

router.post("/withdraw", async (req, res) => {
    const id = req.body.id;
    const amount = req.body.amount
    const stripeAmount = amount * 100
    getDataUser(id).then(user =>{
        if(user.amount.amount >= amount){
            withdraw(user.stripe.accountID, stripeAmount).then(transfer => {
                updateBalance(-amount).then(balance => {
                    updateUserBalance(id, -amount).then(user =>{
                        res.status(200).send(user)
                    })
                })
            })
        }else{
            res.status(400).send({error: "Not suficient founds"})
        }
    })
})

router.post("/userTranfer", async (req, res)=> {
    const id = req.body.id;
    const amount = req.body.amount;
    const stripeAmount = amount * 100
    const destination = req.body.destination
    getDataUser(id).then(user=>{
        if(user.amount.amount >= amount){
            searchDestination(destination).then(user => {
                updateUserBalance(user.id, amount).then(user=>{
                    updateUserBalance(id, -amount).then(user=>{
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


module.exports = router;