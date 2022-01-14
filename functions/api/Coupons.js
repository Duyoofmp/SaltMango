const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const common = require("../common");
app.use(common.decodeIDToken)


const CouponsFunctions = require('../service/Offers')

app.post('/CreateCoupon', async (req, res) => CouponsFunctions.Create(req, res))

app.post('/ReadCoupon', async (req, res) => CouponsFunctions.Read(req, res))

app.post('/UpdateCoupon', async (req, res) => CouponsFunctions.Update(req, res))

app.post('/DeleteCoupon', async (req, res) => CouponsFunctions.Delete(req, res))




exports.Coupons = functions.region("asia-south1").https.onRequest(app);