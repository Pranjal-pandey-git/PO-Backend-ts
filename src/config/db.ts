import AWS from 'aws-sdk';

import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import dotenv from 'dotenv';
dotenv.config()
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

// const docClient = new AWS.DynamoDB.DocumentClient();
const docClient = new DocumentClient();
// var docClient = new DOC.DynamoDB();
const dynamodb = new AWS.DynamoDB();

const s3bucket = new AWS.S3();
export { dynamodb, docClient, s3bucket };