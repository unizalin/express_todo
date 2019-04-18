const express = require('express')
const router = express.Router()
const Todo = require('../models/todo')
// 載入 auth middleware
const { authenticated } = require('../config/auth');
// 設定首頁路由器

// 加入 authenticated 驗證
router.get('/', authenticated, (req, res) => {
  Todo.find({})
    .sort({ name: 'asc' })
    .exec((err, todos) => {
      if (err) return console.error(err)
      return res.render('index', { todos: todos });
    });
});


module.exports = router;