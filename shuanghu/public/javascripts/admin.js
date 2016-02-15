$(function() {
    $('.addBtn').click(function(e) {
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
            $.ajax({
                url: '/admin/addProduct',
                type: 'POST',
                data: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    tag: product.tag,
                    pic: product.pic,
                    leftAmount: product.leftAmount
                },
                success: function(res) {
                    if(res.code===0){
                        alert(res.message);
                        // location.reload();
                    }else{
                        alert(res.message);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            });
            // $.ajax({
            //     url: '/admin/uploadImg',
            //     type: 'POST',
            //     data: {
            //         pic: product.pic
            //     },
            //     contentType:'multipart/form-data'
            //     success: function(res) {
            //         if(res.code===0){
            //             // alert(res.message);
            //             // location.reload();
            //         }else{
            //             alert(res.message);
            //         }
            //     },
            //     error: function(err) {
            //         console.log(err);
            //     }
            // });
        }
    })
});
