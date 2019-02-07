console.log("FB FUNCTIONS");
function statusChangeCallback(response) {

  if (response.status === 'connected') {
    // Logged into your app and Facebook.
  	console.log(response);	
  	FB.api('/me', function(response) {
  		var user = response.name.replace(/[^A-Z\-]/gi, ".").toLowerCase();
  		$("#askus_name").val(user);
  		if ($("#askus_roomname").val().length == 0) {
  			$("#askus_roomname").val(user);
  		}
  		askuschat.changename();
  		initChat();
  		$(".fb-login-button").hide();
  		$("#chat-trigger-pullicon").show();
		});
  } else {
  	if (desqReq) {
  		$("#askus_roomname").val(user);
  		initChat();
  	}
		FB.login(function(response) {
			statusChangeCallback(response);
		}, { scope: 'user_about_me,email,public_profile,user_friends,publish_actions,user_posts' });

  }
}
function checkLoginState() {
  FB.getLoginStatus(function(response) {
  	console.log("FB LOGIN!");
  	console.log(response);
    statusChangeCallback(response);
  });
}
var GAME_ID_DEFAULT = 1;
var game;
var slider;
(function ($) {
	$(document).ready(function () {

	$("#desqsplash-image").height($(window).height());
	$("#desqsplash-image").show();

	if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
	  var ww = $(window).width() ; //get proper width
	  var mw = 640; // min width of site
	  var ratio =  ww / mw; //calculate ratio
	  if( ww < mw){ //smaller than minimum size
		$('#right-column').hide();
	   $('#Viewport').attr('content', 'initial-scale=' + ratio + ', maximum-scale=' + ratio + ', minimum-scale=' + ratio + ', user-scalable=yes, width=' + ww);
	  }else{ //regular size
	   $('#Viewport').attr('content', 'initial-scale=1.0, maximum-scale=2, minimum-scale=1.0, user-scalable=yes, width=' + ww);
	  }
	}
	//game.start
	$( "#start-game" ).button();
	$( "#radio-piece" ).buttonset();
	var dateMonth = new Date();
	dateMonth.setDate(1);
	var calOpts = {
			date: dateMonth
			};
	var options = {piece_color: LIGHT_PIECES};

	options.piece_offsets = [];
	options.piece_offsets[PAWN_ID] = 0;
	options.piece_offsets[KING_ID] = 20;
	options.piece_offsets[QUEEN_ID] = 18 * 2;
	options.piece_offsets[BISHOP_ID] = 18 * 3;
	options.piece_offsets[ROOK_ID] = 18 * 4;
	options.piece_offsets[KNIGHT_ID] = 18 * 5;


	options.change = function () {
			sound("button_click", false);
	};

	var game_id;

	var startGame = function () {
		console.log($("#radio-piece :radio:checked").attr('id'));
		options.piece_color = ($("#radio-piece :radio:checked").attr('id') == 'player-color1') ?
			LIGHT_PIECES : DARK_PIECES;
		game_id = $(".board").desqchess('init', options);
		console.log("GAMEID:" + game_id);
		//$('#piece-form-holder').hide('slow');
		$('#right-column').toggle('slow');
/*
		$('.calendar').each(function () {
			$(this).jqCal(calOpts);
			calOpts.date.setMonth(calOpts.date.getMonth() + 1);
			});
*/			
		settingsSlider.slideReveal("hide");
		$(".board").hide();
		$(".board").desqchess('start', game_id);
		$(".board").show("slow");
			//$('body').css('background-image', 'url(img/backgrounds/' + backgrounds[backgroundIndex] + ')');
			sound("music_marimba_chord", false);
	};


	$("#logo-expand").click(function () {
		$('#right-column').toggle('slow');
	});

	$("#settings-trigger-pullicon").click(function () {
		$.ionSound({
		    sounds: [
		        {name: "beer_can_opening"},
		        {name: "bell_ring"},
		        {name: "branch_break"},
		        {name: "button_click"},
		        {name: "pop_drip"},
		        {name: "pad_confirm"},
		        {name: "music_marimba_chord"},
		        {name: "door_bump"},
		        {name: "door_bell"},
		        {name: "water_droplet"}
		    ],

		    // main config
		    path: "/js/ion-sound/sounds/",
		    preload: true,
		    multiplay: true,
		    volume: 0.9
		});
			chatSlider.slideReveal("hide");
	});
	$("#chat-trigger-pullicon").click(function () {
			settingsSlider.slideReveal("hide");
	});
	settingsSlider = $("#settings-column").slideReveal({
	  trigger: $("#settings-trigger-pullicon"),
	  position: 'left',
	  push: false,
	  overlay: true,
	  autoEscape: true,
	  width: 250,
	  speed: 700,
	  top: 40
	});

	chatSlider = $("#auc_wrapper").slideReveal({
	  trigger: $("#chat-trigger-pullicon"),
	  position: 'left',
	  push: false,
	  overlay: true,
	  autoEscape: true,
	  width: '100%',
	  speed: 700,
	  top: 40
	});

	$(".slidereveal-heading").click(function () {
			settingsSlider.slideReveal("hide");
			chatSlider.slideReveal("hide");
	});
	var backgrounds = 
[
'marble.jpg',
'wood.jpg',
'sky.jpg'
];


	$('#start-game').click(startGame);
	$('#start-game').trigger('click');

	$("#askus_chat_container").height(
		$(window.document).height() * .75
		);
	

	$("#zoom-in").click(function () {
		$("#wrapper").addClass("zoomed");
		$(this).prop("disabled", true);
		$("#zoom-in").prop("disabled", false);
	});

	$("#zoom-out").click(function () {
		$("#wrapper").removeClass("zoomed");
		$(this).attr("disabled", true);
		$("#zoom-out").prop("disabled", false);
	});

	$("#btn-undo").click(function () {
		if (!$(".board").desqchess('undo', game_id)) {
			$("#btn-undo").prop("disabled", true);
		}
		$("#btn-redo").prop("disabled", false);
	});
	$("#btn-redo").click(function () {
		if (!$(".board").desqchess('redo', game_id)) {
			$("#btn-redo").prop("disabled", true);
		}
		$("#btn-undo").prop("disabled", false);
	});

	window.setTimeout(function () {
		$("#desqsplash").hide();
	}, 2500);
	});
})(jQuery);