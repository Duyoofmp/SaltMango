const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
app.use(common.decodeIDToken)


const AdminFunctions = require('../service/Admin')

app.post('/UpdateSettings', async (req, res) => AdminFunctions.UpdateSettings(req, res))

app.post('/ReadSettings', async (req, res) => AdminFunctions.ReadSettings(req, res))


exports.Admin = functions.region("asia-south1").https.onRequest(app);
