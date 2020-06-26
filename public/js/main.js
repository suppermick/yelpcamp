
$(function(){
	
	$(".body-content").animate({opacity:1});	
	
	$("#pwConfirm").keyup(validate);
	
	$.each($('.before-animation'), function(i, el){
		setTimeout(function(){
			$(el).addClass('slideFromRight')
		},200 + ( i * 200 ));
	
	});
	
	$("a").click(function(event){
		
		event.preventDefault();
		linkLocation = this.href;
		
		if ( $(this).attr('target') == '_blank' ){
			
			return;
		
		} else if ( $(this).hasClass("camp-link")) {
			
			$.each($('.before-animation'), function(i, el){
				setTimeout(function(){
					$(el).addClass('slideToLeft')
				},100 + ( i * 50 ));
				
			});
			$(".body-content").delay(650).fadeOut(100, redirectPage);
			
		} else {
				   
			$(".body-content").fadeOut(100, redirectPage);
		}
	});
	
});

function redirectPage() {
    window.location = linkLocation;
}

function validate() {
  var password1 = $("#pw").val();
  var password2 = $("#pwConfirm").val();

    
 
    if(password1 == password2) {
		$("#valid").text("");
		$("#reg-btn").removeClass("disabled");
		$("#reg-btn").prop('disabled', false);
    }
    else {
        $("#valid").text("Passwords must match!");
		$("#reg-btn").addClass("disabled");
		$("#reg-btn").prop('disabled', true);
    }
    
}