const express = require("express");
const app = express();

const api = require("./api");

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})

app.use("/api/v1", api);

app.listen(process.env.NPR_PORT || 7090, () => {
    console.log(`[App] Listening on ${process.env.NPR_PORT || 7090}`);
})
