const mongoose = require('mongoose');

const users = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    avatar: {type: String},
    phone: {type: Number},
    userid: {type: String} //userid是用户注册后系统建立的对应该用户的itemlist数据库的mongodb id号
});

mongoose.model('users', users, 'users');