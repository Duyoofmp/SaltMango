const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../../functions");

async function Read(req, res) {
    let query
    const data = await admin.firestore().collection("Users").doc(req.body.UserId).get()
    query = data.data()
    return res.json({ Name: query.Name, SaltCoin: query.SaltCoin, Diamond: query.Diamond })
}


async function GetPoints(req, res) {

    const data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId || "");
    if (data === null || data.Answer !== req.body.Answer) {
        return res.json(false);
    }
    await dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(1) }, req.body.UserId);
    return res.json(true);

}

module.exports = {
    Read,
    GetPoints
}


