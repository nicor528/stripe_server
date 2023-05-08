const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');

/*const paymentLink = await */stripe.paymentLinks.create({
  line_items: [{price: "price_1Mte5MFB53J3KRhjHVqDjiCh", quantity: 1}],
  after_completion: {type: 'redirect', redirect: {url: 'https://google.com'}},
}).then(link => {
    console.log("link creado es: " + link.id)
    console.log("el link es: " + link.url)
});
