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
    setDoc} = require("firebase/firestore")
const {getAuth, 
    signInWithRedirect,
     GoogleAuthProvider, 
     signInWithPopup, 
     FacebookAuthProvider, 
     TwitterAuthProvider,
     signInWithCredential } = require("firebase/auth"); 
const { createAccount, createCustomer } = require('./apiStripe');

const firebaseConfig = {
    apiKey: process.env.apiKey,
    authDomain: process.env.authDomain,
    projectId: process.env.projectId,
    storageBucket: process.env.storageBucket,
    messagingSenderId: process.env.messagingSenderId,
    appId: process.env.apiKey
}

const app = initializeApp(firebaseConfig);
const DB = getFirestore(app)
const auth = getAuth();

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

const newUser = async (id, name, email, lastName, country, currency, phone ) =>{

    return(
        new Promise (async (res, rej) =>{
            await setDoc(doc(DB, "Users", id ),{
                name: name,
                email: email,
                phone: phone,
                lastName: lastName,
                amount:
                        {
                            amount: 0
                        },
                idNumber: "000000000",
                identityVerifed: false,
                stripeAccount: false,
                cards: [],
                banckAccount: {
                    id: ""
                },
                contactList:[],
                country: country,
                currency: country==="US" ? "usd" : "GBP",
                stripeCard: {
                    
                },
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
                    day: "2",
                    month: "3",
                    year: "1990"
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

function setVerifiedTrue (id) {
    return(
        new Promise (async(res, rej)=> {
            const docRef = doc(DB, 'Users', id);
            await updateDoc(docRef, {
                identityVerifed: true
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

async function setBanckAccount(userID, id) {
    return(
        new Promise (async (res, rej) =>{
            const docRef = doc(DB, 'Users', userID);
            await updateDoc(docRef, {
                banckAccount: 
                {   
                    id: id,
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

function updateUserBalance (id, amount) {
    return (
        new Promise (async (res,rej)=> {
            const docRef = doc(DB, 'Users', id);
            const docSnap1 = await getDoc(docRef);
            if (docSnap1.exists()) {
                const user = docSnap1.data()
                const newAmount = user.amount.amount + amount
                    await updateDoc(docRef, {
                    amount: {
                        amount: newAmount
                    }
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
                console.log("test3")
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

module.exports = {
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
    editUserData
}