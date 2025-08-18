import express from "express";
import bootstra from "./app.controller.js";
const app = express();
const port = process.env.PORT;
bootstra(app , express);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

