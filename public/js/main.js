$(function() {
	$('.body-content').animate({ opacity: 1 });

	$('#pwConfirm').keyup(validate);

	$.each($('.before-animation'), function(i, el) {
		setTimeout(function() {
			$(el).addClass('slideFromRight');
		}, 200 + i * 200);
	});

	$('a').click(function(event) {
		linkLocation = this.href;

		if ($(this).attr('target') == '_blank') {
			redirectPage;
		} else if ($(this).hasClass('camp-link')) {
			event.preventDefault();
			$.each($('.before-animation'), function(i, el) {
				setTimeout(function() {
					$(el).addClass('slideToLeft');
				}, 100 + i * 50);
			});
			$('.body-content')
				.delay(500)
				.fadeOut(100, redirectPage);
		} else {
			event.preventDefault();
			$('.body-content').fadeOut(100, redirectPage);
		}
	});
	var prevScrollpos = window.pageYOffset;
	window.onscroll = function() {
		var currentScrollPos = window.pageYOffset;
		
		if (prevScrollpos > currentScrollPos) {
			$('#navbar').css("top","0px");
		} else {
			$('#navbar').css("top","-60px");
		}
		prevScrollpos = currentScrollPos;
	};
});

function redirectPage() {
	window.location = linkLocation;
}

function validate() {
	var password1 = $('#pw').val();
	var password2 = $('#pwConfirm').val();

	if (password1 == password2) {
		$('#valid').text('');
		$('#reg-btn').removeClass('disabled');
		$('#reg-btn').prop('disabled', false);
	} else {
		$('#valid').text('Passwords must match!');
		$('#reg-btn').addClass('disabled');
		$('#reg-btn').prop('disabled', true);
	}
}