const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');
/*
stripe.customers.createSource(
  'cus_NghBG9dQKHFfB6',
  {source: "tok_1MvOnNFB53J3KRhjyJLc7OtB"}
).then(card => {
    console.log(card)
})*/


stripe.tokens.create({
    card: {
      number: '4000000000000077',
      exp_month: 4,
      exp_year: 2024,
      cvc: '314',
      currency: "GBP"
    },
  }).then(cardToken => {
      console.log(cardToken)
      stripe.customers.createSource(
          "cus_NfGenBDDM7tIK0",
          {source: cardToken.id}
        ).then(card => {
            console.log(card)
        })
  })