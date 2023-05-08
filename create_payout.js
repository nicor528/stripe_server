const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.payouts.create({
  amount: 1100,
  currency: 'usd',
  destination: "acct_1Mw5lJFSLw0nFdev"
}).then(payout => {
    console.log(payout)
})