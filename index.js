const express = require('express');
const SingIn = require("./routes/singIn");
const Verify = require("./routes/verifications")
const cors = require('cors');
const bodyParser = require('body-parser');
const stripePoints = require ("./routes/stripePoints");
const Edits = require("./routes/editPoints");


const app = express()
/*
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));*/

app.use(express.static('public'));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream',
};

app.use(bodyParser.raw(options));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(SingIn)
app.use(Verify)
app.use(stripePoints)
app.use(Edits)

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log("server up en", PORT));