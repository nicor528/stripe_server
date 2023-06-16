//import { initializeApp } from "firebase/app";
require('dotenv').config();
const {initializeApp} = require("firebase/app");
const {
    getFirestore, 
    collection,
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
    deleteDoc
    } = require("firebase/firestore");
const {
    getAuth, 
    signInWithRedirect,
    GoogleAuthProvider, 
    signInWithPopup, 
    FacebookAuthProvider, 
    TwitterAuthProvider,
    signInWithCredential } = require("firebase/auth"); 

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.appId,
    measurementId: process.env.measurementId
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
            getDocs(DBRef).then(snapshot => {
                const data = snapshot.docs.map( users => {
                    return {user: users.data()}
                })
                res(data)
            }).catch(error => {
                rej(error)
            })
        })
    )
}

const newUser = async (id, name, email, lastName, country, currency, phone, password, day, month, year, userRole, isActivate, isBlocked) =>{

    return(
        new Promise (async (res, rej) =>{
            await setDoc(doc(DB, "Users", id ),{
                password: password,
                name: name,
                email: email,
                phone: phone,
                lastName: lastName,
                phoneVerifed: true,
                addressVerified : false,
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
                identityVerifed: false,
                stripeAccount: false,
                cards: [],
                banckAccount: {
                    id: ""
                },
                transactions: [],
                contactList:[],
                country: country,
                COUNTRY: country === process.env.defaultCountry ? "United states" : "United Kingdom",
                currency: country=== process.env.defaultCountry ? "USD" : "GBP",
                stripeCard: {
                    
                },
                stripe: {
                    accountID: "",
                    customerID: "",
                },
                id: id,
                address: {
                    city: country === process.env.defaultCountry ? "Millville" : "Aberdeen" ,
                    line1: country === process.env.defaultCountry ? "2375 Pennsylvania Avenue": "289 Westburn Rd" ,
                    postal_code: country === process.env.defaultCountry ? "08332" : "AB10 " ,
                    state: country === process.env.defaultCountry ? "NJ": "Escocia" ,
                    },
                dob: {
                    day: day.toString(),
                    month: month.toString(),
                    year: year.toString()
                    },
                role: userRole, // admin : 0, user : 1
                activate : isActivate,
                blocked : isBlocked,

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
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
};

const validuser1 = (token) => {
    const credential = FacebookAuthProvider.credential(token);
    signInWithCredential(auth, credential).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
};

const validuser2 = (token) => {
    const credential = TwitterAuthProvider.credential(token);
    signInWithCredential(auth, credential).then(result => {
        console.log(result);
    }).catch(error => {
        console.log(error);
    });
};

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
                {  
                    id: card.id,
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
                identityVerifed: true,
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

// function editUserData (id, user) {
//     return(
//         new Promise(async(res,rej)=>{
//             const docRef = await doc(DB, 'Users', id);
//             await updateDoc(docRef, {
//                 country : user.country,
//                 dob : {
//                     day : user.day,
//                     month : user.month,
//                     year : user.year
//                 },
//                 name : user.name,
//                 lastName : user.lastName,
//                 phone : user.phone,
//             })
//             const docSnap = await getDoc(docRef);
//             if (docSnap.exists()) {
//                 res(docSnap.data());
//             } else {
//               // doc.data() will be undefined in this case
//                 rej(docSnap)
//             }

//         })
//     )
// }

async function resetPassword(id, password){
    return(
        new Promise(async(res,rej)=>{
            const docRef = await doc(DB, 'Users', id);
            await updateDoc(docRef, {
                password : password
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                rej(docSnap)
            }

        })
    )
}

async function updateActivate(id, isActivate){
    return(
        new Promise(async(res,rej)=>{
            const docRef = await doc(DB, 'Users', id);
            await updateDoc(docRef, {
                activate : isActivate
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                rej(docSnap)
            }
        })
    )
}

async function updateBlock(id, isBlocked){
    return(
        new Promise(async(res,rej)=>{
            const docRef = await doc(DB, 'Users', id);
            await updateDoc(docRef, {
                blocked : isBlocked
            })
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                res(docSnap.data());
            } else {
                rej(docSnap)
            }
        })
    )
}

async function getTotalMoney(){
    return(
        new Promise (async (res,rej) => {
            const docRef = doc(DB, 'TotalMoney', "Total")
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const Money = (docSnap.data());
                    res(Money);
            } else {
                  // doc.data() will be undefined in this case
                rej(docSnap)
            }
        })
    )
}

async function deleteUser(id){
    return(
        new Promise(async(res,rej)=>{
            const docRef = await doc(DB, 'Users', id);
            
                await deleteDoc(docRef).then(() => {
                    console.log("User successfully deleted!");
                  })
                  .catch((error) => {
                    console.error(error);
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

function setTransactionW (id, amount, currency, date, localAmount, stripeAmount, action, email) {
    return(
        new Promise (async (res, rej) => {
            const docRef = await doc(DB, 'transactions', id);
            await setDoc(docRef, {
                amount : amount,
                currency : currency,
                action : action,
                date: date,
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
                console.log("12312312312")
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
                            {   id: transID,
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
                        {   id: transID,
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

module.exports = {
    auth,
    getUsers,
    validuser,
    validuser1,
    validuser2,
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
    resetPassword,
    updateActivate,
    updateBlock,
    getTotalMoney,
    deleteUser
}