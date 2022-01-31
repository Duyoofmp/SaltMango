const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const common = require('../common')



exports.OnCategoryCreate = functions.firestore
    .document("Category/{docid}")
    .onCreate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.data()
        const arr = [];
        common.createKeywords(data.CategoryName, arr)
        return await db.collection("Category").doc(docid).update({ DocId: docid, Keywords: arr })
    })


exports.OnCategoryUpdate = functions.firestore
    .document("Category/{docid}")
    .onUpdate(async (change, context) => {
        const docid = context.params.docid;
        const data = change.after.data()
        const arr = [];
        if(data.NoOfQuestions===0){
            await db.collection("Category").doc(docid).update({Active:false})
        }
        common.createKeywords(data.CategoryName, arr)
        return await db.collection("Category").doc(docid).update({ Keywords: arr })

    })



