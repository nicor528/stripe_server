const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.accounts.retrieve(
  'acct_1MvjFh2VrUtWocHH'
).then(acount => {
    console.log(acount)
})

