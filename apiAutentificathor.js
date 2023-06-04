const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

function newVinculation (name, lastName) {
    const secret = speakeasy.generateSecret({ length: 20 }).base32;

    const otpAuthUrl = speakeasy.otpauthURL({
        secret,
        label: 'Wallet',
        issuer: name + lastName,
      });

    return otpAuthUrl
}



module.exports = {
    newVinculation,

}