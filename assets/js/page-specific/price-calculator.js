/*limestudios-site - Primary JS components - v0.0.0 - 2014-09-08*/!function(a){function b(){a(".category-selection input").click(function(b){b.preventDefault();var d=b.target,e=d.getAttribute("value");a(".category-selection label").removeClass("active"),a(d).parent().addClass("active"),c=e,a(".category-name").animate({opacity:0},200,function(){a(this).text(e)}).animate({opacity:1},200);var f="section."+c;a(".category-sections").animate({opacity:0},200,function(){a(".category-sections section").removeClass("active"),a(".category-sections section").hide(),a(f).addClass("active"),a(f).show()}).animate({opacity:1},200)})}var c="Web";a(function(){b()})}(jQuery);