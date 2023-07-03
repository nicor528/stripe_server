//import { initializeApp } from "firebase/app";
require('dotenv').config();
const {initializeApp} = require("firebase/app")
const {getFirestore, collection,
    getDocs,
    doc,
    getDoc,
    query,
    where,
    addDoc,
    updateDoc,
    increment,
    arrayUnion,
    setDoc,
    arrayRemove,
    deleteDoc} = require("firebase/firestore")
const {getAuth, 
    signInWithRedirect,
     GoogleAuthProvider, 
     signInWithPopup, 
     FacebookAuthProvider, 
     TwitterAuthProvider,
     signInWithCredential } = require("firebase/auth"); 
const { UserContextImpl } = require('twilio/lib/rest/conversations/v1/user');

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId
}

const app =  initializeApp(firebaseConfig);
const DB =  getFirestore(app);
const auth =  getAuth(app);

function generateID () {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          code += characters[randomIndex];
        }
        return code;
}

const getUsers = async () => {
    const DBRef = await collection(DB, "Users");
    return(
        new Promise ((res, rej) => {
            getDocs(DBRef).then(async (snapshot) => {
                const users = snapshot.docs.map( users => {
                    const user = users.data()
                    return user;
                })
                let usersJan = 0; let usersFeb = 0; let usersMar = 0; let usersAbr = 0;
                let usersMay = 0; let usersJun = 0; let usersJul = 0; let usersAgu = 0;
                let usersSep = 0; let usersOct = 0; let usersNov = 0; let usersDic = 0;
                await users.map(user => {
                    if(user.singUpDate && user.singUpDate.month === 1){
                        usersJan = usersJan + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 2){
                        usersFeb = usersFeb + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 3){
                        usersMar = usersMar + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 4){
                        usersAbr = usersAbr + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 5){
                        usersMay = usersMay + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 6){
                        usersJun = usersJun + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 7){
                        usersJul = usersJul + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 8){
                        usersAgu = usersAgu + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 9){
                        usersSep = usersSep + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 10){
                        usersOct = usersOct + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 11){
                        usersNov = usersNov + 1
                    }
                    if(user.singUpDate && user.singUpDate.month === 12){
                        usersDic = usersDic + 1
                    }
                })
                let usersActive = 0; let usersInactive = 0; let usersUnverified = 0;
                await users.map(user => {
                    if(!user.identityVerifed){
                        usersUnverified = usersUnverified + 1;
                    }
                    if(user.stripeAccount){
                        usersActive = usersActive + 1;
                    }
                    if(!user.stripeAccount){
                        usersInactive = usersInactive + 1;
                    }
                })
                console.log(users[0])
                const data = {
                    users : users,
                    usersXmonth : [usersJan, usersFeb, usersMar, usersAbr, usersMay,
                    usersJun, usersJul, usersAgu, usersSep, usersOct, usersNov, usersDic],
                    usersActive: usersActive,
                    usersInactive: usersInactive,
                    usersUnverified: usersUnverified
                }
                res(data)
            }).catch(error => {
                rej(error)
            })
        })
    )
}

const setReportsUserData = async (users) => {
    return(
        new Promise(async (res, rej) => {
            let usersActive = 0; let usersInactive = 0; let usersUnverified = 0;
            await users.map(user => {
                if(!user.identityVerifed){
                    usersUnverified = usersUnverified + 1;
                }
                if(user.stripeAccount){
                    usersActive = usersActive + 1;
                }
                if(!user.stripeAccount){
                    usersInactive = usersInactive + 1;
                }
            })

        })
    )
}

const getTransactionAdmin = async (id) => {
    return(
        new Promise (async (res, rej) => {
            const DBRef = await collection (DB, "Users");
            getDocs(DBRef).then(async (snapshot) => {
                const users = await snapshot.docs.map( users => {
                    return {user: users.data()}
                })
                const transactions = await Promise.all(
                    users.map(async user => {
                      if (user.user.transactions && user.user.transactions.length > 0) {
                        return (
                          user.user.transactions
                        );
                      }
                    })
                );
                const flattenedTransactions = transactions.filter(Boolean).flat();
                const transaction = flattenedTransactions.map(transaction => {
                    if(transaction.id === id){
                        return(transaction)
                    }
                })
                res(transaction)
            }).catch(error => {rej(error)})
        })
    )
}

