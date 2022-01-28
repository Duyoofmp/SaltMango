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
    const DateData = GetSlotDate(SlotType);
    const SlotData = await GetSlotData(UserId, SlotType, DateData, req.body.Ad);
    if (SlotData.checkSlot) {
        return res.json("Cannont Access this api");
    }
    const EntryData = {
        "UserId": UserId,
        "Ad": req.body.Ad,
        "index": Date.now()
    }
    await dataHandling.Create(`${SlotType}/${DateData}/Entry`, EntryData);
    await dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(-1 * SlotData.SlotCost) }, req.body.UserId);
    return res.json(true);
}

async function GetSlotData(UserId, SlotType, DateData, Ad = false) {

    const FreeSlotData = [...(await dataHandling.Read(`${SlotType}/${DateData}/Entry`, undefined, undefined, undefined, 10, ["UserId", "==", UserId, "Ad", "==", false]))]
    const AdSlotData = [...(await dataHandling.Read(`${SlotType}/${DateData}/Entry`, undefined, undefined, undefined, 10, ["UserId", "==", UserId, "Ad", "==", true]))]
    let checkSlot = true;


    if (FreeSlotData.length < 5 && !Ad) {
        checkSlot = false;
    }
    if (Ad && AdSlotData.length < 5) {
        checkSlot = false;
    }
    return {
        FreeSlotData,
        "FreeSlotLength": FreeSlotData.length,
        AdSlotData,
        "AdSlotLength": AdSlotData.length,
        checkSlot,
        "SlotCost": await GetSlotCost(SlotType),
    }

}

function GetSlotDate(SlotType) {
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
        case "Daily":
            DateData = moment().tz('Asia/Kolkata').endOf("day").format("YYYY-MM-DD");
            break;
        default:
            break;
    }
    return DateData
}

async function GetSlotCost(SlotType) {
    const SettingsData = await dataHandling.Read(`Admin`, "Settings");
    let SlotCost = 15;
    SlotCost = SettingsData[`${SlotType}SlotCost`];
    return SlotCost;
}

async function ViewSpinData(Type = false) {
    const SpinData = [
        {
            "Number": 50, "Type": "Diamond", "Probability": 5,
        },
        {
            "Number": 40, "Type": "Diamond", "Probability": 10,
        },
        {
            "Number": 30, "Type": "Diamond", "Probability": 15,
        },
        {
            "Number": 20, "Type": "Diamond", "Probability": 30,
        },
        {
            "Number": 10, "Type": "Diamond", "Probability": 30,
        },
    ];
    const SaltSpinData = [
        {
            "Number": 5, "Type": "SaltCoin", "Probability": 1,
        },
        {
            "Number": 4, "Type": "SaltCoin", "Probability": 1,
        },
        {
            "Number": 3, "Type": "SaltCoin", "Probability": 2,
        },
        {
            "Number": 2, "Type": "SaltCoin", "Probability": 3,
        },
        {
            "Number": 1, "Type": "SaltCoin", "Probability": 3,
        },
    ]
    if (Type) {
        SpinData.push(...SaltSpinData);
    }
    return SpinData;
}


async function EnterASpin(req, res) {
    const SlotType = "Spin";
    const UserId = req.body.UserId;
    const DateData = GetSlotDate(SlotType);
    let SlotData = [];// await ViewSpinData();
    //Check

    const promise = [];
    promise.push(dataHandling.Read(`User/${UserId}/${SlotType}`, `${DateData}`));
    promise.push(dataHandling.Read(`${SlotType}`, `${DateData}`));
    promise.push(dataHandling.Read(`Admin`, `Settings`));

    promise.push(dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(-1 * 30) }, req.body.UserId));

    const promiseResult = await Promise.all(promise);
    const CheckUserLimit = promiseResult[0];
    const CheckAdminLimit = promiseResult[1];
    const SpinLimit = promiseResult[2];

    if (CheckUserLimit.RewardSalt >= SpinLimit.UserLimit && CheckAdminLimit.RewardSalt >= SpinLimit.AdminLimit) {
        SlotData = await ViewSpinData(false);
    }
    else {
        SlotData = await ViewSpinData(true);
    }


    const distribution = createDistribution(SlotData, SlotData.map(id => id.Probability));
    const RandomIndex = randomIndex(distribution);
    const RandomSpinData = SlotData[RandomIndex];
    RandomSpinData.index = Date.now();

    await dataHandling.Update("Users", { [RandomSpinData.Type]: admin.firestore.FieldValue.increment(RandomSpinData.Number) }, UserId);
    await dataHandling.Create(`User/${UserId}/${SlotType}/${DateData}/Entry`, RandomSpinData);
    return res.json(RandomSpinData);
}


const createDistribution = (array, weights, size = 1000) => {
    const distribution = [];
    const sum = weights.reduce((a, b) => a + b);
    for (let i = 0; i < array.length; ++i) {
        const count = (weights[i] / sum) * size;
        for (let j = 0; j < count; ++j) {
            distribution.push(i);
        }
    }
    return distribution;
};

const randomIndex = distribution => {
    const index = Math.floor(distribution.length * Math.random());  // random index
    return distribution[index];
};

module.exports = {
    Read,
    GetPoints,
    EnterASlot,
    GetSlotData,
    GetSlotDate,
    ViewSpinData,
    EnterASpin,
}


