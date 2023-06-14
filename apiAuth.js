require('dotenv').config();
const {
    getAuth, 
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


module.exports = {
    SingInPass,
    CreateEmailUser,

}