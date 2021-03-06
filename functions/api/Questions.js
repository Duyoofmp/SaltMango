
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
app.use(common.decodeIDToken)


const QuestionsFunctions = require('../service/Questions')

app.post('/CreateQuestions', async (req, res) => QuestionsFunctions.Create(req, res))

app.post('/ReadQuestions', async (req, res) => QuestionsFunctions.Read(req, res))

app.post('/UpdateQuestions', async (req, res) => QuestionsFunctions.Update(req, res))

app.post('/DeleteQuestions', async (req, res) => QuestionsFunctions.Delete(req, res))

//app.post('/CheckAnswer',async(req,res)=> QuestionsFunctions.Check(req,res))


// const runtimeOpts = {
//     minInstances: 1,
//     memory: "128MB"
//   }
exports.Questions = app;