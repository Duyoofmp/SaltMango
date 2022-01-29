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
  if (data.SaltCoins === undefined) {
    data.SaltCoins = 0;
  }
  if (data.Diamonds === undefined) {
    data.Diamonds = 0;
  }

  return res.json(data)
}



module.exports = {
  Create,
  Update,
  Delete,
  Read
}


