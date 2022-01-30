const functions = require('firebase-functions');
const admin = require('firebase-admin');
const common = require('../../common')
//const dataHandling = require("../functions");

async function CheckRefCode(req, res) {
  if (req.body.ReferralCode !== undefined) {
    const dat = await admin.firestore().collection("Users").where("MyCode", "==", req.body.ReferralCode).limit(1).get();
    if (dat.size > 0) {
      const dataa = dat.docs[0].data();
      return res.json(dataa.Name);
    }
    else {
      return res.json("")
    }
  }
  else {
    return res.json("")
  }


}


// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports = {
  CheckRefCode
}


