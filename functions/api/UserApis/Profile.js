const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const ProfileFunctions = require('../../service/UserServices/Profile')
const UserFunctions = require('../../service/Users')
const common = require("../../common");
//app.use(common.decodeIDTokenHeader)       

app.post('/CreateProfile', async (req, res) => {
    return UserFunctions.Create(req, res)
})

app.post('/CheckReferral', async (req, res) => {
    return ProfileFunctions.CheckRefCode(req, res);
})
app.post('/ReadProfile', async (req, res) => ProfileFunctions.Read(req, res))

app.post('/UpdateProfile', async (req, res) => ProfileFunctions.Update(req, res))



exports.Profile = functions.region("asia-south1").https.onRequest(app);