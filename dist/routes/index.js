"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const uploadPdf_1 = require("../utils/uploadPdf");
const router = express_1.default.Router();
exports.router = router;
router.get('/hi', (req, res) => {
    res.send("hello router1");
});
//routes for Home Page in frontend
//insert Po details
router.post('/poDetails', uploadPdf_1.upload, controllers_1.podetails);
//routes for RaiseDMR
router.get('/getAllItems', controllers_1.getAllPO);
router.get('/getdetails/:id', controllers_1.getDetails);
router.patch('/poDetails/:id', controllers_1.updateDetails);
//# sourceMappingURL=index.js.map