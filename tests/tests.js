const { updateUserBalance2, newUser } = require("./apiFirebase");

function testAmounts () {
    updateUserBalance2("Test", 10, "GBP", "123", "test", "test@gmail.com", "succeded", "hoy").then(user => {
        console.log(user)
    })
}

function newUser2 () {
    newUser("Test", "Test", "Test@gmail.com", "Test", "GB", "", "+541166778877").then(user=>{
        console.log(user)
    })
}

