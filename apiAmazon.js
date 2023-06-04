require('dotenv').config();
const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2'
});

const rekognition = new AWS.Rekognition();


// Parámetros para la detección de caras

function compareFaces (image1, image2) {
  return(
    new Promise ((res, rej) => {
      const params = {
        SimilarityThreshold: 90,
        SourceImage: {
          Bytes: image1,
        },
        TargetImage: {
          Bytes: image2,
        },
      };
      
      // Detectar caras en las imágenes
      rekognition.compareFaces(params, (err, data) => {
        if (err) {
          console.log(err, err.stack);
          rej(err)
        } else {
          console.log(data);
          res(data)
        }
      });
    })
  )
}

function compareDNI(image, dniNumber) {
  return new Promise((resolve, reject) => {
    const params = {
      Image: {
        Bytes: image,
      },
    };

    rekognition.detectText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        reject(err);
      } else {
        console.log(data);
        const detectedTexts = data.TextDetections.filter(
          (detection) => detection.Type === 'LINE'
        );

        const detectedDNIs = detectedTexts.map((detection) =>
          detection.DetectedText.replace(/\./g, '')
        );

        const dniWithoutDots = dniNumber.replace(/\./g, '');

        const matchedDNI = detectedDNIs.find(
          (detectedDNI) => detectedDNI === dniWithoutDots
        );

        if (matchedDNI) {
          resolve();
        } else {
          reject(new Error('DNI number does not match'));
        }
      }
    });
  });
}

module.exports = {
  compareFaces,
  compareDNI,

}
