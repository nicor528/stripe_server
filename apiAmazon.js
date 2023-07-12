require('dotenv').config();
const AWS = require('aws-sdk');
//const { SESv2Client, SendEmailCommand } = require("@aws-sdk/client-sesv2")

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWSregion,
});

const config = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWSregion,
}

const rekognition = new AWS.Rekognition();
//const SES = new AWS.SES({ apiVersion: '2019-09-27' })

/*function sendEmail (email, action) {
  const input = {
    FromEmailAddress: "riquitechs@gmail.com",
    FromEmailAddressIdentityArn: "STRING_VALUE",
    Destination: { // Destination
      ToAddresses: [ // EmailAddressList
        "nicolasriquelme528@gmail.com",
      ],
      CcAddresses: [
        "STRING_VALUE",
      ],
      BccAddresses: [
        "STRING_VALUE",
      ],
    },
    ReplyToAddresses: [
      "STRING_VALUE",
    ],
    FeedbackForwardingEmailAddress: "STRING_VALUE",
    FeedbackForwardingEmailAddressIdentityArn: "STRING_VALUE",
    Content: { // EmailContent
      Simple: { // Message
        Subject: { // Content
          Data: action, // required
          Charset: "STRING_VALUE",
        },
        Body: { // Body
          Text: {
            Data: "succefull", // required
            Charset: "STRING_VALUE",
          },
          Html: {
            Data: "STRING_VALUE", // required
            Charset: "STRING_VALUE",
          },
        },
      },
      Raw: { // RawMessage
        Data: "BLOB_VALUE", // required
      },
      Template: { // Template
        TemplateName: "STRING_VALUE",
        TemplateArn: "STRING_VALUE",
        TemplateData: "STRING_VALUE",
      },
    },
    EmailTags: [ // MessageTagList
      { // MessageTag
        Name: "STRING_VALUE", // required
        Value: "STRING_VALUE", // required
      },
    ],
    ConfigurationSetName: "STRING_VALUE",
    ListManagementOptions: { // ListManagementOptions
      ContactListName: "STRING_VALUE", // required
      TopicName: "STRING_VALUE",
    },
  }
  return(
    new Promise (async (res, rej) => {
      const command = await new SendEmailCommand(input);
      client.send(command).then(response => {
        console.log(response)
        res(response)
      }).catch(error => {console.log(error), rej(error)})
    })
  )
}*/



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
  return new Promise((res, rej) => {
    const params = {
      Image: {
        Bytes: image,
      },
    };

    rekognition.detectText(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        rej(err);
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
          res();
        } else {
          rej(new Error('DNI number does not match'));
        }
      }
    });
  });
}

module.exports = {
  compareFaces,
  compareDNI,

}
