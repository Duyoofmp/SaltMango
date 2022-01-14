const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");

async function CheckRefCode(req, res) {
  if (req.body.ReferralCode !== undefined) {
    data = admin.firestore().collection("Users").where("ReferralCode", "==", req.body.ReferralCode)
  }
  return res.json(data.data().Name)
}


// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports = {
  CheckRefCode
}


