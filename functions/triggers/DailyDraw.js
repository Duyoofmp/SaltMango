const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment");
const dataHandling = require("../functions");

const { database } = require("firebase-admin");

exports.scheduledFunctionForDailyDraw = functions.pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const today = moment();
    const Date = today.subtract(1, "d").format("YYYY-MM-DD");
    console.log("This will be run every day at 12:05 AM Eastern!");
    const arr = [];
    let query;
    let limit = 0;
    const settings = await dataHandling.Read("Admin", "Settings");
    const DailySet = settings.DailyDraw;
    DailySet.forEach((element) => {
      limit = limit + element.WinnerLimit;
    });
    query = db.collection("DailyDraw").doc(Date).collection("Entry");
    const dat = [];
    for (let loop = 0; loop < limit; loop++) {
      key = query.doc().id;
      const snapshot = await query
        .where(admin.firestore.FieldPath.documentId(), ">=", key)
        .limit(1)
        .get();
      if (snapshot.size > 0) {
        snapshot.forEach((doc) => {
          if (!arr.includes(doc.data().UserId)) {
            arr.push(doc.data().UserId);
            dat.push(doc.data().UserId);
          } else {
            limit = limit + 1;
          }
        });
      } else {
        const snapshots = await query
          .where(admin.firestore.FieldPath.documentId(), "<", key)
          .limit(1)
          .get();

        snapshots.forEach((doc) => {
          if (!arr.includes(doc.data().UserId)) {
            arr.push(doc.data().UserId);
            dat.push(doc.data().UserId);
          } else {
            limit = limit + 1;
          }
        });
      }
    }
   let f = 0;
    DailySet.forEach((snap) => {
    let  l = f + snap.WinnerLimit;
      snap.Winners = dat.slice(f, l);
      f = l;
    });
    return await db
      .collection("DailyDraw")
      .doc(Date)
      .update({ WinnersData: DailySet });
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
