var initChat;
var soundTimer;
var sound = function (soundName, now) {
	if (now) {
		$.ionSound.play(soundName);
	}
	if (soundTimer) window.clearTimeout(soundTimer);
	soundTimer = window.setTimeout(function () {
		$.ionSound.play(soundName);
	}, 500);
};

(function (window, $) {
	var tzObj;
	var questionActions = 
		"";
	var questions = [];
	var challenges = [];
	var joins = [];
	var game;
	var asked = function (id) {
		for (var i=0; i<questions.length; i++) {
			if (questions[i] == id) return true;
		}
		return false;
	};
	var challenged = function (id) {
		for (var i=0; i<challenges.length; i++) {
			if (challenges[i] == id) return true;
		}
		return false;
	};
	var joined = function (id) {
		for (var i=0; i<joins.length; i++) {
			if (joins[i] == id) return true;
		}
		return false;
	};
	var self = function (id) {
		
		return askuschat.self.ID == parseInt(id);
	};
	$(function () {
		$("#askus_chat_container").height(
			$(window.document).height() * .55
			);
		$("#askus_content").width(
			$("#askus_chat_container").width() - 220
			);
		if ($("#ask_home_question").length > 0) {
			$("#ask_home_question").focus();
			$("#askus_name").change(function () {
				$("#home_nick").val($(this).val());
			});
		}
initChat = function () {
		askuschat.init('sampleaccountapikey123', function (auApi) {
			console.log("READY CALLBACK");			
			sound('pad_confirm', true);



    	askuschat.command = function (command) {

    		console.log(command.action);
    		switch (command.action) {
    		case "join" :
    			if (!joined(command.user.ID)) {
    				sound('door_bell');
    				joins[joins.length] = command.user.ID;
    				return '<div class="au-action join-user" id="join_' + command.user.ID + '">' +
    				askuschat.markup.timeStamp(command.date) + 
	    			"<strong><i>" + command.user.getName() + "</i> (" + command.user.ID + ") " +
		    				"entered</strong> " +
		    				((!self(command.user.ID)) ? 
		    					"<button class='challenge_user' data-id='" +
		    					command.user.ID + "'>Challenge!</button>" :
		    					"") +
		    					askuschat.markup.actionSep + 
		    					'</div><br/>'
		    				askuschat.markup.actionSep;
    			}
    			break;
  			case "challenge" :
  				if (challenged(command.user.ID + "-" + command.args[1])) {

  				} else {
	    			challenges[challenges.length] = command.user.ID + "-" + command.args[1];
	  				sound("button_click", true);
	    			return '<div class="au-action challenge-accept" id="challenge_' + command.args[1] + '">' +
    				askuschat.markup.timeStamp(command.date) + 
	    			"<strong><i>" + command.user.getName() + "</i> " +
		    				"challenged " + askuschat.currentRoom.getUser(command.args[1]).getName() + " to a match:</strong> " +
		    				"" + 
		    				((self(command.args[1])) ? 
		    					"<button class='accept_challenge' data-id='" +
		    					command.user.ID + "'>Accept!</button>" :
		    					"") +
		    					askuschat.markup.actionSep + 
		    					'</div><br/>' ;
		    	}
  				break;
  			case "accept" :
  				if (self(command.args[1]) ||
  						self(command.user.ID)) {
  					var opponent = self(command.args[1]) ? command.user.ID : parseInt(command.args[1]);
						var options = {piece_color: ((self(command.args[1])) ? LIGHT_PIECES : DARK_PIECES),
							change: function (data) {
							console.log("CHANGE TO PLAYER " + opponent);
		    			askuschat.send('/gamechange ' + opponent + " " + JSON.stringify(data));
						}};
						game_id = $(".board").desqchess('init', options);
						$(".board").desqchess('start', game_id);
						game = $(".board").desqchess('get_game');
	  				sound("music_marimba_chord", true);
	    			return '<div id="accepted_' + command.args[1] + '" class="au-action">' +
    				askuschat.markup.timeStamp(command.date) + 
	    				"<strong><i>Match accepted: You are now playing against <i>" + askuschat.currentRoom.getUser(opponent).getName() + "</i>.</strong> " +
		    					askuschat.markup.actionSep + 
		    					'</div><br/>' ;
  				}
     			return '<div class="au-action" id="accepted_' + command.args[1] + '">' +
    				askuschat.markup.timeStamp(command.date) + 
    				"<strong>Match accepted: <i>" + command.user.getName() + "</i> and <i>" + askuschat.currentRoom.getUser(command.args[1]).getName() + "</i> started a game.</strong> " +
		    					askuschat.markup.actionSep + 
		    					'</div><br/>' + '' ;
  				break;

  			case "gamechange" :
  				if (self(command.args[1])) {
						console.log("CHANGE FROM PLAYER " + command.args[1]);
	  				game.loadObject(JSON.parse(unescape(command.args[2])), true);
	  				sound("water_droplet");
	  			}
  				break;
  			case "question" :
  				if (asked(command.args[1])) {

  				} else {
	    			questions[questions.length] = command.args[1];
		    		jQuery.get("/question_info/" + command.args[1], function (data) {
		    			if (!data.success) return false;
		    			$("#question_" + command.args[1]).html(
		    				"<strong><i>" + data.asked_by + "</i> " +
		    				"posted question:</strong> " +
		    				"<div class='askus_question'> " +  
		    				"<p>" + data.title + "</p>" +
		    				questionActions +  
		    				"</div><br/>"
		    					);
		    		});
	    			return '<div id="question_' + command.args[1] + '" class="au-action"></div>' + 
		    					askuschat.markup.actionSep;
	    		}
    		}

    		return false;
    	};
    	askuschat.change = function () {
				$(".accept_challenge").click(function (evt) {
					console.log("ACCEPTCLICK");
					var user_id = $(this).data("id");
					var user_name = $(this).data("name");
		    	askuschat.send('/accept ' + $(this).data('id') + ' ' + askuschat.self.ID);
		    	$(this).hide();
				});
				$("#user_list li").click(function (evt) {
					console.log("USER LIST CHALLENGE");
		    	askuschat.send('/challenge ' + $(this).data('id'));
				});
				$(".challenge_user").click(function (evt) {
		    	askuschat.send('/challenge ' + $(this).data('id'));
				});
					tzObj.translateTimes();
	    		$("#askus_content").scrollTop(
		    		$("#askus_messages").height() * 10000
	    		);
	    	};
		    if ($("#askus_question").length > 0) {
		    	console.log("SEND");
		    	askuschat.send('/question ' + $("#askus_question").val());
		    }
		});
};
		$("#user_edit_timezone").timezoneWidget({
			data: $("#user_edit_timezone").tzwData("S"),
			toggleElem: "#tzw-toggler",
			translateClass: 'tzw-translate',
			guessUserTimezone: true,
			storeCookie: true,
			loadCookie: true,
			onInit: function (api) {
				tzObj = api;
			}
		});

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
	});

})(window, jQuery);