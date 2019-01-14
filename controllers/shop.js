const Product = require('../models/product');
var Order = require('../models/order');
const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {
                pageTitle: 'All Products',
                products: products,
                hasProducts: products.length > 0,
                path: '/products',



            })
        })
        .catch(err => console.log(err))

}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop', {
                pageTitle: 'Shop',
                products: products,
                hasProducts: products.length > 0,
                path: '/shop',



            })
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            res.render('shop/product-detail', {
                pageTitle: product.title,
                products: product,
                path: '/product',



            })
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {

    req.user.getCart()
        .then(basket => {
            if (basket) {
                console.log(` THE BASKET ${basket}`)
            } else {
                req.user.createCart().then(cart => {
                    console.log(` THE CART ${cart}`)
                    return cart.getProducts().then(products => {

                        return res.render('shop/cart', {
                            pageTitle: 'Your Cart',
                            path: '/cart',
                            products: ['shoe'],
                            products: products,
                            hasProducts: products.length > 0,
                        })
                    }).catch(err => console.log(err))
                })

            }


            return basket.getProducts().then(products => {

                return res.render('shop/cart', {
                    pageTitle: 'Your Cart',
                    path: '/cart',
                    products: ['shoe'],
                    products: products,
                    hasProducts: products.length > 0,
                })
            }).catch(err => console.log(err))
        })
        .catch(err => console.log(err))

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({
                where: {
                    id: prodId
                }
            })
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }

            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }

            return Product.findByPk(prodId)

        })
        .then(product => {
            return fetchedCart.addProduct(product, {
                through: {
                    quantity: newQuantity
                }
            })
        })
        .then(() => {
            res.redirect('/shop/cart')
        })
        .catch(err => console.log(err))
}

exports.postCartDeleteProduct = (req, res, next) => {

    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({
                where: {
                    id: prodId
                }
            });
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy()
        })
        .then(result => {
            res.redirect('/shop/cart')
        })
        .catch(err => console.log(err))

}

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return fetchedCart.getProducts()
        })
        .then(products => {
            return req.user

                .createOrder()
                .then(order => {

                    order.addProducts(products.map(product => {
                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        }
                        return product
                    }));
                })

                .catch(err => console.log(err))

                .then(order => order.addProducts(products => {
                    products.map(product => {

                        product.orderItem = {
                            quantity: product.cartItem.quantity
                        }
                        return product
                    })
                }))
                .catch(err => console.log(err))
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/shop/orders')
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {

    req.user
        //  .setOrders(null)
        .getOrders({
            include: ['products']
        })
        .then(orders => {
            res.render('shop/orders', {
                pageTitle: 'Checkout',
                orders: orders,
                hasOrders: orders.length > 0,
                path: '/shop/orders',
            })
        })
        .catch(err => console.log(err))

}


exports.pdf = (req, res, next) => {
    const orderId = req.params.orderId;



    Order.findByPk(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found'))
            }
            if (order.userId.toString() !== req.user.id.toString()) {
                return next(new Error('Unauthorized'))
            }

                let d = new Date()

                let day = d.getDate().toString()
                let month = d.getMonth() + 1;
                if (month <= 9) {
                    month = '0' + month.toString()
                } else {
                    month = '0' + month.toString()
                }
                let year = d.getFullYear().toString();
                let fulldate = day + '/' + month + '/' + year

            order.getProducts().then(products => {

                let totalPrice = 0;
                   products.forEach(product => {
                     totalPrice +=  product.price
                   })
                return res.render('shop/invoice', {
                    pageTitle: 'Invoice',
                    orderId,
                    path: '/pdf',
                    // date: Date().toString(),
                    products,
                    date: fulldate,
                    totalPrice,
                    order
                    // totalPrice
                })
            })
            .catch(err => console.log(err))


            // const invoiceName = 'invoice-' + orderId + '.pdf';
            // const invoicePath = path.join('data', 'invoices', invoiceName);
            // const pdfDoc = new PDFDocument();
            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"')
            // pdfDoc.pipe(fs.createWriteStream(invoicePath));
            // pdfDoc.pipe(res);
          
            // pdfDoc.text('Dialawash')

            // pdfDoc.end()
          
            // let totalPrice = 0

            //  order.forEach(prod => {
            //      totlaPrice += prod.quantity * prod.product.price
            //     //  pdfDoc.fontSize(16).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
            //  })


           




            // res.render('shop/invoice', {
            //     pageTitle: 'Invoice',
            //     orderId,
            //     path: '/pdf',
            //     // date: Date().toString(),
            //         date: fulldate,
            //     order
            //     // totalPrice
            // })

            // res.setHeader('Content-Type', 'application/pdf');
            // res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');


        })
        .catch(err => next(err))


}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    const invoiceName = 'invoice-' + orderId + '.pdf';
    const invoicePath = path.join('data', 'invoices', invoiceName);



    //  fs.readFile(invoicePath, (err, data) => {
    //      if (err) {
    //          return next(err)
    //      }
    //      res.setHeader('Content-Type', 'application/pdf');
    //      res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
    //      res.send(data)
    //  })

    // const pdfDoc = new PDFDocument();
    // pdfDoc.pipe(fs.createWriteStream(invoicePath));
    // pdfDoc.pipe(res);

    // pdfDoc.fontSize(26).text('Invoice', {
    //     underline: true
    // })
    // let totlaPrice = 0
    // order.products.forEach(prod => {
    //     totlaPrice += prod.quantity * prod.product.price
    //     pdfDoc.fontSize(16).text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price)
    // })

    // pdfDoc.end()


    // Order.findByPk(orderId)
    //     .then(order => {
    //         if (!order) {
    //             return next(new Error('No order found'))
    //         }
    //         if (order.user.userId.toString() !== req.user.id.toString()) {
    //             return next(new Error('Unauthorized'))
    //         }

    //    fs.readFile(invoicePath, (err, data) => {
    //        if (err) {
    //            return next(err)
    //        }
    //        res.setHeader('Content-Type', 'application/pdf');
    //        res.setHeader('Content-Disposition', 'attachment; filename="' + invoiceName + '"')
    //        res.send(data)
    //    })
    //     const file = fs.createReadStream(invoicePath);
    //     res.setHeader('Content-Type', 'application/pdf');
    //     res.setHeader('Content-Disposition', 'inline; filename="' + invoiceName + '"');


    // })
    // .catch(err => next(err))



    // Product.findByPk(prodId)
    //     .then(product => {
    //         res.render('shop/product-detail', {
    //             pageTitle: product.title,
    //             products: product,
    //             path: '/product',



    //         })
    //     })
    //     .catch(err => console.log(err))
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        pageTitle: 'Checkout',
        path: '/checkout',




    })
}