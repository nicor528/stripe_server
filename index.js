const express = require('express');
const stripe = require('stripe')('sk_test_51MtZkaFB53J3KRhjTwuAmH3YXskxuPUOGfEijzED8POeec98XSkmfQEtYAk1Qz4By099ACfxvMY8lP2EnM6ws8IY00iNIiO20d');
const SingIn = require("./routes/singIn");
const Verify = require("./routes/verifications")
const Admin = require("./routes/admin")
const cors = require('cors');
const bodyParser = require('body-parser');
const stripePoints = require ("./routes/stripePoints");
const Edits = require("./routes/editPoints");


const app = express()
/*const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', "application/json"],
  optionsSuccessStatus: 200 
};*//*
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));*/
//app.options('*', cors());
app.use(express.static('public'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const options = {
  inflate: true,
  limit: '100kb',
  type: 'application/octet-stream',
};

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.raw(options));
/*
app.use((req, res, next) => {
    if (req.headers['content-type'] === 'application/json') {
      try {
        req.body = JSON.parse(req.body);
      } catch (error) {
        return res.status(400).send({ message: 'Invalid JSON' });
      }
    }
    next();
  });*/


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Content-Type', 'application/json');
    next();
});
app.use(SingIn)
app.use(Verify)
app.use(stripePoints)
app.use(Edits)
app.use(Admin)
/*
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    next();
  });*/


app.post("/transfer", async (req, res) => {
    await console.log(req.body)
    res.status(200).send("www.google.com.ar");
})

app.post("/test",async  (req, res) => {
    //const token = await req.body.token
    
    console.log(req.body)
    if(req.body){
        res.status(200).send("ok");
    }
    else{
        res.status(200).send("www.google.com.ar");
    }
    
})

app.get("/", async (req, res) => {
  res.status(200).send("API Running");
})

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log("server up en", PORT));