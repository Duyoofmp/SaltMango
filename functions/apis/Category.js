const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

//const common = require("../common");
//app.use(common.decodeIDToken)


const CategoryFunctions=require('../services/Category')

app.post('/CreateCategory', async (req, res) => CategoryFunctions.Create(req, res))

app.post('/ReadCategory', async (req, res) => CategoryFunctions.Read(req, res))

app.post('/UpdateCategory', async (req, res) => CategoryFunctions.Update(req, res))

app.post('/DeleteCategory', async (req, res) => CategoryFunctions.Delete(req, res))


const runtimeOpts = {
    minInstances: 1,
    memory: "128MB"
  }
  exports.Category = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);
