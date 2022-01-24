const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();
const moment = require("moment");
const dataHandling = require("../../functions");
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const ProfileFunctions = require('../../service/UserServices/Profile')
const UserFunctions = require('../../service/Users')
const common = require("../../common");
app.use(common.decodeIDTokenHeader)

app.post('/UpdateProfile', async (req, res) => {
    req.body.DocId = req.body.UserId;
    return UserFunctions.Update(req, res)
})

app.post('/CheckReferral', async (req, res) => {
    return ProfileFunctions.CheckRefCode(req, res);
})

app.post('/ReadProfile', async (req, res) => {
    req.body.DocId = req.body.UserId;
    return UserFunctions.Read(req, res)
})


// app.post("/CheckDraw", async (req, res) => {
//   const today = moment();
//   const Date = today.subtract(1, "d").format("YYYY-MM-DD");
//   console.log("This will be run every day at 12:05 AM Eastern!");
//   const arr = [];
//   let query;
//   let limit = 0;
//   const settings = await dataHandling.Read("Admin", "Settings");
//   const DailySet = settings.DailyDraw;
//   DailySet.forEach((element) => {
//     limit = limit + element.WinnerLimit;
//   });
//   query = db.collection("DailyDraw").doc(Date).collection("Entry");
//   const dat = [];
//   for (let loop = 0; loop < limit; loop++) {
//     key = query.doc().id;
//     const snapshot = await query
//       .where(admin.firestore.FieldPath.documentId(), ">=", key)
//       .limit(1)
//       .get();
//     if (snapshot.size > 0) {
//       snapshot.forEach((doc) => {
//         if (!arr.includes(doc.data().UserId)) {
//           arr.push(doc.data().UserId);
//           dat.push(doc.data().UserId);
//         } else {
//           limit = limit + 1;
//         }
//       });
//     } else {
//       const snapshots = await query
//         .where(admin.firestore.FieldPath.documentId(), "<", key)
//         .limit(1)
//         .get();

//       snapshots.forEach((doc) => {
//         if (!arr.includes(doc.data().UserId)) {
//           arr.push(doc.data().UserId);
//           dat.push(doc.data().UserId);
//         } else {
//           limit = limit + 1;
//         }
//       });
//     }
//   }
//   console.log(dat.length);
//   f = 0;
//   DailySet.forEach((snap) => {
//     l = f + snap.WinnerLimit;
//     snap.Winners = dat.slice(f, l);
//     f = l;
//   });
//   return await db
//     .collection("DailyDraw")
//     .doc(Date)
//     .update({ WinnersData: DailySet });
// });



exports.Profile = functions.region("asia-south1").https.onRequest(app);