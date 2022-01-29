
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const ProfileFunctions = require('../../service/UserServices/Profile');
const UserFunctions = require('../../service/Users');
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


exports.Profile = app;