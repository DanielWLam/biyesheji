var express = require('express');
var router = express.Router();
var _=require('underscore');
var User=require('../models/user');

//pre handle user
router.use(function(req,res,next){
    var _user=req.session.user;
    if(_user){
        //I am not sure about which usage is correct below
        //1.
        req.app.locals.user=_user;
        //2.
        // res.locals.user=_user;
    }
    return next();
})

/* GET home page. */
router.get('/', function(req, res, next) {    
    res.render('page/index', {
        title: '首页',
        currentPage:0,
        photoList:[{
          picture_url:'/images/201622_hpsf01a_01_PH129300.jpg',
          caption:'孩童创意，献爱公益'
        },{
          picture_url:'/images/cny_countdown_hp.jpg',
          caption:'新春倒数'
        },{
          picture_url:'/images/extendable_table_hp_zh.jpg',
          caption:'5折优惠'
        }]
    });
});
//用户注册
router.post('/user/signup',function(req,res,next){
    var _user={
        name:req.body.name,
        password:req.body.password
    };

    User.find({
        name: _user.name
    }, function(err, user) {
        if (err) {
            console.log(err);
            res.send({code:404,message:err});
        } else if (user.length>0) {
            console.log(user,'-------------');
            res.send({code:404,message:'用户名已存在'});
        } else {
            var user = new User(_user);
            user.save(function(err, user) {
                if (err) {
                    console.log(err);
                    res.send({code:404,message:err});
                }
                res.send({code:0,message:'注册成功'});
            })
        }
    });
});
//用户登录
router.post('/user/signin',function(req,res,next){
    var _user=req.body;
    var name=_user.name,
        password=_user.password;

    User.findOne({name: name},function(err,user){
        if(err){
            res.send({code:404,message:err});
        }
        if(!user){
            res.send({code:404,message:"用户不存在"});
            return ;
        }
        user.comparePassword(password,function(err,isMatch){
            if(err){
                res.send({code:404,message:err});
                return;
            }
            if(isMatch){
                req.session.user=user;
                res.send({code:0,message:'密码正确'});
            }else{
                res.send({code:404,message:'密码错误！'});
                return;
            }
        })
    })
});
//logout
router.get('/logout',function(req,res,next){
    delete req.session.user;
    req.app.locals.user=null;
    res.redirect('/');
});

//bedroom
router.get('/bedroom', function(req, res, next) {    
    res.render('page/bedroom', {
        title: 'Bedroom',
        currentPage:1
    });
});

//Product page
router.get('/product/:id',function(req,res,next){
    var p_id=req.params.id;
    res.render('page/product',{
        title:'Product Detail',
        brand:'HEMNES 汉尼斯',
        type_color:'床架, 黑褐色',
        price:'1,549.00',
        p_id:p_id,
        info:'实木制成，它是一种结实耐用的天然材料。 床侧板含有床板高度调节设置，使您能够使用厚度不同的床垫。',
        left:'12',
        currentPage:-1
    })
});

module.exports = router;
