const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnQuestionCreate = functions.firestore
    .document("QuestionsAndAnswers/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        return await db.collection("QuestionsAndAnswers").doc(docid).update({ DocId: docid})
    })
