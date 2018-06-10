const express = require('express');
const router = express.Router();
const ctrlItemlist = require('../controller/ctrlItemList');
const ctrlUserId = require('../controller/ctrlUserId');

router
    .route('/logIn')
    .post(ctrlUserId.logIn);
router
    .route('/signUp')
    .post(ctrlUserId.signUp);
router
    .route('/userAvatar')
    .get(ctrlUserId.findUserAvatar);
router
    .route('/username')
    .get(ctrlUserId.users);
router
    .route('/logOut')
    .post(ctrlUserId.logOut);
router
    .route('/changeAvatar')
    .post(ctrlUserId.changeAvatar);
router
    .route('/restPS')
    .post(ctrlUserId.resetPS);
router
    .route('/psCheck')
    .post(ctrlUserId.psCheck);
router
    .route('/itemlist')
    .get(ctrlItemlist.getAllItems);
router
    .route('/itemlist/addFirst')
    .post(ctrlItemlist.addFirstItem);
router
    .route('/itemlist/updateTypes')
    .post(ctrlItemlist.updateTypes);
router
    .route('/itemlist/updateProperty')
    .post(ctrlItemlist.updateProperty);
router
    .route('/itemlist/add')
    .post(ctrlItemlist.addNewItem);
router
    .route('/itemlist/addItems')
    .post(ctrlItemlist.addItems);
router
    .route('/itemlist/delete')
    .post(ctrlItemlist.deleteItem);
router
    .route('/itemlist/deleteItems')
    .post(ctrlItemlist.deleteItems);
router
    .route('/itemlist/quantity')
    .post(ctrlItemlist.updateQuantity);
router
    .route('/itemlist/quantities')
    .post(ctrlItemlist.updateQuantities);
router
    .route('/itemlist/property')
    .post(ctrlItemlist.updateProperty);

module.exports = router;

