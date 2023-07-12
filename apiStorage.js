const { getStorage, ref, uploadString, uploadBytes, getDownloadURL  } = require("firebase/storage")
const { storage } = require("./apiFirebase");

function uploadID (name, id) {
    const url = "id/" + name + ".jpeg"
    const storageRef = ref(storage, url);
    return(
        new Promise (async (res, rej) => {
            console.log(id)
            uploadBytes(storageRef, id).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((downloadURL) => {
                    console.log('File available at', downloadURL)
                    res(downloadURL)
                }).catch(error => {console.log(error), rej(error)})
            }).catch(error => {console.log(error), rej(error)})
        })
    )

}

module.exports = {
    uploadID
}

