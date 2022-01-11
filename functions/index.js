const functions = require('firebase-functions');
const admin = require('firebase-admin');
const ServiceAccount=require('./config/ServiceAccount.json')

admin.initializeApp({
    credential: admin.credential.cert(ServiceAccount)
  });

//=========================Apis==============================

  const CategoryApis=require('./AdminApis/Category')
  exports.Category=CategoryApis.Category
  
  const QuestionsApis=require('./AdminApis/Questions')
  exports.Questions=QuestionsApis.Questions
  
  const UsersApis=require('./AdminApis/Users')
  exports.Users= UsersApis.Users
  exports.Users=UsersApis.LoginForAdmin

  const OffersApis = require('./AdminApis/Offers')
  exports.Offers= OffersApis.Offers

  
  const CountryApis = require('./AdminApis/Country')
  exports.Countries= CountryApis.Countries


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


