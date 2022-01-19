const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");



async function UpdateSettings(req, res) {
    await dataHandling.Update("Admin", req.body, "Settings");
    return res.json(true);
}


async function ReadSettings(req, res) {

    const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Available", "==", req.body.Available]);
    return res.json(data);

}




module.exports = {
    UpdateSettings,
    ReadSettings,
};
