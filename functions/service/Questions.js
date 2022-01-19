const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
// const { Category } = require('..');
const db = admin.firestore();
//const { database } = require('firebase-functions/v1/firestore');


async function Create(req, res) {
  try {

    const temp = []
    const query = await db.collection("Category").doc(req.body.CategoryId).get();
    let no = query.data().NoOfQuestions;
    const id = query.data().DocId;
    req.body.Questions.forEach(element => {
      no = no + 1
      element.index = Date.now();
      element.CategoryId = req.body.CategoryId;
      element.QuestionNumber = no
      temp.push(dataHandling.Create("QuestionsAndAnswers", element))
    });

    temp.push(dataHandling.Update("Category", { NoOfQuestions: no }, id))
    await Promise.all(temp)
    return res.json(true)
  } catch (error) {
    console.log(error)
  }


}
async function Update(req, res) {
  req.body.index = Date.now()
  await dataHandling.Update("QuestionsAndAnswers", req.body, req.body.DocId)
  return res.json(true)

}

async function Delete(req, res) {
  await dataHandling.Delete("QuestionsAndAnswers", req.body.DocId)
  return res.json(true)
}

async function Read(req, res) {
  let data;
  if (req.body.CategoryId === undefined) {
    data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId, req.body.index, req.body.Keyword);
  } else {
    data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId, req.body.index, req.body.Keyword, 10, ["CategoryId", "==", req.body.CategoryId]);      // (data.Options).push(data.Answer);
  }
  return res.json(data);
}

async function Check(req, res) {
  let msg = await dataHandling.Check("QuestionsAndAnswers", req.body.DocId, req.body.Answer)
  return res.json(msg)
}

function getRndInteger(max, arr, limit = 10, min = 1) {
  for (let index = 0; index < limit; index++) {
    arr.push(Math.floor(Math.random() * (max - min)) + min);
  }
}


async function ReadRandomQuestions(req, res) {
  const CategoryData = await dataHandling.Read("Category", req.body.DocId);
  const RandomNumbers = [];
  getRndInteger(CategoryData.NoOfQuestions, RandomNumbers)
  if (req.body.CategoryId === undefined) {
  } else {
    data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId, req.body.index, req.body.Keyword, 10, ["CategoryId", "==", req.body.CategoryId]);      // (data.Options).push(data.Answer);
  }
  return res.json(data);
}

module.exports = {
  Create,
  Update,
  Delete,
  Read,
  Check
}