/*limestudios-site - Primary JS components - v0.0.0 - 2014-10-19*/!function(a){function b(){a(".client-unit").first().addClass("active-client"),a(".client-logo").first().addClass("active-client"),a(".client-logo").click(function(){var b=a(this),c=b.parent().children(),d=c.index(b);a(".client-unit").removeClass("active-client").eq(d).addClass("active-client"),c.removeClass("active-client"),b.addClass("active-client")}),a(".client-control-next, .client-control-prev").click(function(){var b=a(this),c=a(".clients-belt").find(".active-client"),d=a(".clients-belt").children().index(c),e=a(".client-unit").length;b.hasClass("client-control-next")?e-1>d?a(".active-client").removeClass("active-client").next().addClass("active-client"):(a(".client-unit").removeClass("active-client").first().addClass("active-client"),a(".client-logo").removeClass("active-client").first().addClass("active-client")):d>0?a(".active-client").removeClass("active-client").prev().addClass("active-client"):(a(".client-unit").removeClass("active-client").last().addClass("active-client"),a(".client-logo").removeClass("active-client").last().addClass("active-client"))})}a(function(){b()})}(jQuery);