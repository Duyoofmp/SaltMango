const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling=require("../functions");

async function Create(req,res){
    req.body.index=Date.now()
       await dataHandling.Create("Offers",req.body)
     return res.json(true)
  }
  async function  Update(req,res){
    req.body.index=Date.now()
    await dataHandling.Update("Offers",req.body,req.body.DocId)
  return res.json(true)
  }
  async function Delete(req,res){ 
    await dataHandling.Delete("Offers",req.body.DocId)
    return res.json(true)
  }
  
  async function Read(req,res){
    const data=await dataHandling.Read("Offers",req.body.DocId,req.body.index,req.body.Keyword);
    return res.json(data)
  }

  async function CreateCoupon(req,res){
      DocOfferId=req.body.DocOfferId
      await admin.firestore().collection("Offers").doc(DocOfferId).collection("Coupons").add(req.body)
      return res.json(true)
  }
  
  
  // async function  CreateTeam(obj){
  //     await dataHandling.Create("Category",obj)
  //   return true;
  // }
  
  module.exports={
      Create,
      Update,
      Delete,
      Read,
      CreateCoupon
  }
  

