const express = require('express');
const app = express();
//載入 mongoose
const mongoose = require('mongoose');


// 引入 express-handlebars
const exphbs = require('express-handlebars');
// 告訴 express 使用 handlebars 當作 template engine 並預設 layout 是 main
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// 引用 body-parser
const bodyParser = require('body-parser');

// 設定 bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

//載入 todo model
const Todo = require('./models/todo');

//設定連線到 mongoDB
mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });

// mongoose 連線後透過 mongoose.connection 拿到 Connection 的物件
const db = mongoose.connection;

//連線異常
db.on('error', () => {
  console.log('mongodb error');
});
//連線成功
db.once('open', () => {
  console.log('mongodb connect');
});


// Todo 首頁
app.get('/', (req, res) => {
  Todo.find((err, todos) => {                                 // 把 Todo model 所有的資料都抓回來
    if (err) return console.error(err)
    return res.render('index', { todos: todos })  // 將資料傳給 index 樣板
  });
});


// 列出全部 Todo
app.get('/todos/new', (req, res) => {
  res.render('new');
});


// 新增一筆  Todo
app.post('/todos', (req, res) => {
  const todo = Todo({
    name: req.body.name,                       // name 是從 new 頁面 form 傳過來
  });

  todo.save(err => {
    if (err) return console.error(err);
    return res.redirect('/');                        // 新增完成後，將使用者導回首頁
  });
});

// 顯示一筆 Todo 的詳細內容
app.get('/todos/:id', (req, res) => {
  //從瀏覽器的請求 (request) 中取得 params，再從 params 取得 id，
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    return res.render('detail', { todo: todo });
  });
});

// 新增一筆  Todo
app.post('/todos', (req, res) => {
  res.send('建立 Todo');
});

// 修改 Todo 頁面
app.get('/todos/:id/edit', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    return res.render('edit', { todo: todo });
  });
});

// 修改 Todo
app.post('/todos/:id', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    todo.name = req.body.name
    todo.save(err => {
      if (err) return console.error(err);
      return res.redirect(`/todos/${req.params.id}`);
    });
  });
});

// 刪除 Todo
app.post('/todos/:id/delete', (req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (err) return console.error(err);
    todo.remove(err => {
      if (err) return console.error(err);
      return res.redirect('/');
    });
  });
});


app.listen(3000, () => {
  console.log('app 3000 port is ready');
});