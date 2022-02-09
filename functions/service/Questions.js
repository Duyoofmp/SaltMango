const dataHandling = require("../functions");


async function Create(req, res) {
  const promise = [];
  const query = await dataHandling.Read("Category", req.body.CategoryId);
  req.body.Questions.forEach((element, index) => {
    element.index = Date.now();
    element.CategoryId = req.body.CategoryId;
    element.QuestionNumber = query.NoOfQuestions + index;
    promise.push(dataHandling.Create("QuestionsAndAnswers", element));
  });
  const TotalNo = Number(query.NoOfQuestions || 0) + req.body.Questions.length;
  promise.push(dataHandling.Update("Category", { NoOfQuestions: TotalNo }, query.DocId));
  await Promise.all(promise);
  return res.json(true);
}

async function Update(req, res) {
  req.body.index = Date.now();
  await dataHandling.Update("QuestionsAndAnswers", req.body, req.body.DocId);
  return res.json(true);
}

async function Delete(req, res) {
  const promise = [];
  req.body.DocId.forEach((element, index) => {
    promise.push(dataHandling.Delete("QuestionsAndAnswers", element));
  });
  await Promise.all(promise);

  return res.json(true);
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


function shuffle(array) {
  let currentIndex = array.length, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

async function ReadRandomQuestions(req, res) {
  console.log(req.headers.referer)
  const promise = [];
  const data = [];
  data.push(await dataHandling.getRandQuestion(req.body.DocId));
  const DocIds = data.map(id => id.DocId);

  for (let index = 0; index < 9; index++) {
    const QData = await dataHandling.getRandQuestion(req.body.DocId);
    if (DocIds.includes(QData.DocId)) {
      index--;
    }
    else {
      delete QData.Answer;
      delete QData.Keywords;
      shuffle(QData.Options);
      data.push(QData);
      DocIds.push(QData.DocId)
    }
  }

  return res.json(data);
}


module.exports = {
  Create,
  Update,
  Delete,
  Read,
  Check,
  ReadRandomQuestions
}