
$(function(){
	console.log("ready");
	$("#pwConfirm").keyup(validate);
	
	$.each($('.before-animation'), function(i, el){
    setTimeout(function(){
		$(el).addClass('slideFromRight')
    },200 + ( i * 200 ));
});

});

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