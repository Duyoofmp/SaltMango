const functions = require("firebase-functions");
const admin = require("firebase-admin");
const db = admin.firestore();
const common = require("../common");
const moment = require("moment-timezone")
const dataHandling = require("../functions");

const runtimeOpts = {
  timeoutSeconds: 540
}
exports.scheduledFunctionForDraws = functions.runWith(runtimeOpts).pubsub
  .schedule("5 0 * * *")
  .timeZone("Asia/Kolkata") // Users can choose timezone - default is America/Los_Angeles
  .onRun(async (context) => {
    const promise = [];
    const yesterday = moment().tz('Asia/Kolkata').subtract(1, "d");
    const Day = yesterday.format("YYYY-MM-DD");
    const weekEnd = yesterday.endOf('week').format("YYYY-MM-DD");
    const monthEnd = yesterday.endOf('month').format("YYYY-MM-DD");
    if (weekEnd === Day) {
      promise.push(drawWinnerPicker("Weekly", Day));
    }
    if (monthEnd === Day) {
      promise.push(drawWinnerPicker("Monthly", Day));
    }
    promise.push(drawWinnerPicker("Daily", Day));
    return Promise.all(promise)
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




async function drawWinnerPicker(draw, date) {
  const arr = [];
  let query;
  let limit = 0;
  const settings = await dataHandling.Read("Admin", "Settings");
  const DrawSet = settings[draw + "Draw"];
  DrawSet.forEach((element) => {
    limit = limit + element.WinnerLimit;
  });
  query = db.collection(draw).doc(date).collection("Entry");
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
    .doc(date)
    .update({ WinnersData: DrawSet,WinnersSelected:true ,index:Date.now()});
   
}

exports.OnWinnerAddOn = functions.firestore
  .document("{Draw}/{DrawId}")
  .onUpdate(async (change, context) => {
    const data=change.after.data();
    const date=moment().tz('Asia/Kolkata').format("YYYY-MM-DD")

    const winners=data.WinnersData
    if(winners!==undefined){
      const dat=[];
      winners.forEach(ele=>{
        dat.push({Winners:ele.Winners,Amount:ele.Amount})
      })
  const prom=[];
  const prom1=[];
  for (let index = 0; index < dat.length; index++) {
    for (let j = 0; j < dat[index].Winners.length; j++) {
      prom.push(dataHandling.Read("Users",dat[index].Winners[j]))
    }
  }
  const usrDatas=  await Promise.all(prom);
  for (let i = 0; i < usrDatas.length; i++) {
   for (let k = 0; k < dat.length; k++) {
    if(dat[k].Winners.includes(usrDatas[i].DocId)){
      usrDatas[i].RewardCoins=dat[k].Amount
            }
   }
   prom1.push(dataHandling.Create("Winners",{...usrDatas[i] ,index:Date.now(),WonIn:draw,UserId:usrDatas[i].DocId,WinDate:date}))

    
  }
  return await Promise.all(prom1);
    }
    return 0;
})