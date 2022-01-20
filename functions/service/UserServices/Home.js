const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require("moment-timezone")
const dataHandling = require("../../functions");

async function Read(req, res) {
    let query
    const data = await admin.firestore().collection("Users").doc(req.body.UserId).get()
    query = data.data()
    return res.json({ Name: query.Name, SaltCoin: query.SaltCoin, Diamond: query.Diamond })
}


async function GetPoints(req, res) {

    const data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId || "");
    if (data === null || data.Answer !== req.body.Answer) {
        return res.json(false);
    }
    await dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(1) }, req.body.UserId);
    return res.json(true);

}

async function EnterASlot(req, res) {
    const SlotType = req.body.SlotType;
    const UserId = req.body.UserId;
    let DateData;

    switch (SlotType) {
        case "Daily":
            DateData = moment().tz('Asia/Kolkata').endOf("day").format("YYYY-MM-DD");
            break;
        case "Weekly":
            DateData = moment().tz('Asia/Kolkata').endOf("week").format("YYYY-MM-DD");
            break;
        case "Monthly":
            DateData = moment().tz('Asia/Kolkata').endOf("month").format("YYYY-MM-DD");
            break;

        default:
            DateData = moment().tz('Asia/Kolkata').endOf("day").format("YYYY-MM-DD");
            break;
    }
    const SlotData = await GetSlotData(UserId, SlotType, DateData);
    if (SlotData.checkSlot) {



    }

}

async function GetSlotData(UserId, SlotType, DateData) {

    const FreeSlotData = await dataHandling.Read(SlotType, undefined, undefined, undefined, 10, ["UserId", "==", UserId, "Ad", "==", false])
    const AdSlotData = await dataHandling.Read(SlotType, undefined, undefined, undefined, 15, ["UserId", "==", UserId, "Ad", "==", true])
    let checkSlot = true;

    if (FreeSlotData.length < 5 && AdSlotData < 5) {
        checkSlot = false;
    }
    return {
        FreeSlotData,
        AdSlotData,
        checkSlot
    }

}



module.exports = {
    Read,
    GetPoints,
    EnterASlot,
}


