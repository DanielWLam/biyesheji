$(function() {
  var addToCar = $('#toCar');


  addToCar.click(function() {
    var pid = $('.pid').text();
    var amount = $('#amount').val();
    var left = $('#productLeft').val();

    if (~~left >= ~~amount) {
      $.ajax({
        url: '/addToCar',
        type: 'POST',
        data: {
          pid: pid,
          amount: amount,
          left: left
        },
        success: function(res) {
          if (res.code === 0) {
            $('#productLeft').val(~~left - ~~amount);
            console.log(res.message);
          } else {
            alert(res.message);
          }
        },
        error: function(err) {
          alert(err);
        }
      })
    }else{
      alert('库存不足啊亲！');
    }
  })
})