const fetch = require('node-fetch');

const apiKey = '3e3435e6-c37a-45a5-a69b-e9f736f43f61';
const authToken = "bjYAf7rpNHzIg3aZwWbw"

function verifyAddress(address, country) {
  return new Promise((res, rej) => {
    let url
    if(country === "US"){
      url = `https://international-street.api.smartystreets.com/verify?auth-id=${apiKey}&auth-token=${authToken}&candidates=1&address1=${encodeURIComponent(address.line1)}&address2=${encodeURIComponent(address.city)}&locality=${encodeURIComponent(address.state)}&country=${country}&zipcode=${encodeURIComponent(address.postal_code)}`;
    }
    if(country === "GB"){
      url = `https://international-street.api.smartystreets.com/verify?auth-id=${apiKey}&auth-token=${authToken}&candidates=1&address1=${encodeURIComponent(address.line1)}&address2=${encodeURIComponent(address.city)}&locality=${encodeURIComponent(address.state)}&country=${country}&zipcode=${encodeURIComponent(address.postal_code)}`;
    }
    

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        console.log(data[0].analysis.verification_status)
        console.log(data[0].analysis.changes)
        res("Ok, need to pay the API")
        if (data[0].analysis.verification_status === 'Ambiguous') {
          res('La dirección está válida y bien escrita.');
        } 
        if(data[0].analysis.verification_status === 'Verified'){
          res('La dirección está válida y bien escrita.');
        }
        else {
          res('La dirección no es válida o está mal escrita.');
        }
      })
      .catch(error => {
        console.log(error)
        rej('Error en la solicitud de verificación de dirección: ' + error.message);
      });
  });
}

module.exports={
    verifyAddress,
}