const getTransactions = async () => {
    return(
        new Promise (async (res, rej) => {
            const DBRef = await collection (DB, "Users");
            getDocs(DBRef).then(async (snapshot) => {
                const users = await snapshot.docs.map( users => {
                    return {user: users.data()}
                })
                const transactions = await Promise.all(
                    users.map(async user => {
                      if (user.user.transactions && user.user.transactions.length > 0) {
                        return (
                          user.user.transactions
                        );
                      }
                    })
                );
                const flattenedTransactions = transactions.filter(Boolean).flat();
                let withdraws = 0;
                flattenedTransactions.map((transaction) => {
                    if(transaction.action === "withdraw"){
                        withdraws = withdraws + 1
                    }
                })
                let topUps = 0;
                flattenedTransactions.map((transaction) => {
                    if(transaction.action === "topUp" || transaction.action === "charge"){
                        topUps = topUps + 1
                    }
                })
                let transfers = 0;
                flattenedTransactions.map((transaction) => {
                    if(transaction.action === "transfer"){
                        transfers = transfers + 1
                    }
                })
                let transfersJan = 0; let transfersFeb = 0; let transfersMar = 0; let transfersAbr = 0;
                let transfersMay = 0; let transfersJun = 0; let transfersJul = 0; let transfersAgu = 0;
                let transfersSep = 0; let transfersOct = 0; let transfersNov = 0; let transfersDic = 0;
                await flattenedTransactions.map(transaction => {
                    if(transaction.objectDate && transaction.objectDate.month === 1){
                        transfersJan = transfersJan + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 2){
                        transfersFeb = transfersFeb + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 3){
                        transfersMar = transfersMar + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 4){
                        transfersAbr = transfersAbr + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 5){
                        transfersMay = transfersMay + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 6){
                        transfersJun = transfersJun + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 7){
                        transfersJul = transfersJul + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 8){
                        transfersAgu = transfersAgu + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 9){
                        transfersSep = transfersSep + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 10){
                        transfersOct = transfersOct + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 11){
                        transfersNov = transfersNov + 1
                    }
                    if(transaction.objectDate && transaction.objectDate.month === 12){
                        transfersDic = transfersDic + 1
                    }
                })
                const data = {
                    withdraws : withdraws,
                    topUps : topUps,
                    transfers : transfers,
                    transactions : flattenedTransactions,
                    transfersXmonth : [transfersJan, transfersFeb, transfersMar, transfersAbr,transfersMay,
                        transfersJun, transfersJul, transfersAgu, transfersSep, transfersOct, transfersNov,
                        transfersDic
                    ]
                }
                console.log(data)
                res(data);
            }).catch(error => {
                console.log(error)
                rej(error);
            })
        })
    )
}

const newUser = async (id, name, email, lastName, country, currency, phone, password,
    day, month, year) =>{

    return(
        new Promise (async (res, rej) =>{
            let localDate = new Date();
            let localDay = await localDate.getDate();
            let localMonth = await localDate.getMonth() + 1; 
            let localYear = await localDate.getFullYear();
            localDate = await localDay + '/' + localMonth + '/' + localYear;
            await setDoc(doc(DB, "Users", id ),{
                singUpDate: {
                    day: localDay,
                    month: localMonth,
                    year: localYear
                },
                password: password,
                name: name,
                email: email,
                phone: "+" + phone,
                lastName: lastName,
                phoneVerifed: true,
                addessVerified : false,
                amount:
                        [
                            {
                                amount: 0,
                                currency: "GBP"
                            },
                            {
                                amount: 0,
                                currency: "USD"
                            },
                            {
                                amount: 0,
                                currency: "EUR"
                            }
                        ],
                idNumber: "000000000",
                identityVerified: false,
                stripeAccount: false,
                cards: [],
                banckAccount: {
                    id: ""
                },
                transactions: [],
                contactList:[],
                country: country,
                COUNTRY: country ==="US" ? "United states" : "United Kingdom",
                currency: country==="US" ? "USD" : "GBP",
                stripeCard: [],
                stripe: {
                    accountID: "",
                    customerID: "",
                },
                id: id,
                address: {
                    city: country === "US" ? "Millville" : "Aberdeen" ,
                    line1: country === "US" ? "2375 Pennsylvania Avenue": "289 Westburn Rd" ,
                    postal_code: country === "US" ? "08332" : "AB10 " ,
                    state: country === "US" ? "NJ": "Escocia" ,
                    },
                dob: {
                    day: day.toString(),
                    month: month.toString(),
                    year: year.toString()
                    },
            })
            const docRef = await doc(DB, "Users", id)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                rej(docSnap)
            }
        }
        )
    )
}

