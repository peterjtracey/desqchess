
var GAME_ID_DEFAULT = 1;
var game;
(function ($) {
	$(document).ready(function () {
		
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

		var game_id;

		var startGame = function () {
			console.log($("#radio-piece :radio:checked").attr('id'));
			options.piece_color = ($("#radio-piece :radio:checked").attr('id') == 'player-color1') ?
				LIGHT_PIECES : DARK_PIECES;
			game_id = $(".board").desqchess('init', options);
		
			//$('#piece-form-holder').hide('slow');
			$('#right-column').toggle('slow');
/*
			$('.calendar').each(function () {
				$(this).jqCal(calOpts);
				calOpts.date.setMonth(calOpts.date.getMonth() + 1);
				});
*/			
			$(".board").hide();
			$(".board").desqchess('start', game_id);
			$(".board").show("slow");
				//$('body').css('background-image', 'url(img/backgrounds/' + backgrounds[backgroundIndex] + ')');
				
		};
  
	
		$("#logo-expand").click(function () {
			$('#right-column').toggle('slow');
		});

		var backgrounds = 
[
'marble.jpg',
'wood.jpg',
'sky.jpg'
];


		$('#start-game').click(startGame);
		$('#start-game').trigger('click');

	});
})(jQuery);