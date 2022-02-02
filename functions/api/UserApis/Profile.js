
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const ProfileFunctions = require('../../service/UserServices/Profile');
const UserFunctions = require('../../service/Users');
const common = require("../../common");

//const {drawWinnerPicker} =require('../../triggers/DailyDraw')
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

app.post('/ReadBanners', async (req, res) => {
    const BannerFunctions_Read = require('../../service/Banners').Read;
    req.body.userapi=true
    BannerFunctions_Read(req, res)
})

// app.post('/Check', async (req, res) => {
//     const promise = [];

//    // const yesterday = moment().tz('Asia/Kolkata').subtract(1, "d");
//     const Day = "2022-02-05";
//     // const weekEnd = yesterday.endOf('week').format("YYYY-MM-DD");
//     // const monthEnd = yesterday.endOf('month').format("YYYY-MM-DD");
//     // if (weekEnd === Day) {
//     //   promise.push(drawWinnerPicker("Weekly", Day));
//     // }
//     // if (monthEnd === Day) {
//     //   promise.push(drawWinnerPicker("Monthly", Day));
//     // }

//    promise.push(drawWinnerPicker("Weekly", Day));
//    await  Promise.all(promise)
//      return res.json(true)
     
     
//  })


exports.Profile = app;