const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')


exports.OnUsersCreate = functions.firestore
    .document("Users/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.Name, arr)
        let code = common.Keygenerator(4)
        let ref = docid.substring(0, 3);
        let refcode = code + ref;
        return await db.collection("Users").doc(docid).update({ DocId: docid, Keywords: arr, ReferralCode: refcode })
    })


exports.OnUsersUpdate = functions.firestore
    .document("Users/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.Name, arr)
        return await db.collection("Users").doc(docid).update({ Keywords: arr })

    })