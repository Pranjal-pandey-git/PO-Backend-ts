
import express, { Express } from 'express';
import cors from 'cors';

import { router as routes } from "./routes/index";

import dotenv from 'dotenv';
dotenv.config()
const app: Express = express();
const port = process.env.PORT || 9000;
app.use(express.json());
app.use(cors());

app.use("/", routes);

// Start the server
app.listen(port, (): void => {
    console.log(`App running on port ${port}!`);
});
