$(document).ready(function(){

  // GET DOING

  $.getJSON("https://api.trello.com/1/list/540610612fd06fe2a9e8c819/cards/?&callback=?", {
    key: 'f0eb9bda36de7506805401cd7cd23dde'
  })
  .success(function(responseObj) {
    $(".loader.status-in-progress").remove();
    for(var i = 0; i < responseObj.length; i++) {
      $(".status-in-progress").append(
        '<article class="col col-p-12 col-wp-12 col-t-12 col-wt-4 col-c-3">'+
        '<div class="padding">'+
          responseObj[i].name+
        '</div></article>'
      );
    }
  });

  // GET PLANNED

  $.getJSON("https://api.trello.com/1/list/540610612fd06fe2a9e8c818/cards/?&callback=?", {
    key: 'f0eb9bda36de7506805401cd7cd23dde'
  })
  .success(function(responseObj) {
    $(".loader.status-planned").remove();
    for(var i = 0; i < responseObj.length; i++) {
      $(".status-planned").append(
        '<article class="col col-p-12 col-wp-12 col-t-12 col-wt-4 col-c-3">'+
        '<div class="padding">'+
          responseObj[i].name+
        '</div></article>'
      );
    }
  });

  // GET BUGS

  $.getJSON("https://api.trello.com/1/list/5406109321ab80964951f521/cards/?&callback=?", {
    key: 'f0eb9bda36de7506805401cd7cd23dde'
  })
  .success(function(responseObj) {
    $(".loader.status-bugs").remove();
    for(var i = 0; i < responseObj.length; i++) {
      $(".status-bugs").append(
        '<article class="col col-p-12 col-wp-12 col-t-12 col-wt-4 col-c-3">'+
        '<div class="padding">'+
          responseObj[i].name+
        '</div></article>'
      );
    }
  });
});
