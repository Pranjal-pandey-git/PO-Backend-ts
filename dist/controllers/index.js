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
exports.updateDetails = exports.getDetails = exports.getAllPO = exports.podetails = void 0;
const services_1 = require("../services");
const podetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = JSON.parse(req.body.details);
        if (req.file) {
            (0, services_1.insert)(details, req.file);
            res.sendStatus(201).json({ msg: 'Created Successfully' });
        }
        else {
            res.sendStatus(404).json({ msg: 'Not Created' });
        }
    }
    catch (err) {
        console.log(err, 'Podetails Function');
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
});
exports.podetails = podetails;
const getAllPO = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, services_1.getAllPOItems)();
        if (data) {
            res.status(200).send(data.Items);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        console.log(err, 'Podetails Function');
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
});
exports.getAllPO = getAllPO;
const getDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = yield (0, services_1.getDetailsWithID)(id);
        if (data) {
            res.status(200).send(data.Item);
        }
        else {
            res.sendStatus(404);
        }
    }
    catch (err) {
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
});
exports.getDetails = getDetails;
const updateDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const data = req.body;
        (0, services_1.updatePOData)(id, data);
        res.status(200).send('Updated successfully.');
    }
    catch (err) {
        res.sendStatus(404).json({ msg: 'something went wrong' });
    }
});
exports.updateDetails = updateDetails;
//# sourceMappingURL=index.js.map