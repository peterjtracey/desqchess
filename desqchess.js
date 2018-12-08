/*
DESQCHESS - 0.0.1 - 12/8/2018
LGPL license
https://github.com/peterjtracey/timezoneWidget
*/
var LIGHT_PIECES = 0;
var DARK_PIECES = 1;

var SIDE_QUEEN = 0;
var SIDE_KING = 1;
var SIDE_NULL = 3;

var PAWN_ID = 0;
var KNIGHT_ID = 1;
var ROOK_ID = 2;
var BISHOP_ID = 3;
var KING_ID = 4;
var QUEEN_ID = 5;

var lang = [
[LIGHT_PIECES, 'light'],
[DARK_PIECES, 'dark'],
[PAWN_ID, 'pawn'],
[KNIGHT_ID, 'knight'],
[ROOK_ID, 'rook'],
[BISHOP_ID, 'bishop'],
[KING_ID, 'king'],
[QUEEN_ID, 'queen']
];

var images = [];
images[LIGHT_PIECES] = 'img/pieces/chesswhite-s.png';
images[DARK_PIECES] = 'img/pieces/chessblack-s.png';

var piece_offsets = [];
piece_offsets[PAWN_ID] = 0;
piece_offsets[KING_ID] = 20;
piece_offsets[QUEEN_ID] = 18 * 2;
piece_offsets[BISHOP_ID] = 18 * 3;
piece_offsets[ROOK_ID] = 18 * 4;
piece_offsets[KNIGHT_ID] = 18 * 5;

