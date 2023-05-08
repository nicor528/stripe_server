const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

// `source` is obtained with Stripe.js; see https://stripe.com/docs/payments/accept-a-payment-charges#web-create-token
stripe.charges.create({
  amount: 2000,
  currency: 'usd',
  source: 'tok_1Mw7RJFB53J3KRhjtuub8c2c',
  description: 'carga',
}).then(charge =>{
    console.log(JSON.stringify(charge))
    console.log(charge)
})