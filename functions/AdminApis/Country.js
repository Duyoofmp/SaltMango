const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
 app.use(common.decodeIDToken)


const CountryFunctions=require('../AdminServices/Country')

app.post('/CreateCountry', async (req, res) =>CountryFunctions.Create(req, res))

app.post('/ReadCountry', async (req, res) => CountryFunctions.Read(req, res))

app.post('/UpdateCountry', async (req, res) => CountryFunctions.Update(req, res))

app.post('/DeleteCountry', async (req, res) => CountryFunctions.Delete(req, res))




exports.Countries = functions.region("asia-south1").https.onRequest(app);