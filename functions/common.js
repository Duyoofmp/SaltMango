const functions = require('firebase-functions');
const admin = require('firebase-admin');
const db = admin.firestore();

async function decodeIDToken(req, res, next) {
  functions.logger.log(req.body)

  if (req.body.blahblah === 'blahblah') {
    return res.json('coldstart')
  }

  const idToken = req.body.token;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken.uid);


    req.body.userid = decodedToken.uid;
    // req.body.token = decodedToken.uid;
    delete req.body.token;
    return next();
  } catch (err) {
    functions.logger.error(err);
    req.body.userid = '';
    return res.json({ 'message': 'token not verified', 'error': err });
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}
function arrayRemove(array, element) {
  const arr = array;
  const index = arr.indexOf(element);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr

}
async function login(collectionName, field, data, field2, data2) {
  let Id;
  return db.collection(collectionName).where(field, "==", data).where(field2, "==", data2).limit(1).get().then(snap => {
    console.log(snap.size)
    Id = snap.docs[0].id
    return admin.auth().createCustomToken(Id)
  }).then(token => {
    return token
  })
    .catch(err => {
      functions.logger.error(err);
      return false;
    })

}//pageamin,teamlead,teammanager


async function loginForAdmins(req, res) {
  const user = req.body.Username;
  let temp;
  let flag = 0;
  let ret = false;
  let id;
  const pass = req.body.Password;
  const admins = await db.collection("Admin").doc("Admin_Info").get();
  if (admins.data().Username === user && admins.data().Password === pass) {
    const gen = await admin.auth().createCustomToken(admins.data().uid)
    ret = { token: gen, role: "PageAdmin" }
  } else {
    const staff = await db.collection("Staffs").where("Username", "==", user).where("Password", "==", pass).limit(1).get();
    if (staff.size !== 0) {
      staff.forEach(snap => {
        id = snap.id
      })
      const teams = await db.collection("Teams").where("StaffIds", "array-contains", id).get()
      teams.forEach(doc => {
        console.log(doc.id)
        if (doc.id === "7zvTowPd0ciwLKUhRYwG") {
          temp = id
          flag = 1
        } else if (doc.data().ManagerId === id) {
          temp = id
          flag = 2
        } else if (doc.data().LeaderId === id) {
          temp = id
          flag = 3
        }
      })
      if (flag === 1) ret = { token: await token(temp), role: "LeadStaff" }
      if (flag === 2) ret = { token: await token(temp), role: "TeamManager" }
      if (flag === 3) ret = { token: await token(temp), role: "TeamLeader" }
    }
  }
  return ret
}
async function token(id) {
  return await admin.auth().createCustomToken(id)
}

async function decodeIDTokenHeader(req, res, next) {
  if (req.body.blahblah === 'blahblah') {
    return res.json('coldstart')
  }
  functions.logger.log(req.get('Authorization'));
  functions.logger.log(req.body);
  let encoded = req.get('Authorization');
  if (encoded === undefined || encoded === null) {
    res.status(401).json({ "message": "token not verified" });
  } else {
    const idToken = encoded.replace('Bearer ', '');
    console.log(idToken);

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      console.log(decodedToken.uid);
      req.body.StaffId = decodedToken.uid;
      delete req.body.Token;
      return next();
    } catch (err) {
      console.log(err);
      res.status(401).json({ "message": "token not verified", "error": err });
    }

  }
  return console.log('Decode Completed');
}

const createKeywords = (name, resultArr) => {
  if(name===undefined){name=""}
  let curName = '';
  let temp = name;
  let len = name.split(' ').length;
  for (let i = 0; i < len; i++) {
    for (let k = 0; k < temp.split('').length; k++) {
      letter = temp[k]
      curName += letter.toLowerCase();
      if (!resultArr.includes(curName)) {
        resultArr.push(curName);
      }
    }
    temp = temp.split(' ')
    temp.splice(0, 1);
    temp = temp.join(" ")
    curName = '';
  }
}

function decodeIDTokenForLogin(req, res, next) {
  if (req.body.blahblah === 'blahblah') {
    return res.json('coldstart')
  }
}

module.exports = {
  decodeIDToken,
  makeid,
  arrayRemove,
  login,
  decodeIDTokenHeader,
  createKeywords,
  loginForAdmins,
  decodeIDTokenForLogin
}