;(function($, window, document, undefined) {
	var pluginName = 'desqchess';

	var chessPiece = function (piece_id, color, i, j) {
		var piece = {
			id: piece_id,
			color: color,
			start_side: j,
			coords: [i, j],
			captured_self: -1,
			captured_opponent: -1,
			idStr: function () {
				return this.id + "-" + 
					this.color + "-" + 
					this.start_side;
			},
			pieceElem: function () {
				var curPiece =  $('<div id="' + this.idStr() + '" class="piece-wrapper" data-captured_self="' + this.captured_self + '" ' +
		'data-captured_opponent="' + this.captured_opponent + '"><div></div></div>');
				var img = $('<image src="' + images[this.color] + '" class="piece-image"/>'
					).css('left', '-' + piece_offsets[this.id] + "px");
				curPiece.find('div').append(img);
				return curPiece;
			}
		};
		return piece;
	}
	
	var chessGame = function (game_id) {
		var game = {
		options: {
			board: '.board',
			piece_holder: '#piece-holder',
			game_id: GAME_ID_DEFAULT,
			piece_color: null,
			piece_offsets: []
		},
		board: [],
		capturedPieces: {
		self: [],
		opponent: []
		},
		init: function () {
			for (var i=0; i<8; i++) {
				this.board[i] = [];
				for (var j=0; j<8; j++) {
					this.board[i][j] = 0;
				}
			}
		},

		draw : function () {
			console.log(this.options);
			var boardBox = $(this.options.board);
			 
			var windowWidth = $(window).width();
			var boardHeight = 
				((windowWidth > $(window).height()) ?
				$(window).height() - 44 : windowWidth - 140); 
			


			var squareWidth = Math.round((boardHeight - 22) / 8);
			var squareHeight = Math.round((boardHeight - 22) / 8);
			var boardWidth = (squareWidth + 8) * 8;
			boardHeight = (squareWidth * 8);
			
			this.options.squareWidth = squareWidth;
			this.options.squareHeight = squareHeight;

			//console.log(boardWidth);
			boardBox.html('');
			
			var light = false;
			for (var i=0; i<8; i++) {
				boardBox.append($('<div class="board-row ' + 
					((i % 2 === 0) ? 'column-odd' : 'column-even') + ' ' +
					 ((i<4) ? 'side-a' : 'side-b') + '"></div>'));
				
			}

			var row = 0;
			boardBox.find('.board-row').each(function () {
				for (var i=0; i<8; i++) {
					light = !light;
					$(this).append($('<div class="square ' + 
						((light) ? 'square-light' : 'square-dark') + '" ' +
						' id="' + row + '-' + i + '"></div>')
						);
				}
				light = !light;
				row++;
			});
			// player1 default view
			//-------
			//a    --- opponent - dark if self = light
			//----
			//b    --- self - light if self = light
			//-------
			boardBox.find('.side-a').addClass(
				((this.options.piece_color == LIGHT_PIECES) ? 'dark-side' : 'light-side')
					);
			boardBox.find('.side-b').addClass(
				((this.options.piece_color == LIGHT_PIECES) ? 'light-side' : 'dark-side')
					);
			boardBox.find('.board-row').css('height', squareHeight + "px");
			boardBox.find('.board-row').css('width', boardWidth + "px");
			//boardBox.height(boardHeight);
			//boardBox.css('width', boardWidth).css('height', boardHeight);
			$('.piece-holder-wrapper').css('height', boardHeight + "px");
			
			return this.options.game_id;
		},
	

		start: function (game_id) {
			if (!this.options.game_id) this.options.game_id = game_id;
		
			this.writeBoardStart($(this.options.board));
		
			return this.options.game_id;
		},

		redraw: function (game_id) {
			this.draw($, this.options);
			this.writeBoard();
			return this.options.game_id;
		},

		writeBoard: function (elems) {

			var row = 0;
			
			console.log('drawing');
			var opts = this.options;
			var board = this.board;
			var pieceObj = null;
			$('.board-row').each(function () {
				var square = 0;
				$(this).find('.square').each(function () {
					pieceObj = board[row][square];
					if (pieceObj != 0) {
						$(this).append(pieceObj.pieceElem());
					}
					square++;
				});
				row++;
			});

			$('#self-pieces').html('');
			for (var i=0; i<this.capturedPieces.self.length; i++) {
				if (this.capturedPieces.self[i]) {
					$('#self-pieces').append(this.capturedPieces.self[i].pieceElem());
				}
			}
			$('#opponent-pieces').html('');
			for (var i=0; i<this.capturedPieces.opponent.length; i++) {
				if (this.capturedPieces.opponent[i]) {
					$('#opponent-pieces').append(this.capturedPieces.opponent[i].pieceElem());
				}
			}
			
			this.initUi();
			$('.piece-wrapper').width(this.options.squareWidth);
			$('.piece-wrapper').height(this.options.squareHeight);

		},

		writeBoardStart: function (elems) {

			var row = 0;
			console.log('drawing');
			var opts = this.options;
			var board = this.board;
			var pieceObj = null;
			var isLight;
			this.capturedPieces.self = [];
			this.capturedPieces.opponent = [];
			$('#self-pieces').html('');
			$('#opponent-pieces').html('');
			$('.board-row').each(function () {
				var img = null;
				pieceObj = null;
				isLight = $(this).hasClass('light-side');
				switch (row) {
				case 0: // this.options.piece_color.[light|dark]
				case 7:
					var square = 0;
					$(this).find('.square').each(function () {
						switch (square) {
						case 0 :
						case 7 : // ROOK_ID
							pieceObj = chessPiece(ROOK_ID, 
								(isLight ? LIGHT_PIECES : DARK_PIECES),
								row, square
								);
							board[row][square] = pieceObj;
							break;
						case 1 : // KNIGHT_ID
						case 6 :
							pieceObj = chessPiece(KNIGHT_ID, 
								(isLight ? LIGHT_PIECES : DARK_PIECES),
								row, square
								);
							board[row][square] = pieceObj;
							break;
						case 2 :
						case 5 : // BISHOP_ID
							pieceObj = chessPiece(BISHOP_ID, 
								(isLight ? LIGHT_PIECES : DARK_PIECES),
								row, square
								);
							board[row][square] = pieceObj;
							break;
						case 3 :
						case 4 :
							if ($(this).hasClass('square-dark')) {
								if (isLight) {
									pieceId = KING_ID;
								} else {
									pieceId = QUEEN_ID;
								}
							} else {
								if (isLight) {
									pieceId = QUEEN_ID;
								} else {
									pieceId = KING_ID;
								}
							}

							pieceObj = chessPiece(pieceId, 
								(isLight ? LIGHT_PIECES : DARK_PIECES),
								row, square
								);
							board[row][square] = pieceObj;
							break;
						}
						$(this).append(pieceObj.pieceElem());
						square++;
						img = false;
					});
	
//var KNIGHT_ID = 1;
//var ROOK_ID = 2;
//var BISHOP_ID = 3;
//var KING_ID = 4;
//var QUEEN_ID = 5;
					break;
				case 1:
				case 6:
					square = 0;
					$(this).find('.square').each(function () {
						pieceObj = chessPiece(PAWN_ID, 
							(isLight ? LIGHT_PIECES : DARK_PIECES),
								row, square
							);
						board[row][square] = pieceObj;
						$(this).append(pieceObj.pieceElem());
						square++;
					});
					break;
				}
				
				row++;
			});
			
			this.board = board;

			$('.piece-wrapper').width(this.options.squareWidth);
			$('.piece-wrapper').height(this.options.squareHeight);

			this.initUi();

			return this.options.game_id;
		},

		initUi: function() {
			var dragElem = null;
			var game = this;
			$('.piece-wrapper').draggable({
				snap: '.square',
  			snapMode: "inner",
				start: function (event, ui) {
						dragElem = $(this);
						if (!dragElem.parent().hasClass("piece-holder")) {
							dragElem = $(this).parent();
						}
						dragElem.addClass("square-start");
				},
				revert: function (valid) {
					if (!valid) {
						 dragElem.removeClass('square-start');
					}
					return !valid;
				}
			});
			$('.square').droppable({
      accept: ".piece-wrapper",
      classes: {
        "ui-droppable-active": "",
        "ui-droppable-hover": "square-selected"
      },
			drop: function( event, ui ) {
					dragElem.removeClass('square-start');
					var dropElem = $(this);

					console.log("CAPTURED?" + dragElem.parent().hasClass("piece-holder"));
					var movePiece = ((dragElem.parent().hasClass("piece-holder")) ?
						game.capturedPiece(dragElem) :
						game.squarePiece(dragElem)
							);
					var capturePiece = game.squarePiece(dropElem);

					if (!game.canMove(movePiece, capturePiece)) {
						game.redraw();
					} else {
						game.onMove(movePiece, capturePiece, dragElem, dropElem);
						game.redraw();
					}
					dragElem = null;
				}
			});
			
		}
		};

		game.canMove = function (movePiece, capturePiece) {
			if (capturePiece && movePiece.color == capturePiece.color) {
				if (capturePiece.id == PAWN_ID &&
					(capturePiece.coords[0] == 0 ||
						capturePiece.coords[0] == 7)) {
					// pawn promotion
					return true;
				}
				return false;
			}
			return true;
		};
		

		game.onMove = function (movePiece, capturePiece, dragElem, dropElem) {
			var pawnPromote = false;
			if (capturePiece) {
  			if (capturePiece.id == PAWN_ID &&
					(capturePiece.coords[0] == 0 ||
						capturePiece.coords[0] == 7)) {
					// pawn promotion
					pawnPromote = true;
				}
				capturePiece.coords = [-1, -1];
				if ((capturePiece.color == LIGHT_PIECES && this.options.piece_color == LIGHT_PIECES) || 
					(capturePiece.color == DARK_PIECES && this.options.piece_color == DARK_PIECES)) {
					capturePiece.captured_self = this.capturedPieces.self.length;
					this.capturedPieces.self[this.capturedPieces.self.length] = 
						capturePiece;
				} else {
					capturePiece.captured_opponent = this.capturedPieces.opponent.length;
					this.capturedPieces.opponent[this.capturedPieces.opponent.length] = 
						capturePiece;
				}
			}
			var newCoords = dropElem.attr('id').split('-');
			var newI = parseInt(newCoords[0]);
			var newJ = parseInt(newCoords[1]);
			if (dragElem.hasClass("square")) {
				this.board[newI][newJ] = this.board[movePiece.coords[0]][movePiece.coords[1]];
				if (!pawnPromote) this.board[movePiece.coords[0]][movePiece.coords[1]] = 0;
			} else {
				this.board[newI][newJ] = movePiece;
				if (!pawnPromote) this.removeCapturedPiece(movePiece);
			}
			this.board[newI][newJ].coords = [newI, newJ];

			return false;
		};

		game.squarePiece = function (squareElem) {
			if (!squareElem.find('div').first()) return null;
			var idStr = squareElem.find('div').first().attr('id');
			console.log(idStr);
			for (var i=0, j=0; i<this.board.length; i++) {
				for (j=0; j<this.board[i].length; j++) {
					if (this.board[i][j] != 0 && this.board[i][j].idStr() == idStr) {
						return this.board[i][j];
					}
				}
			}
			return null;
		};
		
		game.capturedPiece = function (pieceElem) {
			var indexSelf = parseInt(pieceElem.data("captured_self"));
			var indexOpp = parseInt(pieceElem.data("captured_opponent"));
			if (indexSelf > -1) {
				return this.capturedPieces.self[indexSelf];
			}
			if (indexOpp > -1) {
				return this.capturedPieces.opponent[indexOpp];
			}
		};

		game.removeCapturedPiece = function (piece) {
			if (piece.captured_self > -1) {
				this.capturedPieces.self[piece.captured_self] = null;
			}
			if (piece.captured_opponent > -1) {
				this.capturedPieces.opponent[piece.captured_opponent] = null;
			}
			piece.captured_self = -1;
			piece.captured_opponent = -1;
		};

		return game;
	}
	var games = [];

	$.fn[pluginName] = function(fname, optArg) {
		var game_id = $.data(this, pluginName, GAME_ID_DEFAULT);
		switch (fname) {
		case 'init' :
			var game = chessGame(game_id); 
			$.extend(game.options, optArg);
			game.init();
			game.draw();
			$.data(this, pluginName, game_id);
			games[game_id] = game;
			break;
		case 'get_game' :
			return ((games[options.game_id]) ? games[options.game_id] : games[GAME_ID_DEFAULT]);
		case 'start' :
			console.log('start...');
			if (!games[game_id] || games[game_id].started) return null;
			games[game_id].start(game_id, optArg);
			games[game_id].started = true;
			console.log('started!');
			game_id = games[game_id].options.game_id;
			break;
		}
		return game_id;
	};
	$(window).resize(function() {
		for (var game_id in games) {
			games[game_id].redraw(game_id);
    }
  });

})(jQuery, window, document);