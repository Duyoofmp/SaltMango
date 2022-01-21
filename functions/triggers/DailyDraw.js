const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment");
const { database } = require("firebase-admin");

exports.scheduledFunctionForDailyDraw = functions.pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const today = moment();
    const arr = [];
    const dat=[];
    let query;
    let loop = 4;
    const Date = today.subtract(1, "d").format("YYYY-MM-DD");
    console.log(Date);
    console.log("This will be run every day at 12:05 AM Eastern!");
    query = db.collection("DailyDraw").doc(Date).collection("Entry");
    for (let index = 0; index < loop; index++) {
      key = query.doc().id;
      const snapshot = await query
        .where(admin.firestore.FieldPath.documentId(), ">=", key)
        .limit(1)
        .get();
      if (snapshot.size > 0) {
        snapshot.forEach((doc) => {
          if (!arr.includes(doc.id)) {
            arr.push(doc.id);
            dat.push(doc.data().UserId)
          } else {
            loop = loop + 1;
          }
        });
      } else {
        const snapshots = await query
          .where(admin.firestore.FieldPath.documentId(), "<", key)
          .limit(1)
          .get();

        snapshots.forEach((doc) => {
          if (!arr.includes(doc.id)) {
            arr.push(doc.id);
            dat.push(doc.data().UserId)

          } else {
            loop = loop + 1;
          }
        });
      }
    }
return await db.collection("DailyDraw").doc(Date).update({Winners:dat})
  });

exports.OnEntryCreate = functions.firestore
  .document("DailyDraw/{DrawId}/Entry/{docid}")
  .onCreate(async (change, context) => {
    const docid = context.params.docid;
    const DrawId = context.params.DrawId;
    return db
      .doc(`DailyDraw/${DrawId}/Entry/${docid}`)
      .update({ DocId: docid });
  });
exports.OnDailyCreate = functions.firestore
  .document("DailyDraw/{DrawId}")
  .onCreate(async (change, context) => {
    const DrawId = context.params.DrawId;
    return db.collection("DailyDraw").doc(DrawId).update({ DocId: docid });
  });
