require('dotenv').config();
const {getAuth, 
        sendPasswordResetEmail ,
        signInWithRedirect,
        GoogleAuthProvider, 
        signInWithPopup, 
        FacebookAuthProvider, 
        TwitterAuthProvider,
        signInWithCredential, 
        signInWithEmailAndPassword,
        createUserWithEmailAndPassword
} = require("firebase/auth"); 
const { auth } = require("./apiFirebase");


function SingInPass (email, password) {
    return(
        new Promise (async (res,rej) => {
            signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
                const user = userCredential.user
                console.log(user)
                res(user)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function CreateEmailUser (email, password) {
    return (
        new Promise (async (res, rej) => {
            createUserWithEmailAndPassword(auth, email, password).then(userCredential => {
                const user = userCredential.user;
                console.log(user.uid)
                res(user)
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

function resetPass (email) {
    return(
        new Promise (async (res, rej) => {
            sendPasswordResetEmail(auth, email).then(() => {
                res()
            }).catch(error => {
                console.log(error)
                rej(error)
            })
        })
    )
}

const validuserG = (token) => {
    return(
        new Promise (async (res, rej) => {
            const credential = GoogleAuthProvider.credential(token);
            signInWithCredential(auth, credential).then(result => {
                console.log(result)
                res(result)
            }).catch(error => {
                console.log(error);
                rej(error)
            })
        })
    )

}




module.exports = {
    SingInPass,
    CreateEmailUser,
    resetPass,
    validuserG

}