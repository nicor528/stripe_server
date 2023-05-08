const stripe = require('stripe')('sk_test_51Mw8wICFdNdDtHaqAfhvsf759sCiqPaOhbNuzjC1FU87zh99FWIIArHOBp8J2iQZxoozY9xJ3k6ouAx85NpzqwFL00QZ5G3b5Q');

let refAccount;

stripe.accounts.create({
    type: "custom",
    country: "GB",
    email: "pruebaGB@gmail.com",
    capabilities: {
        transfers: {requested: true},
      },
    business_profile: {
        mcc: "6012",
        url: "www.google.com"
    },
    business_type: "individual",
    //tos_acceptance: {date: 1609798905, ip: '8.8.8.8', service_agreement: 'recipient'}
}).then(acount => {
        refAccount = acount.id;
        console.log(acount)
        stripe.accounts.createPerson(
            acount.id,
            {
                first_name: "Sing UP",
                last_name: "Test",
                dob: {
                    day: "2",
                    month: "3",
                    year: "1990"
                },
                address: {
                    city: "Millville",
                    line1: "address_full_match",
                    postal_code: "08332",
                    state: "NJ",
                },
                email: "pruebaGB@gmail.com",
                phone: "+12027282330",
                ssn_last_4: "1234",
                id_number: "123131234",
                relationship: {
                    representative: true
                }
            }
        ).then(person => {
            console.log(person)
            stripe.tokens.create({
                bank_account: {
                    country: 'GB',
                    currency: 'EUR',
                    account_holder_name: 'SingUP GBTest',
                    account_holder_type: 'individual',
                    account_number: '000123456789',
                    routing_number: '110000000',
                  }
                  /*
                  card: {
                    number: '5200828282828210',
                    exp_month: 4,
                    exp_year: 2024,
                    cvc: '314',
                    currency: "GBP"
                  },*/
            }).then(token => {
                    console.log(token)
                    stripe.accounts.update(
                        refAccount,
                        {
                            external_account: token.id
                        }
                    ).then(account => {
                        console.log(account)
                    })
                })
        }).catch(error => {
            console.log(error)
        })
    }).catch(error => {
        console.log(error)
        })
.catch(error => {
    console.log(error)
})