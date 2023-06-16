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
    editAddress,
    editUserData } = require('../apiFirebase');
   
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
            res.status(200).send(user)
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "No user found"})
    })
});

router.post('/editUserAddress', async (req, res) => {
    const id = req.body.id;
    const address = req.body;
    console.log(id);
    console.log(address);
    editAddress(id, address).then(data => {
            res.status(200).send(data)
    }).catch(error => {
        console.log(error)
        res.status(400).send({error: "No user found"})
    })
});

router.post('/editUserData', async (req, res) => {
  const id = req.body.id;
  const user = req.body;
  console.log(id);
  console.log(user);
  editUserData(id, user).then(data => {
          res.status(200).send(data)
  }).catch(error => {
      console.log(error)
      res.status(400).send({error: "No user found"})
  })
});

router.post('/deleteUser', async (req, res) => {
  const id = req.body.id;
  
  console.log(id);
  // editAddress(id, address).then(data => {
  //         res.status(200).send(data)
  // }).catch(error => {
  //     console.log(error)
  //     res.status(400).send({error: "No user found"})
  // })
});


router.post('/resetPassword', async (req, res) => {
  const id = req.body.id;
  const password = req.body.password;
  console.log(id);
  resetPassword(id, password).then(data => {
          res.status(200).send(data)
  }).catch(error => {
      console.log(error)
      res.status(400).send({error: "No user found"})
  })
  
});

router.post('/updateActivate', async (req, res) => {
  const id = req.body.id;
  const isActivate = req.body.isActivate;
  console.log(id);
  
});

router.post('/updateBlock', async (req, res) => {
  const id = req.body.id;
  const email = req.body.email;
  const name = req.body.name;
  const phone = req.body.phone;
  const isBlocked = req.body.isBlocked;
  console.log(id);
  
});

router.post('/getTransData', async (req, res) => {


});

router.post('/reportBlock', async (req, res) => {

  
});

router.post('/refund', async (req, res) => {

  
});


module.exports = router;