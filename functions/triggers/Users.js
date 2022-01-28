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
        Keygenerator()
        async function Keygenerator() {
            let generator = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyskiouhjnmbhj'

            for (let i = 0; i < 4; i++) {
                generator += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            let array = generator;
            const code = await admin.firestore().collection("Users").where("MyCode", "==", array).limit(1).get();
            if (code.size === 0) {
                let ref = docid.substring(0, 3);
                let refcode = array + ref;
                await admin.firestore().collection("Users").doc(docid).update({
                    MyCode: refcode
                })
            }
            else {
                Keygenerator()
            }
        }
        return db.collection("Users").doc(docid).update({ DocId: docid, Keywords: arr, SaltCoin: 0, Diamond: 0 })
    })


exports.OnUsersUpdate = functions.firestore
    .document("Users/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        common.createKeywords(data.Name, arr)
        return db.collection("Users").doc(docid).update({ Keywords: arr })

    })