$(function() {
    //caches a jQuery object containing the header element
    var header = $(".header-position");
    var homeSections = $(".home-sections");
    console.log(homeSections.length);
    if($(window).height() < 640) {
      header.removeClass("normal").addClass("small");
      header.height(64);
    } else if(homeSections.length > 0) {
        $(window).scroll(function() {
            var scroll = $(window).scrollTop();
            header.height(Math.max(64, Math.min(256-scroll, 256)));
            if(header.height() <= 64 || $(window).height() < 800) {
              header.removeClass("normal").addClass("small");
            } else {
              header.removeClass("small").addClass("normal");
            }
        });
    } else {
      header.removeClass("normal").addClass("small");
      header.height(64);
    }

  // handle links with @href started with '#' only
  $(document).on('click', 'a[href^="#"]', function(e) {
    // target element id
    var id = $(this).attr('href');

    // target element
    var $id = $(id);
    if ($id.length === 0) {
        return;
    }

    // prevent standard hash navigation (avoid blinking in IE)
    e.preventDefault();

    // top position relative to the document
    var pos = $(id).offset().top - 64;

    // animated top scrolling
    $('body, html').animate({scrollTop: pos});
  });
});
