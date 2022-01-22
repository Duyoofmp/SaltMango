const functions = require('firebase-functions');
const admin = require('firebase-admin');

const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));

const HomeFunctions = require('../../service/UserServices/Home')
const common = require("../../common");
app.use(common.decodeIDTokenHeader)

// app.post('/ReadDetails', async (req, res) => HomeFunctions.Read(req, res));

const CategoryFunctionsRead = require('../../service/Category').Read;
const ReadRandomQuestions = require('../../service/Questions').ReadRandomQuestions;

app.post('/ReadCategories', async (req, res) => CategoryFunctionsRead(req, res));

app.post('/ReadQuestions', async (req, res) => ReadRandomQuestions(req, res));

app.post('/CheckAnswer', async (req, res) => HomeFunctions.GetPoints(req, res));

app.post('/GetSlotData', async (req, res) => {
    const DateData = HomeFunctions.GetSlotDate(req.body.SlotType);
    const SlotData = await HomeFunctions.GetSlotData(req.body.UserId, req.body.SlotType, DateData);
    return res.json(SlotData);
});

app.post('/EnterASlot', async (req, res) => HomeFunctions.EnterASlot(req, res));

app.post('/SpinDialData', async (req, res) => {
    return res.json(await HomeFunctions.ViewSpinData());
});

app.post('/EnterASpin', async (req, res) => HomeFunctions.EnterASpin(req, res));





exports.Home = functions.region("asia-south1").https.onRequest(app);

// token in every api 

// https://asia-south1-salt-mango.cloudfunctions.net/Profile/UpdateProfile
// Request
//      Name
//      ReferralCode
//      (Neccessary fields)

// /Profile/CheckReferral
// Request
//      ReferralCode

// /Profile/ReadProfile
// response
//      MyCode
//      SaltCoin
//      Diamond
//      Name
//      ReferralCode
//      (Neccessary fields)

// Home/ReadCategories
// Request
//      "Available":"India","International",
//      "Keyword":""
//      "DocId":""[send for pagination]


// Home/ReadQuestions
// Request 
//     DocId(from Home/ReadCategories)
// Response
// [
//     {
//         "DocId": "q4jCxapmqSv7WJsGMP2I",
//         "Question": "qazwsx",
//         "Options": [
//             "lkjho",
//             "qsrgfy",
//             "asd",
//             "ojhojho"
//         ]
//     }
// ]

// Home/CheckAnswer
// Request
//      "DocId"
//      "Answer"
// Response true/false

// Home/GetSlotData
// Request
//      SlotType
//      UserId
// Response
// {
//     FreeSlotLength: number;
//     AdSlotLength: number;
//     SlotCost: number;
// }

// Home/EnterASlot
// Response true/false


// Home/SpinDialData
// Response
//      {
//          SaltDialData: number[];
//          DiamondDialData: number[];
//      }
