var express = require('express');
var router = express.Router();
var _ = require('underscore');
var User = require('../models/user');
var Product = require('../models/product');
var Cart=require('../models/cart');
var multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/upload')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload=multer({storage:storage});

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
//登出
router.get('/logout', function(req, res, next) {
    delete req.session.user;
    req.app.locals.user = null;
    res.redirect('/');
});

//卧室
router.get('/bedroom', function(req, res, next) {
    res.render('page/bedroom', {
        title: '卧室',
        currentPage: 1
    });
});
//客厅
router.get('/livingroom', function(req, res, next) {
    res.render('page/livingroom', {
        title: '客厅',
        currentPage: 2
    });
});

//产品页面
router.get('/product/:id', function(req, res, next) {
    var p_id = req.params.id;
    Product.findById(p_id, function(err, result) {
        if (err) {
            return res.send({
                code: 404,
                message: err
            });
        }
        if (result) {
            res.render('page/product', {
                title: '商品详情',
                brand: result[0].name,
                type_color: result[0].tag,
                price: result[0].price,
                p_id: p_id,
                info: result[0].info,
                pic:result[0].pic,
                left: result[0].leftAmount,
                currentPage: -1
            })
        }
    })
});
//Add to Cart
router.post('/addToCar', function(req, res, next) {
    var data = req.body;
    var user=req.session.user;
    var _cart={
        username:user.name,
        productid:data.pid,
        amount:data.amount
    }
    var left=(~~data.left) - (~~data.amount);
    var cart = new Cart(_cart);

    Cart.find({username:user.name,productid:data.pid},function(err,result){
        if(err){return res.send({code: 404,message: err});}
        if(result.length>0){
            Cart.remove({username:user.name,productid:data.pid},function(err,result){
                if(err){return res.send({code: 404,message: err});}
                cart.save(function(err, result) {
                    if (err) {
                        return res.send({
                            code: 404,
                            message: err
                        });
                    }
                    Product.find({id:data.pid},function(err,result){
                        if(err){return res.send({code: 404,message: err});}
                        Product.update({id:data.pid},{$set:{leftAmount:left}},function(err,result){
                            if(err){return res.send({code: 404,message: err});}
                            return res.send({
                                code: 0,
                                message: '已成功添加到购物车'
                            });
                        })
                    })
                });
            });
        }else{
            cart.save(function(err, result) {
                if (err) {
                    return res.send({
                        code: 404,
                        message: err
                    });
                }
                Product.find({id:data.pid},function(err,result){
                    if(err){return res.send({code: 404,message: err});}
                    Product.update({id:data.pid},{$set:{leftAmount:left}},function(err,result){
                        if(err){return res.send({code: 404,message: err});}
                        return res.send({
                            code: 0,
                            message: '已成功添加到购物车'
                        });
                    })
                })
            });
        }
    })
});
//display cart
router.get('/cart',function(req,res,next){
    var user=req.session.user;
    Cart.find({username:user.name},function(err,result){
        if(err){return res.send({code: 404,message: err});}
        var cart_data=result;
        var carts=[];
        var count=0;
        if(result.length>0){
            cart_data.forEach(function(item,i,array){
            Product.find({id:item.productid},function(err,result){
                if(err){return res.send({code: 404,message: err});}
                    carts.push({
                        name:result[0].name,
                        price:result[0].price,
                        amount:item.amount,
                        pic:result[0].pic
                    })
                    count++;
                    if(count===array.length){
                        res.render('page/cart',{
                            title:'gouwuche',
                            currentPage:-1,
                            carts:carts
                        })
                        return;
                    }
                })
            })
        }else{
            res.render('page/cart',{
                        title:'gouwuche',
                        currentPage:-1,
                        carts:carts
                    })
            return;
        }
    })
});
//搜索商品
router.get('/search/:value',function(req,res,next){
    var value=req.params.value+'';
    Product.find({name:{$regex:value}},function(err,result){
        if(err){
            res.send({
                code: 404,
                message: err
            });
            return;
        }
        var rows=Math.ceil(result.length/4);
        res.render('page/searchResult',{
            title:'搜索结果',
            products:result,
            rows:rows,
            currentPage:-1
        })
        return;
    })
});

//管理员相关
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
                        res.render('admin/adminIndex', {
                            title:'商品管理',
                            currentTab:0,
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
router.get('/tongji',function(req,res,next){
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
                    res.render('admin/adminCharts',{
                        title:'统计信息',
                        currentTab:1
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
})
router.get('/charts',function(req,res,next){
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
                        
                        var sellsData=[];
                        products.forEach(function(item,i){
                            var obj={};
                            obj.name=item.name,
                            obj.sold=~~item.totalAmount-~~item.leftAmount
                            sellsData.push(obj);
                        })
                        res.send({
                            title:'统计信息',
                            currentTab:1,
                            sellsData: sellsData
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
})
//添加商品和上传图片
router.post('/admin/addProduct', upload.single('pic'), function(req, res, next) {
    var _product = req.body;
    _product.pic=req.file.originalname;
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
            });
        }else{
            var product = new Product(_product);
            product.save(function(err, result) {
                if (err) {
                    return res.send({
                        code: 404,
                        message: err
                    });
                }
                return res.send({
                    code: 0,
                    message: '添加成功'
                });
            })
        }
    })
});
//更新商品,with pic
router.post('/admin/updateProduct',upload.single('pic'),function(req,res,next){
    var _product=req.body;
    _product.pic=req.file.originalname;
    Product.remove({id:_product.id},function(err,result){
        if(err){
            return res.send({
                code: 404,
                message: err
            });
        }
        if(result.result.n==0){
            return res.send({
                code: 404,
                message: '没有这个ID'
            });
        }
        var product = new Product(_product);
            product.save(function(err, result) {
                if (err) {
                    return res.send({
                        code: 404,
                        message: err
                    });
                }

                return res.send({
                    code: 0,
                    message: '修改成功！'
                });
            })
    })
})
//更新商品,withOUT pic
router.post('/admin/updateProductPicNotChange',function(req,res,next){
    var _product=req.body;
    var id=_product.id;
    Product.find({id:id},function(err,result){
        if(err){
            return res.send({
                code: 404,
                message: err
            });
        }
        if(result.length==0){
            return res.send({
                code: 404,
                message: '没有这个ID'
            });
        }
        var _id=result._id;
        Product.findOneAndUpdate({id:_product.id},_product,function(err,result){
            if (err) {
                return res.send({
                    code: 404,
                    message: err
                });
            }
            return res.send({
                code: 0,
                message: '修改成功！'
            });
        })
    })
})
//删除商品
router.post('/admin/deleteProduct',function(req,res,next){
    var _id=req.body.id;
    Product.remove({id:_id},function(err,result){
        if(err){
            return res.send({
                code: 404,
                message: err
            });
        }
        return res.send({
            code:0,
            message:'删除成功！'
        })
    })
})



module.exports = router;
