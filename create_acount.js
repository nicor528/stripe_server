const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.accounts.create({
  type: 'custom',
  country: 'US',
  email: 'prueba2.prueba@example.com',
  capabilities: {
    card_payments: {requested: true},
    transfers: {requested: true},
  },
  business_type: "individual",
  business_profile: {
    mcc: "5734",
    url: "www.google.com.ar",
  },
  company: {
    address: {
        city: "Millville",
        line1: "2375 Pennsylvania Avenue",
        postal_code: "08332",
        state: "NJ",
        },
    name: "prueba",
    phone: "+12027282330",
    tax_id: "123456789"
    },
    external_account: "btok_1Mw5jOFB53J3KRhjfhlo1Doe",
  
}).then(acount => {
    console.log(acount)
})

/*
stripe.accounts.retrieve(
  'acct_1MvPiIFZyPipx2Si'
).then(data => {
    console.log(data)
})*/