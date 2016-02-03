$(function() {
    // $.ajax({
    //     url:'/admin/productList',
    //     type:'GET',
    //     data:{},
    //     success:function(res){
    //         if(res.code===0){
                
    //         }else{
    //             alert(res.message);
    //         }
    //     },
    //     error:function(err){
    //         alert(err);
    //     }
    // });

    $('.addBtn').click(function(e) {
        var form = $(this).closest('form');
        var product = {};
        var canPost = true;
        product.id = form.find('#pID').val();
        product.name = form.find('#pName').val();
        product.price = form.find('#price').val();
        product.tag = form.find('#tag').val();
        product.pic = form.find('#pic').val();
        product.leftAmount = form.find('#leftAmount').val();
        for (var i in product) {
            if (product[i] === '') {
                alert(i + ' can not be empty!');
                canPost = false;
                break;
            }
        }

        if (typeof(product.price - 0) !== 'number') {
            alert('Price must be number');
            canPost = false;
        }
        if (typeof(product.leftAmount - 0) !== 'number') {
            alert('Left amount must be number');
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
                        location.reload();
                    }else{
                        alert(res.message);
                    }
                },
                error: function(err) {
                    console.log(err);
                }
            })
        }
    })
});
