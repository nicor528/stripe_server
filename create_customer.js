const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.customers.create({
  description: 'My First Test Customer (created for API docs at https://www.stripe.com/docs/api)',
  name: "Nicolas Riquelme",
  
}).then(customer => {
    console.log(customer)
    console.log(JSON.stringify(customer))
})