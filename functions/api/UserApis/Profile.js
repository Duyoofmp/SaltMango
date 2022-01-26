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


app.post("/CheckDraw", async (req, res) => {
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



exports.Profile = functions.region("asia-south1").https.onRequest(app);