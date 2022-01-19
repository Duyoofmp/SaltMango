const admin = require('firebase-admin');
const ServiceAccount = require('./config/serviceAccount.json')

admin.initializeApp({
  credential: admin.credential.cert(ServiceAccount)
});

//=========================Apis==============================

const CategoryApis = require('./api/Category');
exports.Category = CategoryApis.Category;

const AdminApis = require('./api/Admin')
exports.Admin = AdminApis.Admin

const QuestionsApis = require('./api/Questions')
exports.Questions = QuestionsApis.Questions

const UsersApis = require('./api/Users')
exports.Users = UsersApis.Users
exports.Users = UsersApis.LoginForAdmin

const OffersApis = require('./api/Offers')
exports.Offers = OffersApis.Offers

const CouponsApis = require('./api/Coupons')
exports.Coupons = CouponsApis.Coupons


const CountryApis = require('./api/Country')
exports.Countries = CountryApis.Countries

const UserQuestionApis = require('./api/UserApis/Questions')
exports.UserQuestions = UserQuestionApis.UserQuestions

const ProfileApis = require('./api/UserApis/Profile')
exports.Profile = ProfileApis.Profile

const HomeApis = require('./api/UserApis/Home')
exports.Home = HomeApis.Home



// // // //=========================Triggers==============================

const CategoryTriggers = require('./triggers/Category')
exports.OnCategoryCreate = CategoryTriggers.OnCategoryCreate
exports.OnCategoryUpdate = CategoryTriggers.OnCategoryUpdate

const QuestionsTriggers = require('./triggers/Questions')
exports.OnQuestionsCreate = QuestionsTriggers.OnQuestionsCreate
exports.OnQuestionsUpdate = QuestionsTriggers.OnQuestionsUpdate


const UsersTriggers = require('./triggers/Users')
exports.OnUsersCreate = UsersTriggers.OnUsersCreate
exports.OnUsersUpdate = UsersTriggers.OnUsersUpdate

const CountryTriggers = require('./triggers/Country')
exports.OnCountryCreate = CountryTriggers.OnCountryCreate
exports.OnCountryUpdate = CountryTriggers.OnCountryUpdate

const CouponTriggers = require('./triggers/Coupon')
exports.OnCouponCreate = CouponTriggers.OnCouponCreate
exports.OnCouponUpdate = CouponTriggers.OnCouponUpdate


