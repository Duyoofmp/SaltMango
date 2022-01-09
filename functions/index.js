const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount=require('./config/ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
  });



  const CategoryApis=require('./apis/Category')
  exports.Category=CategoryApis.Category