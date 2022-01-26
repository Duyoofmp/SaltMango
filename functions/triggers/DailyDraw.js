const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment");
const dataHandling = require("../functions");

const { database } = require("firebase-admin");

const runtimeOpts = {
  timeoutSeconds:540
  }
exports.scheduledFunctionForDraws = functions.runtimeOpts(runtimeOpts).pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const promise=[];
    const today = moment().tz('Asia/Kolkata');
    const Day = today.subtract(1, "d").format("YYYY-MM-DD");
    const weekEnd=today.endOf('week').format("YYYY-MM-DD")
    const monthEnd=today.endOf('month').format("YYYY-MM-DD")
    if(weekEnd===Day){
promise.push(drawWinnerPicker("Weekly",Day))
    }
    if(monthEnd===Day){
     promise.push(drawWinnerPicker("Monthly",Day))
    }
    promise.push(drawWinnerPicker("Daily",Day))
    console.log("This will be run every day at 12:05 AM Eastern!");
  return  await Promise.all(promise)
  });

exports.OnEntryCreate = functions.firestore
  .document("{Draw}/{DrawId}/Entry/{docid}")
  .onCreate(async (change, context) => {
    const docid = context.params.docid;
    const DrawId = context.params.DrawId;
    const Draw = context.params.Draw;

    return db
      .doc(`${Draw}/${DrawId}/Entry/${docid}`)
      .update({ DocId: docid });
  });


exports.OnDrawCreate = functions.firestore
  .document("{Draw}/{DrawId}")
  .onCreate(async (change, context) => {
    const DrawId = context.params.DrawId;
    return db.collection(context.params.Draw).doc(DrawId).update({ DocId: docid });
  });


  
async function drawWinnerPicker(draw,Date){
  const arr = [];
    let query;
    let limit = 0;
    const settings = await dataHandling.Read("Admin", "Settings");
    const DrawSet = settings.draw+"Draw";
    DrawSet.forEach((element) => {
      limit = limit + element.WinnerLimit;
    });
    query = db.collection(draw).doc(Date).collection("Entry");
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
    DrawSet.forEach((snap) => {
      let l = f + snap.WinnerLimit;
      snap.Winners = dat.slice(f, l);
      f = l;
    });
    return await db
      .collection(draw)
      .doc(Date)
      .update({ WinnersData: DrawSet });
}
