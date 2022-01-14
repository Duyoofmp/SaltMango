const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnOfferCreate = functions.firestore
    .document("Offers/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.OfferName, arr)
        return await db.collection("Offers").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnOfferUpdate = functions.firestore
    .document("Country/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.OfferName, arr)
        return await db.collection("Offers").doc(docid).update({ Keywords: arr })

    })


