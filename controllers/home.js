const Product = require('../models/product');
const User = require('../models/user');


exports.getHomePage = (req, res, next) => {

    Product.findAll()
        .then(products => {
            res.render('home', {
                pageTitle: 'Home | DialaWash',
                products: products,
                hasProducts: products.length > 0,
                path: '/',


            })
        })
        .catch(err => console.log(err));

}

exports.postCashSale = (req, res, next) => {

   

    const phone = req.body.phone;
    let name;
    const service = req.body.services;
    let fetchedCart;
    let location;
    let booking;
    let waxing;
    let underbelly;
    let roof;
    let engine;
    let leather;
    let dashboard;
    let deodorise;

    let prodId;
    if (service === "callout") {
        name = req.body.fullname;
        location = req.body.location
        booking = req.body.appointment;
        prodId = 1;

    }

    if (service === "inhouse") {
        booking = req.body.appointment2;
        prodId = 3;
    }

    req.body.waxing ? waxing = req.body.waxing : waxing = undefined;
    req.body.roof ? roof = req.body.roof : roof = undefined;
    req.body.underbelly ? underbelly = req.body.underbelly : underbelly = undefined;
    req.body.engine ? engine = req.body.engine : engine = undefined;
    req.body.dashboard ? dashboard = req.body.dashboard : dashboard = undefined;
    req.body.deodorise ? deodorise = req.body.deodorise : deodorise = undefined;
    req.body.leather ? leather = req.body.leather : leather = undefined;

    console.log(req.body)
    console.log(`Waxing: ${waxing}`)

    prodId = 2


    User.findByPk(4)
        .then(user => user.getCart().then(cart => {
                                fetchedCart = cart;
                                prodId = prodId;
                                return cart.getProducts({
                                    where: {
                                        id: prodId
                                    }
                                })
                            })

        )
        console.log(products)
        // .catch(err => console.log(err))

    // User.findByPk(4)
    //     .then(user => user.getCart()
    //         .then(basket => {
    //             if (basket) {
    //                 console.log(` THE BASKET ${basket}`)
    //             } else {
    //                 user.createCart()
    //                     .then()
    //                     .catch(err => console.log(err))
    //             }
    //         })
    //         .catch(err => console.log(err))
    //     )
    //     .catch(err => console.log(err))




    // req.user.getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         prodId = prodId;
    //         return cart.getProducts({
    //             where: {
    //                 id: prodId
    //             }
    //         })
    //     })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                // const oldQuantity = product.cartItem.quantity;
                // newQuantity = oldQuantity + 1;
                return product;
            }

            return Product.findByPk(prodId)

        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: 1
                }
            })
        })
        .then(() => {
            res.redirect('/shop/cart')
        })
        .catch(err => console.log(err))



}