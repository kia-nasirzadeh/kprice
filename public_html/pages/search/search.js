$(document).ready(function(){
    $('.list-group-item').on('click', function() {
      $('.glyphicon', this)
        .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
    $("#searchInput").focus();
    $(".list-group.collapse > .list-group-item").click(function () {
      window.location.href = './../car/car.html';
    })
});