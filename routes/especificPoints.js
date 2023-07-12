const express = require('express');
const { getDataUser, getRecepiants } = require('../apiFirebase');
const router = express.Router();

router.post("/getRecepiants", async (req, res) => {
    const id = req.body.id;
    getDataUser(id).then(user => {
        console.log(user.recepiants)
        getRecepiants(user.recepiants).then(recepiants => {
            res.status(200).send(recepiants)
        }).catch(error =>{res.status(400).send(error)})
    }).catch(error =>{res.status(404).send(error)})
})





module.exports = router;