const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions")

async function Create(req, res) {
  req.body.index = Date.now()
  const check = await dataHandling.WhereGet("Category", "CategoryName", req.body.CategoryName, req.body.DocId)
  if (check) {
    await dataHandling.Create("Category", req.body)
    return res.json(true)
  } else {
    return res.json("Category name already exists!")
  }
}
async function Update(req, res) {
  req.body.index = Date.now()
  const check = await dataHandling.WhereGet("Category", "CategoryName", req.body.CategoryName, req.body.DocId)
  if (check) {
    await dataHandling.Update("Category", req.body, req.body.DocId)
    return res.json(true)
  } else {
    return res.json("Category name already exists")
  }
}
async function Delete(req, res) {
  await dataHandling.Delete("Category", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  if(req.body.Available===""){
    const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit);
    return res.json(data)
  }else{
    const data = await dataHandling.Read("Category", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit,["Available", "==", req.body.Available]);
  return res.json(data)
}
  
  }
  




// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports = {
  Create,
  Update,
  Delete,
  Read
}
