const mongoose = require('mongoose');
const MONO = mongoose.model('itemlist');
const getAllItems = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    if (userid !== '') {
        console.log('0');
        MONO
            .findById(userid)
            .exec((err, itemlist) => {
                console.log(itemlist);
                if (err) {
                    res
                        .status(404)
                        .json({
                            "message": err,
                            "code": "mongo_err",

                        });

                } else if (!itemlist) {
                    res
                        .status(404)
                        .json({
                            "message": "please insert one item",
                            "code": "no_data"
                        })
                } else {
                    res
                        .status(200)
                        .json({
                            "fb": itemlist,
                            "message": "用findById方法查询到了记录",
                            "code": "success"
                        });
                }

            });
    } else {
        console.log('1');
        MONO
            .find({ username: username })
            .exec((err, itemlist) => {
                if (err) {
                    res
                        .status(404)
                        .json({
                            "err": err,
                            "code": "mongo_err"
                        });

                } else if (!itemlist[0]) {
                    res
                        .status(404)
                        .json({
                            "message": "please insert one item",
                            "code": "no_data"
                        })
                } else {
                    req.session.userid = itemlist[0]._id;
                    res
                        .status(200)
                        .json({
                            "fb": itemlist[0],
                            "message": "用find方法查询到了记录",
                            "code": "success"
                        });
                }

            });

    }

}

const addFirstItem = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    if (req.session.login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }

    MONO
        .create({
            "username": req.session.username,
            "items": [req.body]
        }, (err, itemlist) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
                return;
            }
            req.session.userid = itemlist._id;
            res
                .status(200)
                .json({
                    "fb": itemlist,
                    "message": "成功插入一条数据，并且记住了你的id，下次可以更快速查询",
                    "code": "success"
                });
        })
}

const updateTypes = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO.findById(req.session.userid)

        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                itemlist.itemTypes = req.body
                itemlist.save((err) => {
                    if (err) {
                        res
                            .status(404)
                            .json({
                                "err": err,
                                "code": "mongo_err"
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                "message": "成功保存数据类型",
                                "code": "success"
                            })
                    }
                });
            }
        })
}

