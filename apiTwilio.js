const twilio = require('twilio');
const { setSMSCode } = require('./apiFirebase');

const accountSid = 'ACf0a8deab1ddad940a0b81912e50a5064';
const authToken = 'e0004923d0eea0e53aee09ac391635f6';
const client = twilio(accountSid, authToken);

function createCode (phone, id) {
    const code = Math.floor(100000 + Math.random() * 900000);
    return(
        new Promise ((res, rej) => {
            client.messages
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
                });
        })
    )
}


module.exports = {
    createCode,

}