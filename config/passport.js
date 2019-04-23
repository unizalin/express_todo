const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')          // 載入 bcryptjs library
const User = require('../models/user')      // 載入 User model
// 載入 User model
const User = require('../models/user');
module.exports = passport => {
  // 使用 Passport 的官方文件上的語法
  // 定義 usernameField 為 email 
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email,
      }).then(user => {
        //如果使用者不存在
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }
        //用 bcrypt 來比較「使用者輸入的密碼」跟在使用者資料庫的密碼是否是同一組字串
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err
          if (isMatch) {
            // 認證成功，回傳使用者資訊 user
            return done(null, user);
          } else {
            //如果使用者密碼錯誤
            return done(null, false, { message: 'Email or Password incorrect' });
          }
        })
      });
    })
  );

  //驗證成功後會，在 session 中紀錄 並儲存在 cookie，後續的驗證透過 cookie 來辨認 session
  //passport 序列化和反序列化 支援 login session

  //user ID 被序列化後存到 session，當後續 requests 時，透過 ID 來找到 user，並存在 req.user中
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
