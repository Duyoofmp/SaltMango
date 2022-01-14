const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const CategoryFunctions = require('../../service/Category')
const common = require("../../common");
//app.use(common.decodeIDTokenHeader)


app.post('/ReadCategories', async (req, res) => CategoryFunctions.Read(req, res))

exports.CategoryList = functions.region("asia-south1").https.onRequest(app);