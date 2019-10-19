const awsServerlessExpress = require('aws-serverless-express');
const AWS = require('aws-sdk');
AWS.region = "ap-northeast-1";
const app = require('./app');
const rekognition = new AWS.Rekognition({ apiVersion: '2016-06-27' });
const server = awsServerlessExpress.createServer(app);

exports.handler =  async (event, context) => {
  awsServerlessExpress.proxy(server, event, context)
  let imageToDetect = event.body;
  let faceResult = await rekognition.detectFaces({
    Attributes: ["ALL"],
    Image: {
      S3Object: {
        Bucket: "amplify-demo-mopcon05abc1761b5545a5bd91a493320cbe20-dev",
        Name: imageToDetect
      }
    },
  }).promise();

  let details = faceResult.FaceDetails;
  return faceResult;
};
