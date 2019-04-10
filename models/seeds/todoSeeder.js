const mongoose = require('mongoose');
const Todo = require('../todo');

mongoose.connect('mongodb://localhost/todo', { useNewUrlParser: true });
const db = mongoose.connection;
console.log(db);

db.on('error', () => {
  console.log('db todoSeeder error');
});

db.once('open', () => {
  console.log('db todoSeeder ok');
  for (var i = 0; i < 10; i++) {
    Todo.create({ name: 'name-' + i });
  }
});