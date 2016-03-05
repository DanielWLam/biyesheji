$(function(){
  var searchBtn=$('#searchBtn');
  searchBtn.click(function(){
    var value=$('#searchField').val();
    if(value===''){
      alert('不能为空');
      return;
    }
    location.href='/search/'+value;
  })
})