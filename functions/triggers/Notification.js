const functions = require('firebase-functions');
const { pushNotification } = require('../common')



exports.OnUsersNotificationCreate = functions.firestore
    .document("Users/{UserId}/Notifications/{DocId}")
    .onCreate(async (change, context) => {
        const DocId = context.params.DocId;
        const UserId = context.params.UserId;
        const data = change.data();
        return pushNotification(data.Heading, data.Text, UserId)
    })







