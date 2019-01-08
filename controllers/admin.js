const Product = require('../models/product')
const {
    validationResult
} = require('express-validator/check')

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Admin - Add Product',
        path: '/admin/add-product',
        editing: false,
        hasError: false,
        errorMessage: null,
        validationErrors: []
    })
}


exports.postAddProduct = (req, res, next) => {
    const {
        title,
        price,
        description,
    } = req.body;
    const imageUrl = req.file;
    const errors = validationResult(req)

    if (!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Admin|Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title,
                price,
                description,

            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        })
    }


    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Admin|Add Product',
            path: '/admin/add-product',
            editing: false,
            hasError: true,
            product: {
                title,
                price,
                description,
                imageUrl

            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        })
    }

    const imagePath = image.path;

    req.user.createProduct({
            title: title,
            imageUrl: imagePath,
            price: price,
            description: description,
            userId: req.user
        })

        .then(result => result)
        .catch(err => {
            const error = new Error(err)
            error.httpStatuesCode = 500;
            return next(error)
        })

    res.redirect('/admin');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/admin/products');
    }

    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/admin/products');
            }

            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: 'admin/edit-product',
                editing: editMode,
                product: product,
                hasError: false,
                errorMessage: null,
                validationErrors: []
            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatuesCode = 500;
            return next(error)
        })
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.file;
    const updatedDesc = req.body.description;
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Admin - Edit Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedPrice,
                description: updatedDesc,
                imageUrl: updatedImageUrl,
                prod: prodId

            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()

        })
    }
    Product.findByPk(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatedPrice;
            product.description = updatedDesc;
            product.imageUrl = updatedImageUrl;
            return product.save();
        })
        .then(result => {

            res.redirect('admin/products');
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatuesCode = 500;
            return next(error)
        })



}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                pageTitle: 'Admin - Products',
                products: products,
                hasProducts: products.length > 0,
                path: '/admin/products',


            })
        })
        .catch(err => {
            const error = new Error(err)
            error.httpStatuesCode = 500;
            return next(error)
        });
}

exports.getDashboard = (req, res, next) => {
    res.render('admin/dashboard', {
        pageTitle: 'Admin | Dashboard',
        path: '/admin',
        activeAddprodct: true,

    })
}



exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            res.redirect('/admin/products')

        })

}

exports.getTransactions = (req, res, next) => {
    res.render('admin/transactions', {
        pageTitle: 'Admin | Transactions',
        path: '/admin/transactions',
        activeAddprodct: true,

    })
}