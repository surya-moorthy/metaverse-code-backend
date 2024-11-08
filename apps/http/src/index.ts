import express from "express";
import { router } from "./routes/v1";
const prisma = require( "@repo/db/client");
import bodyParser from "body-parser";
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use("/api/v1", router)

app.listen(process.env.PORT || 3000)