const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const db = admin.firestore()

async function Create(req, res) {
  req.body.index = Date.now()
  await dataHandling.Create("Offers", req.body)
  return res.json(true)
}
async function Update(req, res) {
  try {
    req.body.index = Date.now()
    await dataHandling.Update("Offers", req.body, req.body.DocId)
    return res.json(true)
  }
  catch (error) {
    console.log(error);
  }
}
async function Delete(req, res) {
  await dataHandling.Delete("Offers", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  if (req.body.CountryId === "") {
    const data = await dataHandling.Read("Offers", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
    return res.json(data)
  } else {
    const data = await dataHandling.Read("Offers", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["CountryId", "==", req.body.CountryId]);
    return res.json(data)
  }
}

async function CreateCoupon(req, res) {
  req.body.index = Date.now();
  await dataHandling.Create(`Offers/${req.body.OfferId}/Coupons`, req.body)
  return res.json(true)
}

async function UpdateCoupon(req, res) {
  try {
    req.body.index = Date.now()
    await dataHandling.Update(`Offers/${req.body.OfferId}/Coupons`, req.body, req.body.DocId)
    return res.json(true)
  } catch (error) {
    console.log(error)
  }
}

async function DeleteCoupon(req, res) {
  await dataHandling.Delete(`Offers/${req.body.OfferId}/Coupons`, req.body.DocId)
}

async function ReadCoupon(req, res) {
  await dataHandling.Read(`Offers/${req.body.OfferId}/Coupons`, req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
  return res.json(data)
}




// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports = {
  Create,
  Update,
  Delete,
  Read,
  CreateCoupon,
  UpdateCoupon,
  DeleteCoupon,
  ReadCoupon
}


