const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

stripe.paymentLinks.update(
    'plink_1Mtus6FB53J3KRhjiOy743fR',
    {active: false}
  ).then(link => {
    console.log("El link fue desactivado")
})