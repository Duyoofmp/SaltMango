const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
 app.use(common.decodeIDToken)


const OffersFunctions=require('../AdminServices/Offers')

app.post('/CreateOffers', async (req, res) =>OffersFunctions.Create(req, res))

app.post('/ReadOffers', async (req, res) => OffersFunctions.Read(req, res))

app.post('/UpdateOffers', async (req, res) => OffersFunctions.Update(req, res))

app.post('/DeleteOffers', async (req, res) => OffersFunctions.Delete(req, res))

app.post('/CreateCoupon', async (req, res) => OffersFunctions.CreateCoupon(req, res))



exports.Offers = functions.region("asia-south1").https.onRequest(app);