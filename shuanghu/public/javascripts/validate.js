$(function(){
    $('#regBtn').click(function(e){
        e.preventDefault();
        var modal=$('#signupModal');
        var name=modal.find('#signupName').val(),
            password=modal.find('#signupPassword').val(),
            passwordAgain=modal.find('#signupPasswordAgain').val();

        if(inputNotEmpty($(this),'#signupModal')){
            if(password!==passwordAgain){
                alert('两次输入的密码不一致');
            }else{
                $.ajax({
                    url:'/user/signup',
                    type:'POST',
                    data:{
                        name:name,
                        password:password,
                        passwordAgain:passwordAgain
                    },
                    success:function(res){
                        if(res.code===0){
                            location.reload();
                            alert(res.message);
                        }else{
                            alert(res.message);
                        }
                    },
                    error:function(err){
                        console.log(err);
                    }
                });
            }
        }
    });

    $('#loginBtn').click(function(e){
        e.preventDefault();
        var modal=$('#signinModal');
        var name=modal.find('#signinName').val(),
            password=modal.find('#signinPassword').val();
        if(inputNotEmpty($(this),'#signinModal')){
            $.ajax({
                url:'/user/signin',
                type:'POST',
                data:{
                    name:name,
                    password:password
                },
                success:function(res){
                    if(res.code!==0){
                        alert(res.message);
                    }else{
                        console.log(res.message);
                        //location.reload();
                    }
                },
                error:function(err){
                    console.log(err);
                }
            })
        }
    });

    function inputNotEmpty(c,p){
        var input=$(c).closest(p).find('input');
        for(var i=0;i<input.length;i++){
            if(input[i].value==''){
                alert('不能为空');
                return false;
            }
        }
        return true;
    }
});