
$(function(){
	console.log("ready");
	$("#pwConfirm").keyup(validate);

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