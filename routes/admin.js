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