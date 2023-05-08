const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.tokens.create({
  bank_account: {
    country: 'US',
    currency: 'usd',
    account_holder_name: 'Prueba2 Prueba2',
    account_holder_type: 'individual',
    routing_number: '110000001',
    account_number: '000123456789',
  },
}).then(token => {
    console.log(token)
})