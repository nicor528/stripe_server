const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

/*
stripe.accounts.update(
  'acct_1MvjFh2VrUtWocHH',
  {business_profile: {
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
    phone: "+12027282330"
    }
    }
).then(acount => {
    console.log(acount)
})*/

/*
stripe.accounts.update(
    'acct_1MvjFh2VrUtWocHH',
    {
    company: {
        tax_id: "123456789"
        },
    external_account: "btok_1Mw5jOFB53J3KRhjfhlo1Doe",

    }
).then(acount => {
    console.log(acount)
})*/

/*
stripe.accounts.update(
    "acct_1Mw5lJFSLw0nFdev",
    {
        individual: {
            first_name: 'Prueba2',
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
    }
).then(acount => {
    console.log(acount)
}) */

/*
stripe.accounts.update(
    'acct_1Mw5lJFSLw0nFdev',
    {tos_acceptance: {date: 1609798905, ip: '8.8.8.8'}}
).then(acount => {
    console.log(acount)
})*/

stripe.accounts.update(
    'acct_1Mw5lJFSLw0nFdev',
    {individual: {
        id_number: "123138888"
    }}
).then(acount => {
    console.log(acount)
})