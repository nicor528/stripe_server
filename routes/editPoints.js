const express = require('express');
const { editAddress, editUserData, stripeIDs, getDataUser } = require('../apiFirebase');
const { editAccountAddress, createAccount, createCustomer } = require('../apiStripe');
const router = express.Router();


router.post("/editAddress", async (req, res)=> {
    console.log("test1")
    const address = await req.body.address;
    const id = await req.body.id;
    editAddress(id, address).then(user =>{
        if(user.stripe.accountID.length>1){
            console.log("test2")
            editAccountAddress(user.stripe.accountID, user).then(account => {
                if(account.requirements.past_due.length == 0){
                    activateWallet(id).then((user) => {
                        res.status(200).send(user)
                    }).catch(error =>{res.status(402).send(error)})
                }else {
                    res.status(200).send(user)
                }
            }).catch(error =>{res.status(400).send(error)})
        }else {
            createAccount(user).then(account=>{
                console.log("account")
                createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID =>{
                    console.log("customer")
                    stripeIDs(id, account.id, customerID).then(user=>{
                        console.log("stripes IDs")
                        res.status(200).send(user)
                    }).catch(error => {res.status(406).send(error)})
                }).catch(error => {res.status(405).send(error)})
            }).catch(error => {res.status(403).send(error)})
        }
    }).catch(error => {console.log(error); res.status(401).send(error)})
})

router.post("/editProfileInfo", async (req, res) => {
    const id = req.body.id;
    const data = req.body.data;
    editUserData(id, data).then(user => {
        getDataUser(id).then(user => {
            res.status(200).send(user)
        }).catch(error => {res.status(404).send(error)})
    }).catch(error => {res.status(404).send(error)})
})

/*router.post("/editProfileInfo", async (req, res) => {
    const id = req.body.id
    const data = req.body.data
    editUserData(id, data).then(user => {
        if(user.stripe.accountID.length < 1 && user.stripe.customerID.length < 1){
            createAccount(user).then(account=>{
                createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID =>{
                    stripeIDs(id, account.id, customerID).then(user=>{
                        res.status(200).send(user)
                    }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
            }).catch(error => {res.status(404).send(error)})
        }else {
            
        }
    }).catch(error =>{res.status(404).send(error)})
})*/




module.exports = router;