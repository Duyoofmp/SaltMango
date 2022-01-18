const functions = require('firebase-functions');
const admin = require('firebase-admin');
const dataHandling = require("../functions");
const db = admin.firestore();
//const { database } = require('firebase-functions/v1/firestore');


async function Create(req, res) {
  try {

    const temp = []
    const query = await db.collection("Category").where("CategoryName", "==", req.body.CategoryName).limit(1).get();
    let no = query.docs[0].data().NoOfQuestions;
    const id = query.docs[0].data().DocId;
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
  try {
    if (req.body.CategoryId === undefined) {
      const data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId, req.body.index, req.body.Keyword);
      return res.json(data)
    } else {
      const data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId, req.body.index, req.body.Keyword, 10, ["CategoryId", "==", req.body.CategoryId]);      // (data.Options).push(data.Answer);
      // delete data.Answer
      return res.json(data)
    }
  } catch (error) {
    functions.logger.error(error)
    console.log(error)
  }

}

async function Check(req, res) {
  let msg = await dataHandling.Check("QuestionsAndAnswers", req.body.DocId, req.body.Answer)
  return res.json(msg)
}



module.exports = {
  Create,
  Update,
  Delete,
  Read,
  Check
}