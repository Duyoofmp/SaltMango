const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment");
const dataHandling = require("../functions");

const { database } = require("firebase-admin");

exports.scheduledFunctionForDraws = functions.pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const promise=[];
    const today = moment().tz('Asia/Kolkata');
    const Day = today.subtract(1, "d").format("YYYY-MM-DD");
    const weekEnd=today.endOf('week').format("YYYY-MM-DD")
    const monthEnd=today.endOf('month').format("YYYY-MM-DD")
    if(weekEnd===Day){
promise.push(common.drawWinnerPicker("Weekly",Day))
    }
    if(monthEnd===Day){
     promise.push(common.drawWinnerPicker("Monthly",Day))
    }
    promise.push(common.drawWinnerPicker("Daily",Day))
    console.log("This will be run every day at 12:05 AM Eastern!");
  return  await Promise.all(promise)
  });

exports.OnEntryCreate = functions.firestore
  .document("Daily/{DrawId}/Entry/{docid}")
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
