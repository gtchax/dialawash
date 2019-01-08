const User = require('../models/user')
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const crypto = require('crypto');
const { validationResult } = require('express-validator/check');
const transporter = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: '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'
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    res.render('auth', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: message,
          oldInput: {
              email: '',
              password: ''
          },
        validationErrors: []


    })
}


exports.postLogin = (req, res, next) => {
    const {
        email,
        password
    } = req.body;
const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).render('auth/login', {
          pageTitle: 'Login',
          path: '/login',
          errorMessage: errors.array()[0].msg,
          oldInput: {
              email,
              password
          },
          validationErrors: errors.array()

      });
  }
    User.findOne({
            where: {
                email: email
            }
        })
        .then(user => {
            if (!user) {
                return res.render('auth', {
                    pageTitle: 'Login',
                    path: '/login',
                    errorMessage: 'Invalid email or password',
                    errorMessage: errors.array()[0].msg,
                    oldInput: {
                        email,
                        password
                    },
                    validationErrors: errors.array([{param: 'email', param: 'password'}])


                })
            }
            bcrypt
                .compare(password, user.password)
                .then(doMatch => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                
                    return res.render('auth', {
                        pageTitle: 'Login',
                        path: '/login',
                        errorMessage: 'Invalid email or password',
                      
                               oldInput: {
                                   email,
                                   password
                               },
                               validationErrors: errors.array()


                    })

                })
                .catch(err => console.log(err))




        })
        .catch(err => console.log(err));

}

exports.getSignup = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }

    let fields = {
        firstname: "",
        lastname: "",
        phone: "",
        confirmpassword: "",
        email: "",
        password: ""
    }
    res.render('auth/signup', {
        pageTitle: 'Signup',
        path: '/signup',
        errorMessage: message,
        oldInput: fields,
        validationErrors: []

    })
}

exports.postSignup = (req, res, next) => {
        const {
            firstname,
            lastname,
            email,
            phone,
            password,
            confirmpassword
        } = req.body;


    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).render('auth/signup', {
            pageTitle: 'Signup',
            path: '/signup',
            errorMessage: errors.array()[0].msg,
            oldInput: {
                firstname,
                lastname,
                phone,
                confirmpassword,
                email,
                password
            },
               validationErrors: errors.array()

        });
    }

    User.findOne({
            where: {
                email: email
            }
        })
        .then(userDoc => {
            if (userDoc) {
                req.flash('error', 'Email already exists, please a pick a different one.');
                return res.render('auth/signup', {
                    pageTitle: 'Signup',
                    path: '/signup',
                    errorMessage: req.flash('error'),
                    oldInput: {
                        firstname,
                        lastname,
                        phone,
                        confirmpassword,
                        email,
                        password
                    },
                    validationErrors: 
                        [{
                            param: 'email',
                        
                        }]
                    

                });
            }
            return bcrypt
                .hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        firstname: firstname,
                        lastname: lastname,
                        email: email,
                        password: hashedPassword,
                        phone: phone,
                    })

                    return user.save();
                })
                .then(result => {
                    res.redirect('/auth/login')
                    return transporter.sendMail({
                        to: email,
                        from: 'info@dialawash.co.zw',
                        subject: 'Welcome to Dialawash signup successful!',
                        html: '<h1>You successfully signed up!</h1>'
                    })

                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))

}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })

}

exports.getReset = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0]
    } else {
        message = null
    }
    let success = req.flash('success');
    if (success.length > 0) {
        success = success[0]
    } else {
        success = null
    }
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message,
         successMessage: success
    })

}

exports.postReset = (req, res, next) => {
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err);
            return res.redirect('/auth/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({
                    where: {
                        email: req.body.email
                    }
            })
            .then(user => {
                if (!user) {
                    
                    req.flash('error', 'No account with that email found.')

                  
                    
                   return res.render('auth/reset', {
                        path: '/reset',
                        pageTitle: 'Reset Password',
                        errorMessage: req.flash('error'),
                        successMessage: null
                    })
                        
                }

                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                return user.save();
            })
            .then(result => {
                return transporter.sendMail({
                    to: req.body.email,
                    from: 'info@dialawash.co.zw',
                    subject: 'Password reset',
                    html: `
                    <p>You requested a password reset.</p>
                    <p>Click this <a href="http://localhost:3050/auth/reset/${token}">link</a> to set a new password. </p>
                  `
                })

            })
            .then(() => {
                req.flash('success', 'Reset Password Email Sent successfully!')
                
                        return res.render('auth/reset', {
                            path: '/reset',
                            pageTitle: 'Reset Password',
                            errorMessage: null,
                            successMessage: req.flash('success')
                        });
                
            
            })
          

            .catch(err => console.log(err))
    })


}

exports.getNewPassword = (req, res, next) => {
    const token = req.params.token;
    User.findOne({
            where: {
                resetToken: token,
                resetTokenExpiration: {
                    $gt: DataCue.now()
                }
            }
        })
        .then(user => {
            let message = req.flash('error');
            if (message.length > 0) {
                message = message[0]
            } else {
                message = null
            }
            res.render('auth/new-password', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message,
                userId: user.id.toString(),
                passwordToken: token
            })
        })
        .catch(err => console.log(err))


}

exports.postNewPassword = (req, res, next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passwordToken = req.body.passwordToken;
    let resetUser;
    User.findOne({ where: {
        resetToken: passwordToken,
        resetTokenExpiration: {$gt: Date.now()},
        id: userId
    }})
    .then(user => {
        resetUser = user
       return bcrypt.hash(newPassword, 12);
       
    })
    .then(hashedPassword => {
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result => {
        res.redirect('/auth/login')
    })
    .catch(err => console.log(err))
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password',
        errorMessage: message
    })

}