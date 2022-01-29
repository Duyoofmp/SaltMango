
const dataHandling_Create = require("../functions").Create;
const moment = require("moment-timezone")

async function Create(UserId = "", NotificationObj = {}) {
    NotificationObj.Date = moment().tz('Asia/Kolkata').format("YYYY-MM-DD");
    NotificationObj.Index = moment().tz('Asia/Kolkata').valueOf();
    return dataHandling_Create(`Users/${UserId}/Notifications`, NotificationObj);
}

module.exports = {
    Create
}