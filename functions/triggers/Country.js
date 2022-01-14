const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnCountryCreate = functions.firestore
    .document("Countries/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.CountryName, arr)
        return await db.collection("Countries").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnCountryUpdate = functions.firestore
    .document("Countries/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.CountryName, arr)
        return await db.collection("Countries").doc(docid).update({ Keywords: arr })

    })



