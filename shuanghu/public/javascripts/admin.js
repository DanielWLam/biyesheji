$(function() {
    $('.addBtn').click(function(e) {
        e.preventDefault();
        var form = $(this).closest('form');
        var product = {};
        var canPost = true;
        product.id = form.find('#pID').val();
        product.name = form.find('#pName').val();
        product.price = form.find('#price').val();
        product.tag = form.find('#tag').val();
        product.info=form.find('#info').val();
        product.pic = form.find('#pic').val();
        product.pic=product.pic.split('fakepath\\')[1];
        product.leftAmount = form.find('#leftAmount').val();
        for (var i in product) {
            if (product[i] === '') {
                alert(i + ' 不能为空！');
                canPost = false;
                break;
            }
        }

        if (typeof(product.price - 0) !== 'number') {
            alert('价格必须是数字');
            canPost = false;
        }
        if (typeof(product.leftAmount - 0) !== 'number') {
            alert('剩余量必须是数字');
            canPost = false;
        }
        if (canPost) {
            var data=new FormData($('#addProductForm')[0]);
            $.ajax({
                url: '/admin/addProduct',
                type: 'POST',
                data: data,
                processData:false,
                contentType:false,
                success: function(res) {
                    if(res.code===0){
                        alert(res.message);
                        location.reload();
                    }else{
                        alert(res.message);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });
    
    $('.ediBtn').click(function(e){
        var item=$(e.target).closest('tr');//.find('.id').html();
        var modal=$('#editProductModal');

        var itemId=item.find('.id').html();
        var itemname=item.find('.name').html();
        var itemprice=item.find('.price').html();
        var itemtag=item.find('.tag').html();
        var iteminfo=item.find('.info').html();
        var itempic=item.find('.pic').html();
        var itemleft=item.find('.leftAmount').html();
        
        modal.find('#epID').val(itemId);
        modal.find('#epName').val(itemname);
        modal.find('#eprice').val(itemprice);
        modal.find('#etag').val(itemtag);
        modal.find('#einfo').val(iteminfo);
        modal.find('#eleftAmount').val(itemleft);
    });

    $('.editSaveBtn').click(function(e){
        e.preventDefault();
        var form = $(this).closest('form');
        var product = {};
        var canPost = true;
        product.id = form.find('#epID').val();
        product.name = form.find('#epName').val();
        product.price = form.find('#eprice').val();
        product.tag = form.find('#etag').val();
        product.info=form.find('#einfo').val();
        product.pic = form.find('#epic').val();

        if(product.pic){
            product.pic=product.pic.split('fakepath\\')[1];
        }else{
            alert('pic can"t be empty!');
        }
        product.leftAmount = form.find('#leftAmount').val();
        for (var i in product) {
            if (product[i] === '') {
                alert(i + ' 不能为空！');
                canPost = false;
                break;
            }
        }

        if (typeof(product.price - 0) !== 'number') {
            alert('价格必须是数字');
            canPost = false;
        }
        if (typeof(product.leftAmount - 0) !== 'number') {
            alert('剩余量必须是数字');
            canPost = false;
        }
        if (canPost) {
            var data=new FormData($('#editProductForm')[0]);
            $.ajax({
                url: '/admin/updateProduct',
                type: 'POST',
                data: data,
                processData:false,
                contentType:false,
                success: function(res) {
                    if(res.code===0){
                        alert(res.message);
                        location.reload();
                    }else{
                        alert(res.message);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
        }
    });

    $('.delBtn').click(function(e){
        var item=$(e.target).closest('tr');
        var itemId=item.find('.id').html();
        if(confirm('确定要删除这件商品吗？')){
            $.ajax({
                type:'POST',
                url:'/admin/deleteProduct',
                data:{
                    id:itemId
                },
                success:function(res){
                    if(res.code===0){
                        alert(res.message);
                        location.reload();
                    }else{
                        alert(res.message);
                    }
                },
                error:function(err){
                    alert(err);
                }
            })
        }
    })
});
