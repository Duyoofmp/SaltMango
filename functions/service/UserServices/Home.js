const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");

async function Read(req, res) {
    let query
    const data = await admin.firestore().collection("Users").doc(req.body.UserId).get()
    query = data.data()
    return res.json({ Name: query.Name, SaltCoin: query.SaltCoin, Diamond: query.Diamond })
}
module.exports = {
    Read
}