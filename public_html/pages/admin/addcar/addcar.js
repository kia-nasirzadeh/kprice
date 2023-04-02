$(document).ready(function(){
    $("#searchInput").focus();
    $('.list-group-item').on('click', function() {
      $('.glyphicon', this)
        .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
    $(".list-group.collapse").prepend(`
      <a href="#" class="list-group-item">
        <span class="btn btn-sm btn-primary w-100 addNewSubgroup">add in this group</span>
      </a>
    `);
    $(".addNewSubgroup").click(function () {
      let group = $(this).parents('.list-group.collapse').attr("data-group");
      $("#groupInput").val(group);
      $("#subGroupInput").focus();
    });
    $("#subGroupInput").keydown(function (ev) {
      let keycode = ev.keyCode;
      if (keycode == 9) {
        ev.preventDefault();
        $("#addNew").focus();
      }
    });
    $("#addNew").keydown(function (ev) {
      if (ev.keyCode == 13) {
        $(this).trigger("click");
      }
    })
    $("#addNew").click(function () {
      let group = $("#groupInput").val().trim();
      let sub = $("#subGroupInput").val().trim();
      if (group == "" || sub == "") {
        alert("both group and sub must not be empty");
        return false;
      }
      console.log(group);
      console.log(sub);
      let response = confirm(`we added ${group}-${sub} to database, would you like to edit it?`);
      console.log(response);
      if (response) {
        window.location.href = "./../manipulate/manipulate.html";
      } else {
        window.location.href = "./../admin/admin.html";

      }
    });
});