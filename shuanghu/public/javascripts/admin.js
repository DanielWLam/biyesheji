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
        console.log(12)
        var item=$(e.target).closest('.row');//.find('.id').html();
        var modal=$('#editProductModal');

        var itemId=item.find('.id').html();
        var itemname=item.find('.name').html();
        var itemprice=item.find('.price').html();
        var itemtag=item.find('.tag').html();
        var itempic=item.find('.pic').html();
        var itemleft=item.find('.leftAmount').html();
        console.log(itempic)
        
        modal.find('#epID').val(itemId);
        modal.find('#epName').val(itemname);
        modal.find('#eprice').val(itemprice);
        modal.find('#etag').val(itemtag);
        modal.find('#eleftAmount').val(itemleft);
    });

    $('.editSaveBtn').click(function(e){
        e.preventDefault();
        var form = $(this).closest('form');
        var product = {};
        var canPost = true;
        product.id = form.find('#pID').val();
        product.name = form.find('#pName').val();
        product.price = form.find('#price').val();
        product.tag = form.find('#tag').val();
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
});
