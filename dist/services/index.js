"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePOData = exports.getDetailsWithID = exports.getAllPOItems = exports.insert = void 0;
const db_1 = require("../config/db");
const uuid_1 = require("uuid");
const insert = (data, file) => {
    try {
        const s3Params = {
            Bucket: 'team1backendbucket',
            Key: (0, uuid_1.v4)() + ',' + file.originalname,
            Body: file.buffer,
            ACL: 'public-read-write',
        };
        db_1.s3bucket.upload(s3Params, (err, s3Data) => {
            if (err) {
                console.error(err);
            }
            else {
                // Store file information in DynamoDB
                const params = {
                    TableName: "podetails",
                    Item: {
                        ponumber: data.po_id,
                        details: data.items,
                        date: data.date,
                        poname: data.poname,
                        projectName: data.projectName,
                        filename: data.filename,
                        filePath: s3Data.Location
                    },
                };
                db_1.docClient.put(params, (err) => {
                    if (err) {
                        console.error("Unable to add po details", err);
                    }
                });
            }
        });
    }
    catch (e) {
        console.log("hi");
    }
};
exports.insert = insert;
const getAllPOItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "podetails",
    };
    const po = yield db_1.docClient.scan(params).promise();
    return po;
});
exports.getAllPOItems = getAllPOItems;
const getDetailsWithID = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TableName: "podetails",
        Key: {
            ponumber: id,
        },
    };
    const data = (yield db_1.docClient.get(params).promise());
    return data;
});
exports.getDetailsWithID = getDetailsWithID;
const updatePOData = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const itemslist = data.map(({ description, amount, dmrNo = "", raisedAmount = "", date }) => ({
        description: description,
        amount: amount,
        dmrNo: dmrNo,
        raisedAmount: raisedAmount,
        date: date,
    }));
    const params = {
        TableName: "podetails",
        Key: {
            ponumber: id,
        },
        UpdateExpression: "SET #X = :X",
        ExpressionAttributeValues: {
            ":X": itemslist,
        },
        ExpressionAttributeNames: {
            "#X": "details",
        },
    };
    db_1.docClient.update(params).promise();
});
exports.updatePOData = updatePOData;
//# sourceMappingURL=index.js.map