const express = require('express');
const { compareFaces, compareDNI } = require('../apiAmazon');
const { getDataUser, setVerifiedTrue, stripeIDs, activateWallet, getUsers, getChangesCurrencys, confirmCell, getSMSCode, getTransaction, updateBalance, updateUserBalance2, generateID, searchDestination, editAddress } = require('../apiFirebase');
const { createAccount, createCustomer, withdraw2, addMoney } = require('../apiStripe');
const { verifyAddress } = require('../apiAddress');
const { createCode } = require('../apiTwilio');
const router = express.Router();


router.post("/verifyIdentity", async (req, res) => {
    const {image1, image2, id, ID} = req.body
    const image1Buffer = await Buffer.from(image1.split(",")[1], "base64");
    const image2Buffer = await Buffer.from(image2.split(",")[1], "base64");
    getDataUser(id).then(user => {
        compareFaces(image1Buffer, image2Buffer).then(data => {
            if(data.FaceMatches.length > 0){
                compareDNI(image1Buffer, ID).then(x => {
                    setVerifiedTrue(id, ID).then(user => {
                        res.status(200).send(user)
                    }).catch(error => {res.status(404).send(error)})
                }).catch(error =>{res.status(400).send(error)})
            }else{
                getDataUser(id).then(user=> {
                    res.status(200).send(user)
                }).catch(error =>{res.status(404).send(error)})
            }
        }).catch(error =>{res.status(404).send(error)})
    }).catch(error =>{res.status(404).send(error)})
})

router.post("/confirmAddress", async (req, res)=>{
    const id = req.body.id;
    const address = req.body.address;
    const country = req.body.country;
    console.log(address)
    console.log(country)
    getDataUser(id).then(user => {
        verifyAddress(address, user.country).then(data => {
            editAddress(id, address).then(user => {
                res.status(200).send(user)
            }).catch(error =>{res.status(404).send(error)})
        }).catch(error =>{res.status(404).send(error)})
    }).catch(error =>{res.status(404).send(error)})

})

router.post("/confirmPhone", async (req, res) => {
    const id = req.body.id;
    const phone = req.body.phone;
    createCode(phone, id).then(code => {
        res.status(200).send("ok")
    }).catch(error => {console.log("a"), res.status(404).send(error)})
})

router.post("/confirmPhoneCode", async (req, res)=> {
    const id = req.body.id;
    const code = req.body.code;
    getSMSCode(id, code).then(result => {
        confirmCell(id).then(user=> {
            res.status(200).send(user)
        }).catch(error => {
            console.log(error)
            res.status(404).send({error: "No user found"})
        })
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "bad code"})
    })
})

router.post("/activateWallet", async (req, res)=>{
    const id = req.body.id
    getDataUser(id).then(user=>{
        createAccount(user).then(account=>{
            console.log("1")
            createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID =>{
                console.log("2")
                stripeIDs(id, account.id, customerID).then(user=>{
                    activateWallet(req.body.id).then((user) => {
                        res.status(200).send(user)
                    }).catch(error =>{res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
            }).catch(error => {res.status(404).send(error)})
        }).catch(error => {res.status(404).send(error)})
    }).catch(error => {res.status(404).send(error)})
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

router.post("/getCurrencys", async (req, res) => {
    const id = req.body.id;
    getDataUser(id).then(user => {
        getChangesCurrencys().then(currencys => {
            const responseData = {
            currencys: currencys
            }
            res.status(200).send(responseData)
        })
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "No user found"})
    })
})

router.post("/cellConfirmed", async (req,res) => {
    console.log("test1")
    const id = req.body.id;
    confirmCell(id).then(user=> {
        console.log("test2")
        res.status(200).send(user)
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "No user found"})
    })
})

router.post("/confirmCodeWithdraw", async (req, res) => {
    const id = req.body.id;
    const code = req.body.code;
    getSMSCode(id, code).then(result => {
        getDataUser(id).then(user => {
            getTransaction(id).then(trans => {
                withdraw2(user.stripe.accountID, trans.stripeAmount, user.currency).then(transfer => {
                    updateBalance(-trans.amount).then(balance => {
                        updateUserBalance2(id, -trans.amount, trans.currency, transfer.id, trans.action, "", "success", trans.date).then(user => {
                            res.status(200).send(user)
                        }).catch(error => {console.log(error), res.status(404).send("error")})
                    }).catch(error => {console.log(error), res.status(404).send("error")})
                }).catch(error => {console.log(error), res.status(404).send("error")})
            }).catch(error => {console.log(error), res.status(404).send("error")})
        }).catch(error => {console.log(error), res.status(404).send("error")})
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "bad code"})
    })
})

router.post("/confirmChargeCode", async (req, res) => {
    console.log("testXX")
    const id = req.body.id;
    const code = await parseInt(req.body.code);
    getSMSCode(id, code).then(result => {
        console.log("test0")
        getDataUser(id).then(user => {
            console.log("test1")
            getTransaction(id).then(async (trans) => {
                console.log(trans)
                let userAmount = await parseInt(trans.amount) * 0.956
                userAmount = await userAmount.toFixed(2)
                console.log(userAmount)
                const stripeAmount = await trans.stripeAmount.toFixed(0)
                console.log("test2")
                addMoney(user.stripe.customerID, stripeAmount, user.currency).then(charge => {
                    console.log("test3??????")
                    updateUserBalance2(id, userAmount, trans.currency, charge.id, "charge", "", charge.status, trans.date).then(user => {
                        console.log("test4")
                        res.status(200).send(user)
                    }).catch(error => {console.log(error, "?=?=?=?=?=?"), res.status(404).send("error")})
                }).catch(error => {console.log(error, "==??=?=?="), res.status(404).send("error")})
            }).catch(error => {console.log(error), res.status(404).send("error")})
        }).catch(error => {console.log(error), res.status(404).send("error")})
    }).catch(error => {console.log(error), res.status(400).send("error")})
})

router.post("/confirmCodeTransfer", async (req, res) => {
    const id = req.body.id;
    const code = req.body.code;
    const transactionID = await generateID();
    getSMSCode(id, code).then(result => {
        getDataUser(id).then(user => {
            getTransaction(id).then(trans => {
                const email = user.email
                const amount = trans.amount * -1
                updateUserBalance2(id, amount, trans.currency, transactionID, "transfer", trans.userInteraction, "succeeded", trans.date).then(USER => {
                    searchDestination(trans.userInteraction).then(user => {
                        updateUserBalance2(user.id, trans.amount, trans.currency, transactionID, "recived", email, "succeeded", trans.date).then( data => {
                            res.status(200).send(USER)
                        })
                    })
                })
            })
        })
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "bad code"})
    })
})


module.exports = router;