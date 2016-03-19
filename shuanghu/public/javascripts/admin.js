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
        product.totalAmount=form.find('#totalAmount').val();
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
        if(~~product.leftAmount>~~product.totalAmount){
            alert('剩余量不能超过总量！');
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
        var itemtotal=item.find('.totalAmount').html();
        var itemleft=item.find('.leftAmount').html();
        
        console.log(itempic);
        modal.find('#epID').val(itemId);
        modal.find('#epName').val(itemname);
        modal.find('#eprice').val(itemprice);
        modal.find('#etag').val(itemtag);
        modal.find('#epicName').text('dangqiantupian:'+itempic);
        modal.find('#einfo').val(iteminfo);
        modal.find('#etotalAmount').val(itemtotal);
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
        product.pic = form.find('#epicName').text();
        product.inputPic=form.find('#epic').val();
        product.totalAmount=form.find('#etotalAmount').val();
        product.leftAmount=form.find('#eleftAmount').val();

        if(product.pic){
            product.pic=product.pic.split('dangqiantupian:')[1];
        }else{
            alert('pic can"t be empty!');
        }
        for (var i in product) {
            if (product[i] === '') {
                if(i!='inputPic'){
                    alert(i + ' 不能为空！');
                    canPost = false;
                    break;
                }
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
        if(~~product.leftAmount>~~product.totalAmount){
            alert('剩余量不能超过总量！');
            canPost = false;
        }
        if (canPost) {
            if(product.inputPic!==''){
                var url='/admin/updateProduct';
                var data=new FormData($('#editProductForm')[0]);
                $.ajax({
                url: url,
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
            }else{
                var url='/admin/updateProductPicNotChange';
                var data={
                    id:product.id,
                    name:product.name,
                    price:product.price,
                    tag:product.tag,
                    info:product.info,
                    pic:product.pic,
                    totalAmount:product.totalAmount,
                    leftAmount:product.leftAmount
                };
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: data,
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

    $('.hotSelling').click(function(){
        var myChart=echarts.init($('#wrap')[0]);
        $.ajax({
            type:'GET',
            url:'charts',
            success:function(res){
                var result=res.sellsData;
                var x=[];
                var seriesData=[];
                result.forEach(function(item,i){
                    x.push(item.name);
                })
                result.forEach(function(item,i){
                    seriesData.push(item.sold);
                })
                var option = {
                    title: {
                        text: '热销商品',
                        top:'bottom',
                        left:'center'
                    },
                    tooltip: {},
                    legend: {
                        data:['销量']
                    },
                    xAxis: {
                        data: x
                    },
                    yAxis: {
                        name:'件数',
                        type:'value'
                    },
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: seriesData,
                        itemStyle:{
                            normal:{
                                lable:{show:true,position:'top'},
                                width:1
                            }
                        }
                    }]
                };
                myChart.setOption(option);
            },
            error:function(err){
                alert(err);
            }
        })
    })
});
