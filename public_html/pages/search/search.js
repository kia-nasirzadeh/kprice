$(document).ready(function(){
    $('.list-group-item').on('click', function() {
      $('.glyphicon', this)
        .toggleClass('glyphicon-chevron-right')
        .toggleClass('glyphicon-chevron-down');
    });
    $("#searchInput").focus();
    $(".list-group.collapse > .list-group-item").click(function () {
      window.location.href = './../car/car.php';
    })
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
    console.log(val);
    if (val == "") this.needle = false;
    else this.needle = val;
    this.getSearchResult();
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
    if (this.needle == '') {
    } else {
      $(this.outputDiv).empty();
      res = JSON.parse(res);
      for (let item of res) {
        console.log(item);
        $(this.outputDiv).append(`
          <a href="#<?= $carName ?>" class="list-group-item" data-toggle="collapse">
            <i class="glyphicon glyphicon-search"></i>${item.FullName}
          </a>
        `);
      }
      
    }
  }
}
let search = new Search($('#searchInput') ,$('#mainListDiv'));