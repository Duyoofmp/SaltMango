const dataHandling = require("../functions");

async function Create(req, res) {
  req.body.index = Date.now();
  req.body.NoOfQuestions = 0;
  await dataHandling.Create("Category", req.body);
  return res.json(true);
}

async function Update(req, res) {
  await dataHandling.Update("Category", req.body, req.body.DocId);
  return res.json(true);
}
async function Delete(req, res) {
  await dataHandling.Delete("Category", req.body.DocId);
  return res.json(true);
}

async function Read(req, res) {
  if (req.body.Available === "" || req.body.Available === undefined) {
    const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
    return res.json(data);
  } else {
    if(req.body.userapi){
      const data = await dataHandling.Read("Category", undefined, req.body.DocId, req.body.Keyword, req.body.limit, ["Available", "in", [req.body.Available, "Both"],"Active","==",true]);
    return res.json(data);

    }else{
      const data = await dataHandling.Read("Category", undefined, req.body.DocId, req.body.Keyword, req.body.limit, ["Available", "in", [req.body.Available, "Both"]]);
      return res.json(data);

    }
  }

}




module.exports = {
  Create,
  Update,
  Delete,
  Read
};
