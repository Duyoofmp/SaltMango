const dataHandling = require("../functions");

async function Create(req, res) {
  req.body.index = Date.now()
  await dataHandling.Create("Users", req.body)
  return res.json(true)
}
async function Update(req, res) {
  req.body.index = Date.now()
  await dataHandling.Update("Users", req.body, req.body.DocId)
  return res.json(true)
}
async function Delete(req, res) {
  await dataHandling.Delete("Users", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  const data = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword);
  const direct = await dataHandling.Read("Users", undefined, req.body.index, req.body.Keyword, 9999999999, ["DirectReferralId", "==", req.body.DocId])
  const indirect = await dataHandling.Read("Users", undefined, req.body.index, req.body.Keyword, 9999999999, ["IndirectReferralId", "==", req.body.DocId])
  data.DirectReferralsCount = direct.length
  data.InDirectReferralsCount = indirect.length


  if (data.SaltCoin === undefined) {
    data.SaltCoin = 0;
  }
  if (data.Diamond === undefined) {
    data.Diamond = 0;
  }

  return res.json(data)
}

async function Keygenerator() {
  let generator = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyskiouhjnmbhj'

  for (let i = 0; i < 4; i++) {
    generator += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  let array = generator;
  const code = await admin.firestore().collection("Users").where("MyCode", "==", array).limit(1).get();
  if (code.size === 0) {
    let ref = docid.substring(0, 3);
    let refcode = array + ref;
    return refcode;
  }
  else {
    return Keygenerator()
  }
}

module.exports = {
  Create,
  Update,
  Delete,
  Read,
  Keygenerator,
}


