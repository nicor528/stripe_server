const express = require('express');
const router = express.Router();
const {validuser, newUser, getDataUser, getChangesCurrencys} = require('../apiFirebase');
const { getAccount } = require('../apiStripe');

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



module.exports = router;