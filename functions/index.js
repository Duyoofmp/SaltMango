const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount=require('./config/ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
  });

//=========================Apis==============================

  const CategoryApis=require('./apis/Category')
  exports.Category=CategoryApis.Category
  
  const QuestionsApis=require('./apis/Questions')
  exports.Questions=QuestionsApis.Questions
  
  const UsersApis=require('./apis/Users')
  exports.Users= UsersApis.Users

  const OffersApis = require('./apis/Offers')
  exports.Offers= OffersApis.Offers


 //=========================Triggers==============================

 const CategoryTriggers=require('./triggers/Category')
 exports.OnCategoryCreate= CategoryTriggers.OnCategoryCreate
 exports.OnCategoryUpdate= CategoryTriggers.OnCategoryUpdate

 const QuestionsTriggers=require('./triggers/Questions')
 exports.OnQuestionsCreate= QuestionsTriggers.OnQuestionsCreate
 exports.OnQuestionsUpdate= QuestionsTriggers.OnQuestionsUpdate


 const UsersTriggers=require('./triggers/Users')
 exports.OnUsersCreate= UsersTriggers.OnUsersCreate
 exports.OnUsersUpdate= UsersTriggers.OnUsersUpdate

