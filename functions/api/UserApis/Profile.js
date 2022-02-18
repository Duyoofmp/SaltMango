
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const ProfileFunctions = require('../../service/UserServices/Profile');
const UserFunctions = require('../../service/Users');
const common = require("../../common");
const { FirebaseDynamicLinks } = require('firebase-dynamic-links');

//const {drawWinnerPicker}=require('../../triggers/DailyDraw')
app.use(common.decodeIDTokenHeader)

app.post('/CreateProfile', async (req, res) => {
    const firebaseDynamicLinks = new FirebaseDynamicLinks("AIzaSyBxqDBRaEVxpXuSvG4oLSC_7riZhyMeYtU");
    req.body.DocId = req.body.UserId;
    req.body.MyCode = await UserFunctions.Keygenerator(req.body.UserId);//x9ElBZl
    try {
        const { shortLink, previewLink } = await firebaseDynamicLinks.createLink({
            longDynamicLink: `https://saltmango.page.link/?link=https://saltmango.com/${req.body.MyCode}&apn=com.saltmango.app&ibi=com.saltmango.app`,
        });
        req.body.shortLink = shortLink;
        req.body.previewLink = previewLink;
        req.body.MyLink = shortLink;
        return UserFunctions.Update(req, res)
    } catch (error) {
        const { logger } = require("firebase-functions");
        logger.error(error);
        return res.json(false);
    }
})

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
    req.body.userapi = true
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