const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.tokens.create({
  card: {
    number: '4000000000000077',
    exp_month: 4,
    exp_year: 2024,
    cvc: '314',
  },
}).then(cardToken => {
    console.log(cardToken)
})