const functions = require('firebase-functions');
const dataHandling = require("../functions");



async function UpdateSettings(req, res) {
    await dataHandling.Update("Admin", req.body, "Settings");
    return res.json(true);
}


async function ReadSettings(req, res) {
    const data = await dataHandling.Read("Admin", "Settings");
    return res.json(data);
}




module.exports = {
    UpdateSettings,
    ReadSettings,
};
