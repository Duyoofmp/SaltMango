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
//     const prom=[];
//     const prom1=[];
//   const  date="2022-01-27";
// const dat=["7iR3id3RIKDcy5NN552C","9e74d2KB9lzXsB4max6O"]
// const draw="Daily"
//     dat.forEach(usrIds=>{
//        prom.push(dataHandling.Read("Users",usrIds))
//      })
//    const usrDatas=  await Promise.all(prom);
// usrDatas.forEach(docs=>{
//   prom1.push(dataHandling.Create("Winners",{...docs,index:Date.now(),WonIn:draw,UserId:docs.DocId,WinDate:date}))
// })
// await Promise.all(prom1);
// res.json(true)
// });



exports.Profile = functions.region("asia-south1").https.onRequest(app);