const validuser = (token) => {
    const credential = GoogleAuthProvider.credential(token);
    signInWithCredential(auth, credential).then(result => {
        console.log(result)
    })
}


function getDataUser (id) {
    return (
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "Users", id)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function getStripeID (id) {
    return(
        new Promise (async(res,rej) => {
            const docRef = await doc(DB, "Users", id)
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log(docSnap.data())
                console.log(docSnap.data())
                res(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function addCard (card, id) {
    return (
        new Promise (async (res, rej) => {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                cards: arrayUnion(
                {   id: card.id,
                    brand: card.brand,
                    last4: card.last4
                })
              });
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function setVerifiedTrue (id, ID) {
    return(
        new Promise (async(res, rej)=> {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                identityVerified: true,
                idNumber : ID
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

async function stripeIDs (id, stripeID, customerID) {
    return(
        new Promise (async (res,rej) => {
            const docRef = await doc(DB, 'Users', id);
            await updateDoc(docRef, {
                stripe: {
                    accountID: stripeID,
                    customerID: customerID
                },
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
              // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function editAddress (id, user) {
    return(
        new Promise(async(res,rej)=>{
            const docRef = await doc(DB, 'Users', id);
            await updateDoc(docRef, {
                address: {
                    city: user.city,
                    line1: user.line1,
                    postal_code: user.postal_code,
                    state: user.state,
                },
                addessVerified: true
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
              // doc.data() will be undefined in this case
                rej(docSnap)
            }

        })
    )
}

async function setBanckAccount(userID, id, number) {
    const last4 = await number.slice(-4)
    return(
        new Promise (async (res, rej) =>{
            const docRef = doc(DB, 'Users', userID);
            await updateDoc(docRef, {
                banckAccount: 
                {   
                    id: id,
                    last4: last4
                }
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

async function activateWallet (id) {
    return(
        new Promise (async (res,rej) => {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                stripeAccount: true
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function updateBalance (amount) {
    return(
        new Promise (async (res,rej) => {
            const docRef = doc(DB, 'TotalMoney', "Total")
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const Money = (docSnap.data());
                const newAmount = Money.amount + amount
                await updateDoc(docRef, {
                    amount: newAmount
                })
                const docSnap2 = await getDoc(docRef);
                if (docSnap2.exists()) {
                    res(docSnap2.data());
                } else {
                      // doc.data() will be undefined in this case
                    rej(docSnap)
                }
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function setTransactionW (id, amount, currency, date, localAmount, stripeAmount, action, email, day, month, year) {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, 'transactions', id);
            await setDoc(docRef, {
                amount : amount,
                currency : currency,
                action : action,
                date: date,
                objectDate: {
                    day: day,
                    month: month,
                    year: year
                },
                localAmount: localAmount,
                stripeAmount : stripeAmount,
                userInteraction: action === "charge" || action === "withdraw" ? "N/A" : email
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else { 
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function getTransaction (id) {
    return(
        new Promise (async (res, rej) => {
            const docRef = doc(DB, 'transactions', id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function updateUserBalance2 (id, amount, currency, transID, action, email, status, date) {
    return (
        new Promise (async (res,rej) => {
            const docRef = await doc(DB, 'Users', id);
            const docSnap1 = await getDoc(docRef);
            if (docSnap1.exists()) {
                const user = docSnap1.data()
                const index_ammount = await user.amount.findIndex(elemento => elemento.currency === currency)
                if(index_ammount != -1){
                    const newAmount2 = await parseFloat(user.amount[index_ammount].amount) + parseFloat(amount)
                    await updateDoc(docRef, {
                        amount : arrayRemove(user.amount[index_ammount])
                    })
                    await updateDoc(docRef, {
                        amount: arrayUnion({
                            currency: currency,
                            amount : parseFloat(newAmount2)
                        }),
                        transactions: arrayUnion(
                            {   userID : id,
                                id: transID,
                                amount: amount,
                                currency: currency,
                                action: action,
                                status: status,
                                date: date,
                                userInteraction: action === "charge" || action === "withdraw" ? "N/A" : email,
                            })
                        })
                }else{
                    await updateDoc(docRef, {
                        amount: arrayUnion({
                            currency: currency,
                            amount : parseFloat(amount)
                        }),
                        transactions: arrayUnion(
                        {   userID : id,
                            id: transID,
                            amount: amount,
                            currency: currency,
                            action: action,
                            status: status,
                            date: date,
                            userInteraction: action === "charge" || action === "withdraw" ? "N/A" : email,
                        })
                    })
                }
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    console.log(docSnap.data())
                    res(docSnap.data());
                } else {
                  // doc.data() will be undefined in this case
                    rej(docSnap)
                }
            }else {
                  // doc.data() will be undefined in this case
                rej(docSnap1)
            }
        })
    )
}

function setChangesCurrencysDB (data) {
    return (
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "currencys", "changes")
            data.map(async(changes) => {
                await updateDoc(docRef, {
                    changes : arrayRemove(changes)
                })
                await updateDoc(docRef, {
                    changes: arrayUnion(changes)
                })
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function getChangesCurrencys () {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "currencys", "changes")
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function updateUserBalance (id, amount,transID, action, email, status, date) {
    return (
        new Promise (async (res,rej)=> {
            const docRef = doc(DB, 'Users', id);
            const docSnap1 = await getDoc(docRef);
            var amount2
            if (docSnap1.exists()) {
                const user = docSnap1.data()
                const newAmount = user.amount.amount + amount
                /*if(action === "transfer"){
                    amount2 = amount * -1
                }else if(action === "recived"){
                    amount2 = amount
                }*/
                    await updateDoc(docRef, {
                    amount: {
                        amount: newAmount
                    },
                    transactions: arrayUnion(
                        {   id: transID,
                            amount: amount,
                            action: action,
                            status: status,
                            date: date,
                            userInteraction: action === "charge" || action === "withdraw" ? "N/A" : email,
                        })
                })
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    res(docSnap.data());
                } else {
                  // doc.data() will be undefined in this case
                    rej(docSnap)
                }
            }else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function searchDestination (destination) {
    console.log(destination)
    return(
        new Promise(async (res, rej)=>{
            const DBRef = await collection(DB, "Users");
            getDocs(DBRef).then(async (snapshot) => {
                await snapshot.docs.map( users => {
                    const user = users.data();
                    if(user.email === destination && user.stripeAccount == true){
                        res(user)
                        return
                    }else if(user.email === destination && user.stripeAccount == true){
                        rej(2)
                    }
                })
                rej ("No match")
            }).catch(error => {
                rej(error)
            })
        })
    )
}

function editUserData (id, user) {
    return(
        new Promise(async (res, rej) => {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                name: user.name,
                lastName: user.lastName,
                phone: user.phone,
                email: user.email,
                dob: {
                    day: user.dob.day,
                    month: user.dob.month,
                    year: user.dob.year
                    },
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

async function confirmCell (id) {
    return(
        new Promise (async (res,rej) => {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                phoneVerifed: true
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function setSMSCode (id, code) {
    return (
        new Promise (async (res, rej) => {
            const docRef = doc(DB, 'security', id);
            await setDoc(docRef, {
                smsCode : code
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function getSMSCode (id, CODE) {
    return(
        new Promise (async (res, rej) => {
            const docRef = doc(DB, 'security', id);
            const docSnap = await getDoc(docRef);
            const code = docSnap.data()
            console.log(code.smsCode, CODE)
            if (code.smsCode.toString() === CODE.toString()) {
                res(true)
            }else{
                rej(false)
            }
        })
    )
}

function createCreditCardRequest (user, request, reason, cardId) {
    return new Promise (async (res, rej) => {
        const docRef = await doc(DB, "request", "pending", "requests", user.id);
        const docRef2 = await doc(DB, "Users", user.id)
        await setDoc(docRef, {
            id : user.id,
            user: {
                name : user.name,
                lastName : user.lastName,
                email : user.email,
            },
            request : request,
            state: "pending",
            reason: reason,
            cardId: cardId
        })
        await updateDoc(docRef2, {
            stripeCard : arrayUnion(
                {id : "in revision"}
            )
        })
        const docSnap = await getDoc(docRef2);
        if (docSnap.exists()) {
            res(docSnap.data());
        } else {
              // doc.data() will be undefined in this case
            rej(docSnap)
        }
    })
}

function closeCardRequest (user, state, cardId, reason) {
    return (
        new Promise (async (res, rej) => {
            const id = await generateID();
            const docRef = await doc(DB, "request", "pending", "requests", user.id);
            const docRefClosed = await doc(DB, "request", "closed", "requests", id)
            const docRef2 = await doc(DB, "Users", user.id);
            const request = await getDoc(docRef);
            await updateDoc(docRef, {
                state: state,
                reason: reason === 0 ? request.reason : reason,
                cardId: cardId
            })
            const docSnapRequest = await getDoc(docRef);
            const data = docSnapRequest.data()
            await deleteDoc(docRef);
            await setDoc(docRefClosed, {
                data
            })
            res()
        })
    )
}

function setStripeCard (card, id) {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "Users", id);
            await updateDoc(docRef, {
                stripeCard : arrayRemove({id : "in revision"})
            })
            await updateDoc(docRef, {
                stripeCard : arrayUnion({
                    id : card.id,
                    last4 : card.last4,
                    exp_month: card.exp_month,
                    exp_year: card.exp_year,
                })
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

function setCardInCancelationProcces (id, cardId) {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "Users", id);
            const docSnap1 = await getDoc(docRef);
            if (docSnap1.exists()) {
                const user = docSnap1.data();
                await updateDoc(docRef, {
                    stripeCard : arrayRemove(user.stripeCard[0])
                })
                await updateDoc(docRef, {
                    stripeCard: arrayUnion({
                        id : "In cancelation revision",
                        last4 : user.stripeCard[0].last4,
                        exp_month: user.stripeCard[0].exp_month,
                        exp_year: user.stripeCard[0].exp_year,
                    })
                })
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    res(docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    rej(docSnap)
                }
            }else {
                rej(docSnap1)
            }
        })
    )
}

function setStripeCardCancel (id) {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, "Users", id);
            const docSnap1 = await getDoc(docRef);
            if (docSnap1.exists()) {
                const user = docSnap1.data();
                await updateDoc(docRef, {
                    stripeCard : arrayRemove(user.stripeCard[0])
                })
                await updateDoc(docRef, {
                    stripeCard: arrayUnion({
                        id : "Cancelated",
                        last4 : user.stripeCard[0].last4,
                        exp_month: user.stripeCard[0].exp_month,
                        exp_year: user.stripeCard[0].exp_year,
                    })
                })
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    res(docSnap.data());
                } else {
                    // doc.data() will be undefined in this case
                    rej(docSnap)
                }
            }else {
                rej(docSnap1)
            }
        })
    )
}

module.exports = {
    auth,
    getUsers,
    validuser,
    newUser,
    getDataUser,
    getStripeID,
    addCard,
    setVerifiedTrue,
    setBanckAccount,
    activateWallet,
    updateBalance,
    updateUserBalance,
    searchDestination,
    editAddress,
    stripeIDs,
    editUserData,
    generateID,
    updateUserBalance2,
    setChangesCurrencysDB,
    getChangesCurrencys,
    confirmCell,
    setSMSCode,
    setTransactionW,
    getSMSCode,
    getTransaction,
    createCreditCardRequest,
    setStripeCard,
    closeCardRequest,
    setCardInCancelationProcces,
    setStripeCardCancel,
    getTransactions,
    setReportsUserData,
    getTransactionAdmin
}