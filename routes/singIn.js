const express = require('express');
const router = express.Router();
const {
  validuser, 
  newUser, 
  getDataUser, 
  getChangesCurrencys, 
  stripeIDs, 
  activateWallet} = require('../apiFirebase');
const { 
  getAccount, 
  createAccount, 
  createCustomer } = require('../apiStripe');
const { SingInPass, CreateEmailUser } = require('../apiAuth');

router.post('/autentificarGoogleUser',async  (req, res) => {
        const token = await req.body.token
        console.log(token)
        validuser(token)
        res.status(200).send("ok");  
});

router.post("/createEmailUser", async (req, res) => {
  const user = req.body;
  console.log(req.body)
  newUser(user.id, user.name, user.email, user.lastName, user.country, user.currency, user.phone).then(user => {
    res.status(200).send(user)
  }).catch(error => {
    console.log(error)
  })
})

router.post("/getUserEmailData", async (req, res) => {
  console.log(req.body.id)
  getDataUser(req.body.id).then(user =>{
    if(!user.stripeAccount && Object.keys(user.stripe.accountID).length > 1){
      getAccount(user.stripe.accountID).then(account => {
        if(account.requirements.past_due.length == 0){
          activateWallet(req.body.id).then((user) => {
            getChangesCurrencys().then(currencys => {
              const responseData = {
                user : user,
                currencys: currencys
              }
              res.status(200).send(responseData)
            }).catch(error => {res.status(404).send(error)})
          }).catch(error =>{res.status(404).send(error)})
        }else {
          getChangesCurrencys().then(currencys => {
            const responseData = {
              user : user,
              currencys: currencys
            }
            res.status(200).send(responseData)
          }).catch(error => {res.status(404).send(error)})
        }
      }).catch(error =>{res.status(404).send(error)})
    }else {
      getChangesCurrencys().then(currencys => {
        const responseData = {
          user : user,
          currencys: currencys
        }
        res.status(200).send(responseData)
      }).catch(error => {res.status(404).send(error)})
    }
  }).catch(error =>{res.status(404).send(error)})
})

router.post("/SingIn", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  SingInPass(email, password).then(user => {
    getDataUser(user.auth.config.apiKey).then(user => {
      getChangesCurrencys().then(currencys => {
        const responseData = {
          user : user,
          currencys: currencys
        }
        res.status(200).send(responseData)
      }).catch(error => {res.status(404).send(error)})
    })
  }).catch(error => {
    res.status(400).send(error)
  })
})

router.post("/SingIn2", async (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  SingInPass(email, password).then(user => {
    getDataUser(user.uid).then(user => {
      if(!user.stripeAccount && Object.keys(user.stripe.accountID).length < 1 && user.phoneVerifed && user.identityVerifed && user.addessVerified){
        createAccount(user).then(account => {
          createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID => {
            stripeIDs(user.id, account.id, customerID).then(user => {
              activateWallet(user.id).then(user => {
                getChangesCurrencys().then(currencys => {
                  const responseData = {
                    user : user,
                    currencys: currencys
                  }
                  res.status(200).send(responseData)
                })
              })
            })
          }).catch(error => {res.status(404).send(error)})
        }).catch(error => {res.status(404).send(error)})
      }else {
        getChangesCurrencys().then(currencys => {
          const responseData = {
            user : user,
            currencys: currencys
          }
          res.status(200).send(responseData)
        }).catch(error => {res.status(404).send(error)})
      }
    })
  }).catch(error => {
    res.status(400).send(error)
  })
})

router.post("/SingUp", async (req, res) => {
  const user = req.body;
  const email = req.body.email;
  const password = req.body.password;
  console.log(user)
  CreateEmailUser(email, password).then(User => {
    newUser(User.uid, user.name, email, user.lastName, user.country, user.currency, user.phone,
       user.password, user.day, user.month, user.year).then(user =>{
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
})


module.exports = router;