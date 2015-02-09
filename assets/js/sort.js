$(document).ready(function(){
  $('.category-button').click(function(){
     var clickedItemID = $(this).attr('id');
     if(clickedItemID === 'all') {
       $('.portfolio-element').removeClass('active');
       $('.portfolio-element').addClass('active');
     } else {
       $('.portfolio-element').removeClass('active');
       $('.portfolio-element.'+clickedItemID).addClass('active');
     }
   });
});
