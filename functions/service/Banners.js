const dataHandling = require("../functions");

async function Create(req, res) {
  const temp = [];
  req.body.Banners.forEach((element, index) => {
    element.index = Date.now() + index;
    temp.push(dataHandling.Create("Banners", element))
  });
  await Promise.all(temp)
  return res.json(true)
}

async function Update(req, res) {
  await dataHandling.Update("Banners", req.body, req.body.DocId)
  return res.json(true)
}

async function Delete(req, res) {
  await dataHandling.Delete("Banners", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  if (req.body.userapi) {
    const data = await dataHandling.Read("Banners", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, ["Active", "==", true]);
    return res.json(data);
  }
  const data = await dataHandling.Read("Banners", req.body.DocId, req.body.index, req.body.Keyword, 1000);
  return res.json(data)
}





module.exports = {
  Create,
  Update,
  Delete,
  Read
}


