"use strict";
"// @ts-nocheck";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const index_1 = require("./routes/index");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 9000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const name = 1;
console.log(name);
app.use("/", index_1.router);
// Start the server
app.listen(port, () => {
    console.log(`App running on port ${port}!`);
});
//# sourceMappingURL=app.js.map