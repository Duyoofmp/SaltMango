const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// const HomeFunctions = require('../../service/UserServices/Home')
const common = require("../../common");
app.use(common.decodeIDTokenHeader)

// app.post('/ReadDetails', async (req, res) => HomeFunctions.Read(req, res));

 const CategoryFunctionsRead = require('../../service/Category').Read;
 const ReadRandomQuestions = require('../../service/Questions').ReadRandomQuestions;

 app.post('/ReadCategories', async (req, res) => CategoryFunctionsRead(req, res));

 app.post('/ReadUserQuestions', async (req, res) => ReadRandomQuestions(req, res))



exports.Home = functions.region("asia-south1").https.onRequest(app);