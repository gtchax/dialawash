const Product = require('../models/product');


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

exports.postPurchase = (req, res, next) => {

    const phone = req.body.phone;
    const name = req.body.fullname;
    const service = req.body.services;
    let datetime;
    let location;
    let booking;
    if (service === "3") {


    } else if (service === "2") {
        booking = req.body.appointment2;

    } else if (service === "1") {
        datetime = req.body.appointment;
        location = req.body.location;

    }


    res.render('home', {
        pageTitle: 'Home | DialaWash',
        path: '/',
    })


}