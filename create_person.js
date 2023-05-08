const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');
stripe.accounts.createPerson(
  'acct_1Mw5lJFSLw0nFdev',
  { first_name: 'Prueba2',
    last_name: 'Prueba2',
    dob: {
      day: "2",
      month: "3",
      year: "1990"
    },
    address: {
      city: "Millville",
      line1: "2375 Pennsylvania Avenue",
      postal_code: "08332",
      state: "NJ",
    },
    email: "prueba2@gmail.com",
    phone: "+12027282330",
    ssn_last_4: "1234"
  }
).then(person => {
    console.log(person)
})