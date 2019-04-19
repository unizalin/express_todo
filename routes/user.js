const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

//登入頁面
router.get('/login', (req, res) => {
  res.render('login');
});

// 登入檢查
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {                    // 使用 passport 認證
    successRedirect: '/',                             // 登入成功會回到根目錄
    failureRedirect: '/users/login',                  // 失敗會留在原本頁面
  })(req, res, next);
});

//註冊頁面
router.get('/register', (req, res) => {
  res.render('register');
});

//註冊檢查
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  //確認是否用過
  User.findOne({ email: email }).then(user => {
    if (user) {
      //有重複註冊，回傳資訊
      res.render('register', {
        name,
        email,
        password,
        password2,
      });
    } else {
      //不存在就新增，並導入回首頁
      const newUser = new User({
        name,
        email,
        password
      });
      newUser
        .save()
        .then(user => {
          res.redirect('/');
        })
        .catch(err => console.log(err));
    }
  });
  res.render('register');
});

//登出
router.post('/logout', (req, res) => {
  res.render('logout');
});









module.exports = router;