"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3bucket = exports.docClient = exports.dynamodb = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
aws_sdk_1.default.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});
// const docClient = new AWS.DynamoDB.DocumentClient();
const docClient = new dynamodb_1.DocumentClient();
exports.docClient = docClient;
// var docClient = new DOC.DynamoDB();
const dynamodb = new aws_sdk_1.default.DynamoDB();
exports.dynamodb = dynamodb;
const s3bucket = new aws_sdk_1.default.S3();
exports.s3bucket = s3bucket;
//# sourceMappingURL=db.js.map