const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions")

async function Create(req,res){
  req.body.index=Date.now()
  await dataHandling.Create("Category",req.body)
  return res.json(true)
}
async function  Update(req,res){
req.body.index=Date.now()
await dataHandling.Update("Category",req.body,req.body.DocId)
return res.json(true)
}
async function Delete(req,res){ 
  await dataHandling.Delete("Category",req.body.DocId)
  return res.json(true)
}

async function Read(req,res){
  const data=await dataHandling.Read("Category",req.body.DocId,req.body.index,req.body.Keyword,req.body.limit,["CountryId","==",req.body.CountryId]);
  return res.json(data)
}




// async function  CreateTeam(obj){
//     await dataHandling.Create("Category",obj)
//   return true;
// }

module.exports={
    Create,
    Update,
    Delete,
    Read
}
