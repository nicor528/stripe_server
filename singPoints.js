const express = require('express');
const { getUsers } = require('./apiFirebase');
//const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');


const app = express()

app.use(express.static('public'));
app.use(express.json());

app.get("/singIn", async (req, res) => {
    await getUsers().then(data => {
        console.log(data)
        res.status(200).send(data)
    }).catch(error =>{
        console.log(error)
    })
})


app.listen(4242, () => console.log("Node server listening on port 4242!"));