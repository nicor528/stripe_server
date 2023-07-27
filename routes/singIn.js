const express = require('express');
const router = express.Router();
const { newUser, getDataUser, getChangesCurrencys, stripeIDs, activateWallet, getDashUserData, completeGmailUser} = require('../apiFirebase');
const { getAccount, createAccount, createCustomer } = require('../apiStripe');
const { SingInPass, CreateEmailUser, resetPass, validuserG } = require('../apiAuth');

router.post('/autentificarGoogleUser',async  (req, res) => {
  const token = await req.body.token
  console.log(token)
  validuserG(token).then(user => {
    newUser(user.user.uid, "", user.user.reloadUserInfo.email, "", "", "", "", "", "", "", "", true).then(user => {
      res.status(200).send(user);  
    }).catch(error => {res.status(404).send(error)})
  }).catch(error => {res.status(404).send(error)})
});

router.post("/singInGoogleUser", async (req, res) => {
  const token = req.body.token;
  validuserG(token).then(user => {
    getDataUser(user.user.uid).then(user => {
      if(user.isBlocked){
        res.status(407).send({user: "blocked"})
      }else{
        if(!user.stripeAccount && Object.keys(user.stripe.accountID).length < 1 && user.phoneVerified && user.identityVerified && user.addressVerified){
          console.log("test1")
          createAccount(user).then(account => {
            createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID => {
              stripeIDs(user.id, account.id, customerID).then(user => {
                activateWallet(user.id).then(user => {
                  getChangesCurrencys().then(currencys => {
                    getDashUserData(user).then(dashData => {
                      const responseData = {
                        user : {...user, dashData},
                        currencys: currencys,
                        dashData: dashData
                      }
                      res.status(200).send(responseData)
                    }).catch(error => {res.status(404).send(error)})
                  }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
              }).catch(error => {res.status(404).send(error)})
            }).catch(error => {res.status(404).send(error)})
          }).catch(error => {res.status(404).send(error)})
        }else {
          console.log("test3")
          getChangesCurrencys().then(currencys => {
            getDataUser(user.id).then(user => {
              const responseData = {
                user : user,
                currencys: currencys
              }
              //console.log(responseData)
              res.status(200).send(responseData)
            }).catch(error => {res.status(404).send(error)})
          }).catch(error => {res.status(404).send(error)})
        }
      }
    })
  })
})

router.post("/completeGmailUser", async (req, res) => {
  const id = req.body.id;
  const user = req.body.user;
  completeGmailUser(id, user).then(user => {
    getDataUser(id).then(user => {
      res.status(200).send(user)
    }).catch(error => {res.status(404).send(error)})
  }).catch(error => {res.status(404).send(error)})
})

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
      if(user.isBlocked){
        res.status(407).send({user: "blocked"})
      }else{
        console.log(Object.keys(user.stripe.accountID).length)
        console.log(!user.stripeAccount)
        console.log(user.phoneVerified)
        console.log(user.identityVerified)
        console.log(user.addressVerified)
        if(!user.stripeAccount && Object.keys(user.stripe.accountID).length < 1 && user.phoneVerified && user.identityVerified && user.addressVerified){
          console.log("test1")
          createAccount(user).then(account => {
            createCustomer(user.name, user.lastName, user.email, user.phone).then(customerID => {
              stripeIDs(user.id, account.id, customerID).then(user => {
                activateWallet(user.id).then(user => {
                  getChangesCurrencys().then(currencys => {
                    getDashUserData(user).then(dashData => {
                      const responseData = {
                        user : {...user, dashData},
                        currencys: currencys,
                        dashData: dashData
                      }
                      res.status(200).send(responseData)
                    }).catch(error => {res.status(404).send(error)})
                  }).catch(error => {res.status(404).send(error)})
                }).catch(error => {res.status(404).send(error)})
              }).catch(error => {res.status(404).send(error)})
            }).catch(error => {res.status(404).send(error)})
          }).catch(error => {res.status(404).send(error)})
        }else {
          console.log("test3")
          getChangesCurrencys().then(currencys => {
            getDataUser(user.id).then(user => {
              const responseData = {
                user : user,
                currencys: currencys
              }
              //console.log(responseData)
              res.status(200).send(responseData)
            }).catch(error => {res.status(404).send(error)})
          }).catch(error => {res.status(404).send(error)})
        }
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
       user.password, user.day, user.month, user.year, false).then(user =>{
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

router.post("/resetPass", async (req, res) => {
  const email = req.body.email;
  resetPass(email).then(() => {
    res.status(200)
  }).catch(error => {
    res.status(404)
  })
})


module.exports = router;