const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')
const Counter = require("../distributed_counter");



exports.OnQuestionsCreate = functions.firestore
    .document("QuestionsAndAnswers/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data();
        const arr = [];
        common.createKeywords(data.Question, arr);
        return db.collection("QuestionsAndAnswers").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnQuestionsUpdate = functions.firestore
    .document("QuestionsAndAnswers/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data();
        const arr = [];
        common.createKeywords(data.Question, arr);
        return await db.collection("QuestionsAndAnswers").doc(docid).update({ Keywords: arr })
    })

exports.OnQuestionsDelete = functions.firestore
    .document("QuestionsAndAnswers/{docid}")
    .onDelete(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data();
        const arr = [];
        const counterOperation = new Counter(db.collection("Category").doc(data.CategoryId), "NoOfQuestions")
        return await counterOperation.incrementBy(-1);
    })