const addNewItem = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO.findById(req.session.userid)

        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                itemlist.items.push(req.body)
                itemlist.save((err) => {
                    if (err) {
                        res
                            .status(404)
                            .json({
                                "err": err,
                                "code": "mongo_err"
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                "message": "成功插入一条数据",
                                "code": "success"
                            })
                    }
                });
            }
        })


}
const addItems = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO.findById(req.session.userid)

        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(404)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                itemlist.items.push(...req.body)
                itemlist.save((err) => {
                    if (err) {
                        res
                            .status(404)
                            .json({
                                "err": err,
                                "code": "mongo_err"
                            });
                    } else {
                        res
                            .status(200)
                            .json({
                                "message": `成功插入${req.body.length}条数据`,
                                "code": "success"
                            })
                    }
                });
            }
        })


}
const deleteItem = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO
        .findById(req.session.userid)
        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                if (!itemlist) {
                    res
                        .status(400)
                        .json({
                            "message": "该用户没有数据",
                            "code": "invalid_userid"
                        });
                    return
                }
                if (!itemlist.items.id(req.body.itemid)) {
                    res
                        .status(400)
                        .json({
                            "message": "没有找到这个物品",
                            "code": "invalid_itemid"
                        })
                    return
                }
                itemlist.items.id(req.body.itemid).remove();
                itemlist.save((err) => {
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
                                "message": "成功删除一条数据",
                                "code": "success"
                            })
                    }
                })
            }
        })
}
const deleteItems = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO
        .findById(req.session.userid)
        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                if (!itemlist) {
                    res
                        .status(400)
                        .json({
                            "message": "该用户没有数据",
                            "code": "invalid_userid"
                        });
                    return
                }
                if (!req.body.itemids) {
                    res
                        .status(400)
                        .json({
                            "message": "提交信息不全",
                            "code": "invalid_data"
                        });
                    return
                }
                req.body.itemids.forEach(itemid => {
                    if (!itemlist.items.id(itemid)) {
                        res
                            .status(400)
                            .json({
                                "message": "没有找到这个物品",
                                "code": "invalid_itemid"
                            })
                        return
                    }
                    itemlist.items.id(itemid).remove();
                });
                itemlist.save((err) => {
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
                                "message":  `成功删除条${req.body.itemids.length}数据`,
                                "code": "success"
                            })
                    }
                })
            }
        })
}
const updateQuantity = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO
        .findById(userid)
        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                if (!itemlist) {
                    res
                        .status(400)
                        .json({
                            "message": "该用户没有数据",
                            "code": "invalid_userid"
                        });
                    return
                }
                if (!itemlist.items.id(req.body.itemid)) {
                    res
                        .status(400)
                        .json({
                            "message": "没有找到这个物品",
                            "code": "invalid_itemid"
                        })
                    return
                }
                let childItem = itemlist.items.id(req.body.itemid);
                if (req.body.in) {
                    childItem.in.push(req.body.in);
                } else {
                    childItem.out.push(req.body.out);
                }

                childItem.quantity = req.body.quantity;
                itemlist.save((err) => {
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
                                "message": "成功更改了数量",
                                "code": "success"
                            })
                    }
                })
            }
        })
}
const updateQuantities = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO
        .findById(userid)
        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
            } else {
                if (!itemlist) {
                    res
                        .status(400)
                        .json({
                            "message": "该用户没有数据",
                            "code": "invalid_userid"
                        });
                    return
                }
                if (!req.body.items || req.body.items.length === 0 || (!req.body.in && !req.body.out)) {
                    res
                        .status(400)
                        .json({
                            "message": "提交信息不全",
                            "code": "invalid_data"
                        });
                    return
                }
                req.body.items.forEach(item => {
                    if (!item.itemid || !itemlist.items.id(item.itemid)) {
                        res
                            .status(400)
                            .json({
                                "message": "没有找到这个物品",
                                "code": "invalid_itemid"
                            })
                        return
                    }

                    let childItem = itemlist.items.id(item.itemid);
                    if (req.body.in) {
                        childItem.in.push(req.body.in);
                    } else {
                        childItem.out.push(req.body.out);
                    }

                    childItem.quantity = item.quantity;

                });

                itemlist.save((err) => {
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
                                "message": "成功批量更改了数量",
                                "code": "success"
                            })
                    }
                })
            }
        })
}
const updateProperty = function (req, res) {
    let login = req.session.login || '';
    let username = req.session.username || '';
    let userid = req.session.userid || '';
    if (login !== 'ok') {
        res.json({ "message": "please logIn", "code": "not_logIn" });
        return;
    }
    MONO
        .findById(userid)
        .exec((err, itemlist) => {
            if (err) {
                res
                    .status(400)
                    .json({
                        "err": err,
                        "code": "mongo_err"
                    });
                return
            } else {
                if (!itemlist) {
                    res
                        .status(400)
                        .json({
                            "message": "该用户没有数据",
                            "code": "invalid_userid"
                        });
                    return
                }
                if (!itemlist.items.id(req.body.item_id)) {
                    res
                        .status(400)
                        .json({
                            "message": "没有找到这个物品",
                            "code": "invalid_itemid"
                        })
                    return
                }
                let childitem = itemlist.items.id(req.body.item_id);
                console.log('childitem', childitem);
                let property = [];

                if (req.body.item_name) {
                    property.push({ name: req.body.item_name });
                    childitem.name = req.body.item_name;
                }
                if (req.body.item_marking) {
                    property.push({ marking: req.body.item_marking });
                    childitem.marking = req.body.item_marking;
                }
                if (req.body.item_footprint) {
                    property.push({ footprint: req.body.item_footprint });
                    childitem.footprint = req.body.item_footprint;
                }
                if (req.body.item_brand) {
                    property.push({ brand: req.body.item_brand });
                    childitem.brand = req.body.item_brand;
                }
                if (req.body.item_description) {
                    property.push({ description: req.body.item_description });
                    childitem.description = req.body.item_description;
                }
                if (req.body.item_childType) {
                    property.push({ quantity: req.body.item_childType });
                    childitem.childType = req.body.item_childType;
                }
                if (req.body.item_quantity) {
                    property.push({ quantity: req.body.item_quantity });
                    childitem.quantity = req.body.item_quantity;
                }
                if (req.body.item_value) {
                    property.push({ value: req.body.item_value });
                    childitem.property.value = req.body.item_value;
                }
                if (req.body.item_unit) {
                    property.push({ unit: req.body.item_unit });
                    childitem.property.unit = req.body.item_unit;
                }
                if (req.body.item_volt) {
                    property.push({ volt: req.body.item_volt });
                    childitem.property.volt = req.body.item_volt;
                }
                if (req.body.item_precise) {
                    property.push({ precise: req.body.item_precise });
                    childitem.property.precise = req.body.item_precise;
                }
                if (!req.body.item_name && !req.body.item_marking && !req.body.item_unit &&
                    !req.body.item_footprint && !req.body.item_childType && !req.body.item_value &&
                    !req.body.item_precise && !req.body.item_quantity && !req.body.item_volt &&
                    !req.body.item_brand && !req.body.item_description
                ) {
                    res
                        .status(400)
                        .json({
                            "message": "您没有需要更改的属性",
                            "code": "none_property"
                        })
                    return
                }
                itemlist.save((err) => {
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
                                "message": "成功更改了属性",
                                "property": property,
                                "code": "success"
                            })
                    }
                })
            }
        })

}
module.exports = {
    getAllItems,
    addFirstItem,
    addNewItem,
    addItems,
    deleteItem,
    deleteItems,
    updateTypes,
    updateQuantity,
    updateQuantities,
    updateProperty
}