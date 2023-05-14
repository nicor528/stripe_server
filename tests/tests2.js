const { setChangesCurrencysDB } = require("../apiFirebase");

async function setChangesCurrencys () {
    const currencys = ["USD", "EUR", "GBP"]
    const localCurrencys = ["USD", "EUR", "GBP"]
    let changes = []
    let e = 0;
    do{
        let i = 0;
        const myHeaders = new Headers();
        myHeaders.append("apikey", "ZZQ5Nfdn2ZCUR5DCex3zQzbekB7N9iA7");
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
          headers: myHeaders
        };
        do{
            await fetch(`https://api.apilayer.com/currency_data/live?currencies=${currencys[i]}&source=${localCurrencys[e]}&format=1`, requestOptions)
            .then(response => response.json())
            .then(async(data) => {
              const rate = data.quotes[Object.keys(data.quotes)[0]]
              console.log(data)
              if(!isNaN(rate)){
                console.log(e, i)
                const data2 = {
                  currencys : localCurrencys[e].toString() + currencys[i].toString(),
                  rate: rate
                }
                console.log(data2)
                await changes.push(data2)
              }else {
  
              }
            })
            .catch(error => console.log(error));
            i++
        }while(i < currencys.length)
          e ++
    }while(e < localCurrencys.length)
    setChangesCurrencysDB(changes).then(data => {
        console.log(data)
    }).catch(error => {console.log(error)})
}
  
  
setChangesCurrencys();

/*
router.post("/chargeMoney", async (req, res) => {
    let currencys;
    getChangesCurrencys().then(changes => {
        currencys = changes.changes
    })
    const id = req.body.id;
    const amount = req.body.amount
    const userAmount = req.body.amount * 0.956
    const date = req.body.date;
    const localAmount = req.body.localAmount
    const stripeAmount = localAmount * 100
    const currency = req.body.currency
    getDataUser(id).then(user=> {
        addMoney(user.stripe.customerID, stripeAmount).then(charge=>{
            console.log(charge)
            updateBalance(userAmount).then(user => {
                updateUserBalance(id, userAmount, charge.id, "charge", "", charge.status, date).then(user=>{
                    res.status(200).send(user)
                })
            })
        })
    })
})*/