const express = require('express');
const isAuth = require('../middleware/is-auth');
const shopController = require('../controllers/shop');

const router = express.Router();


router.get('/', shopController.getIndex);

router.get('/products', isAuth, shopController.getProducts);
router.get('/cart', isAuth, shopController.getCart);
router.get('/checkout', isAuth, shopController.getCheckout);
router.get('/orders',  isAuth, shopController.getOrders);

router.post('/cart',  shopController.postCart);
router.post('/cart-delete-item',  shopController.postCartDeleteProduct)
router.post('/create-order',  shopController.postOrder)

module.exports = router;