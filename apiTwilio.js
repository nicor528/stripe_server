const twilio = require('twilio');
const { setSMSCode } = require('./apiFirebase');

const accountSid = 'ACf0a8deab1ddad940a0b81912e50a5064';
const authToken = '71bdf84843e2dd39a1e53d05cc17b32a';
//const client = twilio(accountSid, authToken);

function createCode (phone, id) {
    const code = Math.floor(100000 + Math.random() * 900000);
    return(
        new Promise ((res, rej) => {
            setSMSCode(id, 123456).then(user => {
                res(user)
            }).catch(error =>  {rej(erro),console.log(error)})
{ /*           client.messages
                .create({
                    body: `Tu código de verificación es: ${code}`,
                    from: '+12543555883',
                    to: "+" + "541169018596"
                })
                .then(message => {
                    console.log('SMS enviado:', message.sid)
                    setSMSCode(id, 123456).then(user => {
                        res(user)
                    }).catch(error => console.log(error))
                })
                .catch(error => {
                    console.error('Error al enviar el SMS:', error)
                    rej(error)
                });*/}
        })
    )
}


module.exports = {
    createCode,

}