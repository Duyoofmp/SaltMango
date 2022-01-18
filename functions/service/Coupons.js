const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const db = admin.firestore()

async function Create(req, res) {
    const index = Date.now();
    const promise = [];
    for (let index = 0; index < req.body.Coupons.length; index++) {
        const element = req.body.Coupons[index];
        element.index = index;
        promise.push(dataHandling.Create(`Offers/${req.body.OfferId}/Coupons`, element));
    }
    await Promise.all(promise);
    return res.json(true)
}

async function Update(req, res) {
    try {
        req.body.index = Date.now()
        await dataHandling.Update(`Offers/${req.body.OfferId}/Coupons`, req.body, req.body.DocId)
        return res.json(true)
    } catch (error) {
        console.log(error)
    }
}

async function Delete(req, res) {
    await dataHandling.Delete(`Offers/${req.body.OfferId}/Coupons`, req.body.DocId)
}

async function Read(req, res) {
    await dataHandling.Read(`Offers/${req.body.OfferId}/Coupons`, req.body.DocId, req.body.index, req.body.Keyword, 30);
    return res.json(data)
}




module.exports = {
    Create,
    Update,
    Delete,
    Read,
}


