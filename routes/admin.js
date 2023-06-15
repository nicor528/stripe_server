const express = require('express');
const { compareFaces, compareDNI } = require('../apiAmazon');
const { 
    validuser, 
    newUser, 
    getDataUser, 
    setVerifiedTrue, 
    stripeIDs, 
    activateWallet, 
    getUsers, 
    getChangesCurrencys, 
    confirmCell, 
    getSMSCode, 
    getTransaction, 
    updateBalance, 
    updateUserBalance2, 
    generateID, 
    searchDestination, 
    editAddress } = require('../apiFirebase');
   
const { 
    createAccount, 
    createCustomer, 
    withdraw2, 
    addMoney } = require('../apiStripe');
const { verifyAddress } = require('../apiAddress');
const { createCode } = require('../apiTwilio');
const { SingInPass, CreateEmailUser } = require('../apiAuth');
const router = express.Router();

router.post('/createUser', async (req, res) => {
  const user = req.body;
  const email = req.body.email;
  const password = req.body.password;
  console.log(user)
  CreateEmailUser(email, password).then(User => {
    newUser(User.uid, user.name, email, user.lastName, user.country, user.currency, user.phone,
       password, user.day, user.month, user.year, user.role, user.activate, user.blocked).then(user =>{
      res.status(200).send(user)
    }).catch(error => {
      res.status(400).send(error)
    })
  }).catch(error => {
    if(error.code === "auth/email-already-in-use"){
      res.status(400).send(error)
    }else{
      res.status(401).send(error)
    }
  })
});

router.post('/getUsers', async (req, res) => {
    getUsers().then(data => {
      res.status(200).send(data);
      console.log("Ok!");
    }).catch(error => {
      res.status(400).send(error)
    });
});

router.post('/getUserData', async (req, res) => {
  const id = req.body.id;
    getDataUser(id).then(user => {
        // getChangesCurrencys().then(currencys => {
        //     const responseData = {
        //     currencys: currencys
        //     }
            res.status(200).send(user)
        // })
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "No user found"})
    })
});


module.exports = router;