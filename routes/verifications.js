const express = require('express');
const { compareFaces } = require('../apiAmazon');
const { getDataUser, setVerifiedTrue, stripeIDs, activateWallet } = require('../apiFirebase');
const { createAccount, createCustomer } = require('../apiStripe');
const router = express.Router();


router.post("/verifyIdentity", async (req, res) => {
    const {image1, image2, id} = req.body
    const image1Buffer = await Buffer.from(image1.split(",")[1], "base64");
    const image2Buffer = await Buffer.from(image2.split(",")[1], "base64");
    compareFaces(image1Buffer, image2Buffer).then(data => {
        if(data.FaceMatches.length > 0){
            setVerifiedTrue(id).then(user => {
                res.status(200).send(user)
            }).catch(error => {res.status(404).send(error)})
        }else{
            getDataUser(id).then(user=> {
                res.status(200).send(user)
            }).catch(error =>{res.status(404).send(error)})
        }
    })
})

router.post("/activateWallet", async (req, res)=>{
    const id = req.body.id
    getDataUser(id).then(user=>{
        createAccount(user).then(account=>{
            createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID =>{
                stripeIDs(id, account.id, customerID).then(user=>{
                    activateWallet(req.body.id).then((user) => {
                        res.status(200).send(user)
                    }).catch(error =>{res.status(400).send(error)})
                }).catch(error => {res.status(400).send(error)})
            }).catch(error => {res.status(400).send(error)})
        }).catch(error => {res.status(400).send(error)})
    }).catch(error => {res.status(400).send(error)})
})

/*router.post("/activateWallet", async(req,res)=>{
    const id = req.body.id
    getDataUser(id).then(user=>{
        if(user.identityVerifed){
            if(user.stripe.accountID.length < 1 && user.stripe.customerID.length < 1){
                createAccount(user).then(account=>{
                    createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID =>{
                        stripeIDs(id, account.id, customerID).then(user=>{
                            res.status(200).send(user)
                        }).catch(error => {res.status(404).send(error)})
                    }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
            }else if(user.stripe.accountID <1){
                createAccount(user).then(account=>{
                    stripeIDs(id, account.id, user.stripe.customerID).then(user=>{
                        res.status(200).send(user)
                    }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
            }else if(user.stripe.customerID < 1){
                createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID=>{
                    stripeIDs(id, user.stripe.accountID, customerID).then(user=>{
                        res.status(200).send(user)
                    }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
            }else if(user.banckAccounts.length < 1){
                const error = {
                    error: "Add a banck account"
                }
                res.status(404).send(JSON.stringify(error))
            }
        }else{
            const error = {
                error: "Verifed your Identity"
            }
            res.status(404).send(JSON.stringify(error))
        }
    }).catch(error => {res.status(404).send(error)})
})*/



module.exports = router;