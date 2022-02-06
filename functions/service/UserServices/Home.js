const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require("moment-timezone")
const dataHandling = require("../../functions");
const db = admin.firestore();

async function Read(req, res) {
    let query
    const data = await admin.firestore().collection("Users").doc(req.body.UserId).get()
    query = data.data()
    return res.json({ Name: query.Name, SaltCoin: query.SaltCoin, Diamond: query.Diamond })
}


async function GetPoints(req, res) {
    const data = await dataHandling.Read("QuestionsAndAnswers", req.body.DocId || "", "", "", 1);
    const PointObj = {
        "DiamondsAccumulated": 0,
        "Result": false,
        "Answer": String(data.Answer),
    }
    if (data === null || String(data.Answer) !== String(req.body.Answer) || Array.isArray(data)) {
        return res.json(PointObj);
    }
    else {
        PointObj.Result = true;
        PointObj.DiamondsAccumulated = 1;
    }
    await dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(1) }, req.body.UserId);
    return res.json(PointObj);
}

async function CheckIfUserCanEnter(SlotCost, UserId, Type = "Diamond") {
    const UserData = await dataHandling.Read("Users", UserId)
    if (UserData[Type] >= SlotCost) {
        return true;
    }
    else {
        return false;
    }
}

async function EnterASlot(req, res) {
    const SlotType = req.body.SlotType;
    const UserId = req.body.UserId;
    const DateData = GetSlotDate(SlotType);
    const SlotData = await GetSlotData(UserId, SlotType, DateData, req.body.Ad);
    if (SlotData.checkSlot) {
        return res.status(410).json("Cannont Access this api");
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
    const SlotCost = await GetSlotCost(SlotType);

    if (FreeSlotData.length < 5 && !Ad) {
        checkSlot = false;
    }
    if (Ad && AdSlotData.length < 5) {
        checkSlot = false;
    }
    if (!(await CheckIfUserCanEnter(SlotCost, UserId))) {
        checkSlot = true;
    }

    return {
        FreeSlotData,
        "FreeSlotLength": FreeSlotData.length,
        AdSlotData,
        "AdSlotLength": AdSlotData.length,
        checkSlot,
        "SlotCost": SlotCost,
        "Date": DateData,
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
        case "Spin":
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

async function GetSlots() {
    const SettingsData = await dataHandling.Read(`Admin`, "Settings");
    const SlotTypes = ["Daily", "Weekly", "Monthly"];
    const data = [];
    for (let index = 0; index < SlotTypes.length; index++) {
        const SlotType = SlotTypes[index];
        data.push({
            SlotType,
            SlotCost: SettingsData[`${SlotType}SlotCost`] || 15,
            "Name": SlotType + " Draw",
        })
    }
    return data;
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
        {
            "Number": 5, "Type": "SaltCoin", "Probability": 3,
        },
        {
            "Number": 4, "Type": "SaltCoin", "Probability": 3,
        },
        {
            "Number": 3, "Type": "SaltCoin", "Probability": 4,
        },
    ];
    if (Type) {
        return SpinData.filter(id => id.Type !== "SaltCoin");
    }
    return SpinData;
}


async function EnterASpin(req, res) {
    const SlotType = "Spin";
    const UserId = req.body.UserId;
    const DateData = GetSlotDate(SlotType);
    let SlotData = [];

    //Check
    const SpinLimit = await dataHandling.Read(`Admin`, `Settings`);
    if (!(await CheckIfUserCanEnter(SpinLimit.SpinSlotCost, UserId))) {
        return res.status(410).json("Cannont Access this api");
    }

    const promise = [];
    promise.push(dataHandling.Read(`Users/${UserId}/${SlotType}`, `${DateData}`));
    promise.push(dataHandling.Read(`${SlotType}`, `${DateData}`));
    promise.push(dataHandling.Update("Users", { "Diamond": admin.firestore.FieldValue.increment(-1 * SpinLimit.SpinSlotCost) }, req.body.UserId));

    const promiseResult = await Promise.all(promise);
    const CheckUserLimit = promiseResult[0] || { RewardSalt: 0 };
    const CheckAdminLimit = promiseResult[1] || { RewardSalt: 0 };

    if (CheckUserLimit.RewardSalt >= SpinLimit.UserLimit || CheckAdminLimit.RewardSalt >= SpinLimit.AdminLimit) {
        SlotData = await ViewSpinData(true);
    }
    else {
        SlotData = await ViewSpinData(false);
    }


    const distribution = createDistribution(SlotData, SlotData.map(id => id.Probability));
    const RandomIndex = randomIndex(distribution);
    const RandomSpinData = SlotData[RandomIndex];
    RandomSpinData.index = Date.now();

    const promise2 = [];

    promise2.push(dataHandling.Update("Users", { [RandomSpinData.Type]: admin.firestore.FieldValue.increment(RandomSpinData.Number) }, UserId));
    promise2.push(dataHandling.Create(`Users/${UserId}/${SlotType}/${DateData}/Entry`, RandomSpinData));
    if (RandomSpinData.Type === "SaltCoin") {
        promise2.push(dataHandling.Update(`Users/${UserId}/${SlotType}`, { RewardSalt: admin.firestore.FieldValue.increment(RandomSpinData.Number) }, DateData));
        promise2.push(dataHandling.Update(`${SlotType}`, { RewardSalt: admin.firestore.FieldValue.increment(RandomSpinData.Number) }, DateData));
    }
    await Promise.all(promise2);
    functions.logger.log(RandomSpinData);
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

async function GetNoOfEntriesInSpin(DateData, UserId, SlotType) {
    const no = await db.collection("Users").doc(UserId).collection(SlotType).doc(DateData).collection("Entry").get();

    if (no.size >= 5) {
        return true;
    }

    return false;
}

async function DirectAndIndirects(req, res, ref) {
    const direct = await dataHandling.Read("Users", req.body.DocId, req.body.index, req.body.Keyword, req.body.limit, [ref, "==", req.body.UserId], [true, "index", "desc"])
    return res.json(direct)
}

async function WinnersList(req, res) {
    let Date = req.body.Date;
    let SlotType = req.body.SlotType;
    if (req.body.Date === "") {
        Date = (await DatesInWinners(SlotType, 1))[0];
    }
    let winData;
    if (req.body.FriendsList === true) {
        winData = await dataHandling.Read("Winners", "", req.body.Index, "", 10, ["WinDate", "==", Date, "WonIn", "==", SlotType, "FriendsList", "array-contains", req.body.UserId]);
    } else {
        winData = await dataHandling.Read("Winners", "", req.body.Index, "", 10, ["WinDate", "==", Date, "WonIn", "==", SlotType]);
    }
    return res.json(winData);
}

//index,limit,FriendList true or false

async function DatesInWinners(SlotType, Limit, userapi) {
    const Date = await dataHandling.Read(SlotType, "", "", "", Limit, ["WinnersSelected", "==", true])
    const a = Date.map(id => id.DocId);
    if (userapi) {
        return a.reverse()
    }
    return a
}

async function ViewNotifications(req, res) {
    const data = await dataHandling.Read(`Users/${req.body.UserId}/Notifications`, "", "", "", 100000,undefined,[true,"Index","desc"]);
    return res.json(data);
}
module.exports = {
    Read,
    GetPoints,
    EnterASlot,
    GetSlotCost,
    GetSlotData,
    GetSlotDate,
    ViewSpinData,
    EnterASpin,
    GetSlots,
    DirectAndIndirects,
    WinnersList,
    DatesInWinners,
    ViewNotifications,
    GetNoOfEntriesInSpin

}


