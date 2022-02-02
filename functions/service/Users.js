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
  const direct = await dataHandling.Read("Users",undefined, req.body.index, req.body.Keyword, 9999999999, ["DirectReferralId", "==", req.body.DocId])
  const indirect = await dataHandling.Read("Users",undefined, req.body.index, req.body.Keyword, 9999999999, ["IndirectReferralId", "==", req.body.DocId])
  data.DirectReferralsCount =direct.length
  data.InDirectReferralsCount  =indirect.length

  
  if (data.SaltCoin === undefined) {
    data.SaltCoin = 0;
  }
  if (data.Diamond === undefined) {
    data.Diamond = 0;
  }

  return res.json(data)
}



module.exports = {
  Create,
  Update,
  Delete,
  Read
}


