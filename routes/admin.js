// const path = require('path');

const express = require('express');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');
const adminController = require('../controllers/admin');
const {
    check,
    body
} = require('express-validator/check');
const router = express.Router();

router.get('/', isAuth, isAdmin, adminController.getDashboard);
router.get('/transactions', isAuth, isAdmin, adminController.getTransactions);
router.get('/add-product', isAuth, isAdmin, adminController.getAddProduct);
router.get('/products', isAuth, isAdmin, adminController.getProducts);
router.get('/edit-product/:productId', isAuth, isAdmin, adminController.getEditProduct);

router.post('/add-product', [
    body('title').isString().isLength({
        min: 3
    }).trim(),
    body('description').isLength({
        min: 5
    }).trim(),
    body('price').isFloat()
     .trim(),
], adminController.postAddProduct);
router.post('/edit-product', [
    body('title').isString().isLength({
        min: 3
    }).trim(),
    body('description').isLength({
        min: 5
    }).trim(),
    body('price').isFloat()
    .trim(),
], adminController.postEditProduct);
router.post('/delete-product', adminController.postDeleteProduct);


module.exports = router;