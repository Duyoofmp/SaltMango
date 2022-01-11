const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const QuestionsFunctions=require('../UserServices/Questions')
const common = require("../common");
app.use(common.decodeIDTokenHeader)

app.post('/ReadUserQuestions', async (req, res) => QuestionsFunctions.Read(req, res))

// const runtimeOpts = {
//     minInstances: 1,
//     memory: "128MB"
//   }

  exports.UserQuestions = functions.region("asia-south1").https.onRequest(app);
