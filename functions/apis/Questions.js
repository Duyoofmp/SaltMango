const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

//const common = require("../common");
//app.use(common.decodeIDToken)


const QuestionsFunctions=require('../services/Questions')

app.post('/CreateQuestions', async (req, res) => QuestionsFunctions.Create(req, res))

app.post('/ReadQuestions', async (req, res) => QuestionsFunctions.Read(req, res))

app.post('/UpdateQuestions', async (req, res) => QuestionsFunctions.Update(req, res))

app.post('/DeleteQuestions', async (req, res) => QuestionsFunctions.Delete(req, res))


const runtimeOpts = {
    minInstances: 1,
    memory: "128MB"
  }
  exports.Questions = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);