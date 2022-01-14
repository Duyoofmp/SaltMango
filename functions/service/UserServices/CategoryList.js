const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");

async function Read(req, res) {
    if (req.body.Available === "") {
        const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
        return res.json(data)
    } else {
        const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Available", "==", req.body.Available]);
        return res.json(data)
    }



}
module.exports = {
    Read
}