const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

// const common = require("../common");
// app.use(common.decodeIDToken)


const UsersFunctions=require('../services/Users')

app.post('/CreateUsers', async (req, res) => UsersFunctions.Create(req, res))

app.post('/ReadUsers', async (req, res) => UsersFunctions.Read(req, res))

app.post('/UpdateUsers', async (req, res) => UsersFunctions.Update(req, res))

app.post('/DeleteUsers', async (req, res) => UsersFunctions.Delete(req, res))


const runtimeOpts = {
    minInstances: 1,
    memory: "128MB"
  }
  exports.Users = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);