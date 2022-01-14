const functions = require('firebase-functions');
const admin = require('firebase-admin');
//const dataHandling = require("../functions");

async function CheckRefCode(req, res) {
  if (req.body.ReferralCode !== undefined) {
    const dat = await admin.firestore().collection("Users").where("ReferralCode", "==", req.body.ReferralCode).limit(1).get();
    if (dat.size > 0) {
      const dataa = dat.docs[0].data();
      return res.json(dataa.Name);
    }
    else {
      return res.json(false)
    }
  }
  else {
    return res.json(false)
  }


}


// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports = {
  CheckRefCode
}


