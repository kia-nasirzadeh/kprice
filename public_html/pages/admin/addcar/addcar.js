$(document).ready(function(){
    $("#searchInput").focus();
    $('.list-group-item').on('click', function() {
      $('.glyphicon', this)
        .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
    $(".list-group.collapse").each(function (i, group) {
      $(group).prepend(`
        <a href="#" data-href="${$(this).attr("id")}" class="list-group-item addToThisGroup">
          <span class="btn btn-sm btn-primary w-100">add in this group</span>
        </a>
      `);
    })
    $('.addToThisGroup').click(function () {
      $("#groupInput").val($(this).attr("data-href"));
    })
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
    function getApiUrl () {
      if (document.location.href.search('localhost') != -1) return "http://localhost/dashboard/kprice/public_html"
      else return "http://park-wash.ir"
    }
    $("#addNew").click(function () {
      let group = $("#groupInput").val().trim();
      let sub = $("#subGroupInput").val().trim();
      if (group == "" || sub == "") {
        alert("both group and sub must not be empty");
        return false;
      }
      console.log(group);
      console.log(sub);



      let response = confirm(`are you sure to add ${group}-${sub} to database?`);
      if (response) {
        let formdata = new FormData();
        formdata.append('group', group);
        formdata.append('sub', sub);
        let xhr = new XMLHttpRequest();
        xhr.open('post', `${getApiUrl()}/pages/admin/addcar/addCarApi.php`);
        xhr.responseType = 'json';
        xhr.send(formdata);
        xhr.onloadend = function () {
          console.log(xhr.response);
          if (xhr.response.ok) {
            window.location.href = xhr.response.urlToGo;
          } else {
            alert('❌ نتونستیم، مشکل پیش اومد')
          }
        }
      }
      // console.log(response);
      // if (response) {
      //   window.location.href = "./../manipulate/manipulate.html";
      // } else {
      //   window.location.href = "./../admin/admin.html";
      // }
    });
});
class Search {
  inputInput;
  outputDiv;
  needle = false;
  constructor (input, outputDiv) {
    this.inputInput = input;
    this.outputDiv = outputDiv;
    this.addListeners();
  }
  addListeners () {
    this.inputInput['d'] = 'this';
    $(this.inputInput).on('input', this.searchInputChange.bind(this));
  }
  searchInputChange (oldThis) {
    let val = $(oldThis.target).val();
    if (val == "") {
      this.needle = false;
      this.displayResults('');
    }
    else {
      this.needle = val;
      this.getSearchResult();
    }
  }
  getSearchResult () {
    if (!this.needle) return false;
    $.ajax({
      url: new URL(searchAPI),
      method: 'post',
      responseType: 'json',
      data: { needle: this.needle },
      success: res => this.displayResults(res),
      error: () => console.log('error')
    });
  }
  displayResults (res) {
    if (!this.needle) {
      $(this.outputDiv).html(oldresults);
    } else {
      $(this.outputDiv).empty();
      res = JSON.parse(res);
      for (let item of res) {
        $(this.outputDiv).append(`
          <a href="#" class="list-group-item">
            <i class="glyphicon glyphicon-search"></i>${item.FullName} <span class="btn btn-sm btn-primary" onclick="javascript:$('#groupInput').val('${item.group}')">add to this group</span>
          </a>
        `);
      }
      
    }
  }
}
let search = new Search($('#searchInput') ,$('#mainListDiv'));