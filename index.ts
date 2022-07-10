import express, { json } from "express";
import cors from "cors";
import "express-async-errors";
import chalk from "chalk";
import dotenv from "dotenv";
import router from "./src/router/index.js";
dotenv.config();

const app = express();

app.use(json());
app.use(cors());
app.use( router );

app.listen(process.env.PORT || 4000, () => {
    console.log(chalk.green(`API is running in port ${process.env.PORT}`));
});