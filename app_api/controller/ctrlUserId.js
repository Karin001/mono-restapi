const mongoose = require('mongoose');
const USERS = mongoose.model('users');
const ctrlItemList = require('./ctrlItemList');
const utils = require('../../utils/utils');
const logIn = function (req, res) {
    if (req.session.login === 'ok') {
        res.json({
            "message": req.session.username,
            "code": "logged"
        });
        return;
    }
    USERS
        .find({ username: req.body.username })
        .exec((err, user) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });

            } else if (!user[0]) {
                res
                    .status(404)
                    .json({
                        "message": "用户不存在",
                        "code": "invalid_user"
                    });
            } else if (utils.md5Change(req.body.password) === 'type_err') {
                res
                    .status(400)
                    .json({
                        "message": "密码格式错误",
                        "code": "type_err"
                    })
            } else if (utils.md5Change(req.body.password) !== user[0].password) {

                res
                    .status(400)
                    .json({
                        "message": "密码错误",
                        "code": "invalid_password"
                    })

            } else {
                req.session.login = 'ok';
                req.session.username = req.body.username;
                res
                    .status(200)
                    .json({
                        "message": req.session.username,
                        "code": "success"
                    });
            }


        });
}
const findUserAvatar = function (req, res) {
    console.log('findAvaIn');
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;

    }
    USERS
        .find({ username: username })
        .exec((err, user) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });

            } else if (!user[0]) {
                res
                    .status(404)
                    .json({
                        "message": "用户不存在",
                        "code": "invalid_user"
                    });
            } else {
                if (user[0] && user[0].avatar) {
                    console.log('find!');
                    res
                    .status(200)
                    .json({
                        "message": user[0].avatar,
                        "code": "success"
                    });
                }
                   
            }


        });
}
const signUp = function (req, res) {
    USERS
        .create({
            username: req.body.ID,
            password: utils.md5Change(req.body.Password),
            email: req.body.Email,
            phone: req.body.phone,
            avatar: req.body.Avatar,
        }, (err, user) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });
            } else {
                res
                    .status(201)
                    .json({
                        "message": user,
                        "code": "success"
                    });
            }
        })

}
const changeAvatar = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;

    }
    USERS
        .find({
            username: username
        }, (err, user) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });
            } else {
                user[0].avatar = req.body.avatar;
                user[0].save((err) => {
                    if (err) {
                        res
                            .status(400)
                            .json({
                                "err": err,
                                "code": "mongo_err"
                            });
                    } else {
                        console.log('changeAva');
                        res
                            .status(200)
                            .json({
                                "message": "成功更改了头像",
                                "code": "success"
                            })
                    }
                })
            }
        })

}
const resetPS = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;

    }
    USERS
        .find({
            username: username
        }, (err, user) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });
            } else {
                if (user[0].password !== utils.md5Change(req.body.old)) {
                    res
                        .status(400)
                        .json({
                            "message": '密码错误',
                            "code": "ps_err"
                        })
                } else {
                    user[0].password = utils.md5Change(req.body.new);
                    user[0].save((err) => {
                        if (err) {
                            res
                                .status(400)
                                .json({
                                    "err": err,
                                    "code": "mongo_err"
                                });
                        } else {
                            res
                                .status(200)
                                .json({
                                    "message": "成功更改了密码",
                                    "code": "success"
                                })
                        }
                    })
                }

            }
        })

}

const psCheck = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;

    }
    USERS
        .find({
            username: username
        }, (err, user) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });
            } else {
                if (!req.body.password || user[0].password !== utils.md5Change(req.body.password)) {
                    res
                        .status(400)
                        .json({
                            "message": '密码错误',
                            "code": "ps_err"
                        })
                } else {
                    res
                        .status(200)
                        .json({
                            "message": '密码校验成功',
                            "code": "success"
                        })
                }

            }
        })

}

const logOut = function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            res
                .status(404)
                .json({
                    "err": err,
                    "code": "session_err"
                })
        } else {
            res
                .status(200)
                .json({
                    "message": "您以成功登出",
                    "code": "success"
                })
        }
    })
}
const users = function (req, res) {
    USERS
        .find()
        .exec((err, users) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "message": err,
                        "code": "mongo_err"
                    });
            } else if (users === []) {
                res
                    .status(200)
                    .json({
                        "usernames": [],
                        "code": "success_unlimited"
                    })
            } else {
                let username;
                username = users.map((user) => {
                    return user.username
                });
                res
                    .status(200)
                    .json({
                        "usernames": username,
                        "code": "success_limited"
                    })
            }
        })
}
module.exports = {
    logIn,
    signUp,
    users,
    findUserAvatar,
    logOut,
    changeAvatar,
    resetPS,
    psCheck
}