const { watchFile, readFile } = require("fs");

const express = require("express");
const router = express.Router();

let dueDates = require("../data/dueDates.json");

watchFile(process.env.NPR_FILE_LOCATION || "./data/dueDates.json", (current, previous) => {
    readFile(process.env.NPR_FILE_LOCATION || "./data/dueDates.json", (err, data) => {
        if(err != null) { console.error(err); return; }
        dueDates = JSON.parse(data.toString());
    })
});

router.get("/website/:hostnameBase64", (req, res) => {
    const hostname = Buffer.from(req.params.hostnameBase64, "base64").toString();
    if(!(/^[\x00-\xFF]*$/.test(hostname))) { res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }
    if(req.header("Origin") == null) { console.log(`[/website/:hostname] Request from ${req.ip} tried to get ${hostname} payments status with ${!!req.header("Origin") ? "Origin header set to " + req.header("Origin") : "no Origin header"}`); res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }

    const originHeaderUrl = new URL(req.header("Origin"))
    if(originHeaderUrl.hostname !== hostname) {
        res.status(400).json({ status: 400, message: "Bad request" }).end();
        console.log(`[/website/:hostname] Request from ${req.ip} tried to get ${hostname} payments status with ${!!req.header("Origin") ? "Origin header set to " + req.header("Origin") : "no Origin header"}`);
        return;
    }

    if(dueDates[hostname] == null) { res.status(200).json({ paid: true }).end(); console.warn(`[/website/:hostname] Website ${hostname} not found on due dates. Returning {"paid":true}`) }

    const hostnameData = dueDates[hostname];
    res.status(200).json(hostnameData).end();
})

router.get("/failure/:hostnameBase64", (req, res) => {
    const hostname = Buffer.from(req.params.hostnameBase64, "base64").toString();
    if(!(/^[\x00-\xFF]*$/.test(hostname))) { res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }
    if(req.header("Origin") == null) { console.log(`[/website/:hostname] Request from ${req.ip} tried to report a failure of ${hostname} with ${!!req.header("Origin") ? "Origin header set to " + req.header("Origin") : "no Origin header"}`); res.status(400).json({ status: 400, message: "Bad request" }).end(); return; }

    const originHeaderUrl = new URL(req.header("Origin"))
    if(originHeaderUrl.hostname !== hostname) {
        res.status(400).json({ status: 400, message: "Bad request" }).end();
        console.log(`[/website/:hostname] Request from ${req.ip} tried to report a failure of ${hostname} with ${!!req.header("Origin") ? "Origin header set to " + req.header("Origin") : "no Origin header"}`);
        return;
    }

    console.warn(`[/failure/:hostname] Failure at ${hostname} reported`);

    res.status(200).json({ status: 200, message: "Logged" }).end();
})

module.exports = router;
