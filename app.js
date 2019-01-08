const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const session = require('express-session');
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const compression = require('compression');
const morgan = require('morgan');
const fs = require('fs');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// const ejs = require('ejs');

const path = require('path');
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + '_' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
    }


}
//Models
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

const sequelize = require('./util/database');
const homeRoute = require('./routes/home');
const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorController = require('./controllers/error');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(multer({
    storage: fileStorage,
    fileFilter,
}).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})


app.use(helmet());
app.use(compression());
app.use(morgan('combined', {
    stream: accessLogStream
}));
app.use(cookieParser())
app.use(session({
    secret: 'keyboard secret',
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false
    // proxy: true 
}))

app.use((req, res, next) => {
    if (!req.session.isLoggedIn) {
        return next();
    }
    User.findByPk(req.session.user.id)
        .then(user => {
            if (!user) {
                return next()
            }
            req.user = user;
            next();
        })
        .catch(err => {
            next(new Error(err))
        });

})
// app.use(csrfProtection)
app.use(csrf({
    cookie: true
}))

app.use(flash());

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    let Admin;
    if (req.session.user) {
        Admin = req.session.user.isAdmin
    } else {
        Admin = false;
    }
    res.locals.isAdmin = Admin;
    res.locals.csrfToken = req.csrfToken();
    next();
})


// Routes
app.use('/', homeRoute);
app.use('/admin', adminRoute);
app.use('/shop', shopRoute);
app.use('/auth', authRoute);
app.use('/500', errorController.get500);
app.use(errorController.get404);

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).render('500', {
        pageTitle: 'Error',
        path: '/500',
        isAuthenticated: req.session.isLoggedIn
    });
})

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
})
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, {
    through: CartItem
});
Product.belongsToMany(Cart, {
    through: CartItem
});
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, {
    through: OrderItem
})

// sequelize.sync({force: true})
sequelize.sync()
    .then(result => {

        // Product.create({
        //     title: 'Call Out',
        //     price: 30,
        //     description: 'Have your vehicle(s) cleaned onsite by our carwash team'
        // });
        // Product.create({
        //     title: 'In House',
        //     price: 20,
        //     description: 'Your vehicle(s), will be collected, cleaned at the carwash centre and returned'
        // });
        // Product.create({
        //     title: 'Drivethrough',
        //     price: 10,
        //     description: 'You bring your vehicle(s) to the carwash centre'
        // });
        app.listen(process.env.PORT, () => {
            console.log(`App listening on port ${process.env.PORT}`);
        })
    })

    .catch(err => console.log(err))


