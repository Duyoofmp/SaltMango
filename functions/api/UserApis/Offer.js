const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore()

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const Offer = require('../../service/UserServices/Offer')
const common = require("../../common");
// app.use(common.decodeIDTokenHeader)



app.post('/ReadCountry', async (req, res) => Offer.ReadCountry(req, res))
app.post('/ReadOffers', async (req, res) => Offer.ReadOffers(req, res))
app.post('/BuyOffer', async (req, res) => Offer.BuyOffer(req, res))


exports.Offer = app;
