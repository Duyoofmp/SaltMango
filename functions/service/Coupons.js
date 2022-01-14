const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const db = admin.firestore()

async function Create(req, res) {
  req.body.index = Date.now()
  await dataHandling.Create("Coupons", req.body)
  return res.json(true)
}
async function Update(req, res) {
  try {
    req.body.index = Date.now()
    await dataHandling.Update("Coupons", req.body, req.body.DocId)
    return res.json(true)
  }
  catch (error) {
    console.log(error);
  }
}
async function Delete(req, res) {
  await dataHandling.Delete("Coupons", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  const data = await dataHandling.Read("Coupons", req.body.DocId, req.body.index, req.body.Keyword);
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
  CreateCoupon
}


