var express = require('express');
var router = express.Router();
var _ = require('underscore');
var User = require('../models/user');
var Product = require('../models/product');

//pre handle user
router.use(function(req, res, next) {
    var _user = req.session.user;
    if (_user) {
        //I am not sure about which usage is correct below
        //1.
        req.app.locals.user = _user;
        //2.
        // res.locals.user=_user;
    }
    return next();
})

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('page/index', {
        title: '首页',
        currentPage: 0,
        photoList: [{
            picture_url: '/images/201622_hpsf01a_01_PH129300.jpg',
            caption: '孩童创意，献爱公益'
        }, {
            picture_url: '/images/cny_countdown_hp.jpg',
            caption: '新春倒数'
        }, {
            picture_url: '/images/extendable_table_hp_zh.jpg',
            caption: '5折优惠'
        }]
    });
});
//用户注册
router.post('/user/signup', function(req, res, next) {
    var _user = {
        name: req.body.name,
        password: req.body.password
    };

    User.find({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.send({
                code: 404,
                message: err
            });
        } else if (user.length > 0) {
            console.log(user, '-------------');
            res.send({
                code: 404,
                message: '用户名已存在'
            });
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    res.send({
                        code: 404,
                        message: err
                    });
                }
                res.send({
                    code: 0,
                    message: '注册成功'
                });
            })
        }
    });
});
//用户登录
router.post('/user/signin', function(req, res, next) {
    var _user = req.body;
    var name = _user.name,
        password = _user.password;

    User.findOne({
        name: name
    }, function(err, user) {
        if (err) {
            res.send({
                code: 404,
                message: err
            });
        }
        if (!user) {
            res.send({
                code: 404,
                message: "用户不存在"
            });
            return;
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                res.send({
                    code: 404,
                    message: err
                });
                return;
            }
            if (isMatch) {
                req.session.user = user;
                res.send({
                    code: 0,
                    message: '密码正确'
                });
            } else {
                res.send({
                    code: 404,
                    message: '密码错误！'
                });
                return;
            }
        })
    })
});
//logout
router.get('/logout', function(req, res, next) {
    delete req.session.user;
    req.app.locals.user = null;
    res.redirect('/');
});

//bedroom
router.get('/bedroom', function(req, res, next) {
    res.render('page/bedroom', {
        title: '卧室',
        currentPage: 1
    });
});

//Product page
router.get('/product/:id', function(req, res, next) {
    var p_id = req.params.id;
    // Product.findLeft(p_id, function(err, result) {
    //     if (err) {
    //         return res.send({
    //             code: 404,
    //             message: err
    //         });
    //     }
    //     if (result) {
    //         res.render('page/product', {
    //             title: 'Product Detail',
    //             brand: 'HEMNES 汉尼斯',
    //             type_color: '床架, 黑褐色',
    //             price: '1,549.00',
    //             p_id: p_id,
    //             info: '实木制成，它是一种结实耐用的天然材料。 床侧板含有床板高度调节设置，使您能够使用厚度不同的床垫。',
    //             left: result,
    //             currentPage: -1
    //         })
    //     }
    // })
    res.render('page/product', {
        title: '商品详情',
        brand: 'HEMNES 汉尼斯',
        type_color: '床架, 黑褐色',
        price: '1,549.00',
        p_id: p_id,
        info: '实木制成，它是一种结实耐用的天然材料。 床侧板含有床板高度调节设置，使您能够使用厚度不同的床垫。',
        left: 12,
        currentPage: -1
    })
});

//Administrator
router.get('/admin', function(req, res, next) {
    if (!req.session.user) {
        res.send({
            code: 404,
            message: '请登录'
        });
        return;
    } else {
        User.findOne({
            name: req.session.user.name
        }, function(err, result) {
            if (err) {
                res.send({
                    code: 404,
                    message: err
                });
                return;
            }
            if (result) {
                if (result.right === 0) { //0 is admin user
                    Product.find().sort({"id":1}).exec(function(err, products) {
                        if (err) {
                            return res.send({
                                code: 404,
                                message: err
                            });
                        }
                        res.render('admin/productlist', {
                            title:'商品管理',
                            products: products
                        })
                    })
                } else {
                    res.send({
                        code: 404,
                        message: '未授权！'
                    });
                    return;
                }
            }
        })
    }
});
//添加商品和上传图片
router.post('/admin/addProduct', function(req, res, next) {
    var _product = req.body;

    Product.find({
        id: _product.id
    }, function(err, product) {
        if (err) {
            return res.send({
                code: 404,
                message: err
            });
        }
        if (product.length > 0) {
            return res.send({
                code: 404,
                message: 'id 已经存在'
            });;
        }
        var product = new Product(_product);
        product.save(function(err, result) {
            if (err) {
                return res.send({
                    code: 404,
                    message: err
                });;
            }
            return res.send({
                code: 0,
                message: '添加成功'
            });
        })
    })
});
router.post('/admin/uploadImg',function(req,res,next){
    console.log(req.files,'----------------------');
})

module.exports = router;
