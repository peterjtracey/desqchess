/*
AskUs.chat Community Client
v3.0.5 Dec 2018
AskUs.chat can be added to your site for a low monthly fee.
http://askus.chat
*/
(function (w, d) {
var w = window;
var d = document;
var f = d.forms['askus_send'];
var askus = {
	readyCallback: null,
	command: function () {},
	change: function () {},
	init: function (apikey, readyCallback) { 
		if (readyCallback) this.readyCallback = readyCallback;
		console.log("INIT SET CALLBACK");
		this.com = new AskUsCommunicator();
		this.com.setRequestPage(this.REQUEST_URL);
		this.com.setVariable("apikey", apikey);
		this.com.send();
	},
	ready: false,
	REQUEST_URL: "https://secure.askuschat.com/api",
 	DEFAULT_NAME: "Guest",
	changeName: false,
	sendMessage: "",
	rooms: [],
	currentRoomID: f.elements["askus_roomid"].value,
	currentRoomName: f.elements["askus_roomname"].value,
	self: {},
	com: null,
	timeout: null,
	changename: function () {
	 this.changeName = true;
	 this.self.name = f.elements["askus_name"].value;
	},
	addroom: function (iRoomID, sName) {
		d.all["askus_room_title"].innerHTML = sName;
		this.rooms[this.rooms.length] = new room(iRoomID, sName);
		debug("addroom" + iRoomID);
		this.com.reset();
		this.com.setVariable("action", "9");
		this.com.setVariable("sid", f.elements["askus_sid"].value);
		this.com.setVariable("userid", f.elements["askus_userid"].value);
		this.com.setVariable("roomid", iRoomID);
		this.com.setVariable("roomname", sName);
		this.com.setVariable("name", f.elements["askus_name"].value);
		this.com.send();
	}, 
	drawuserlist: function () {
		var sHTML = '<ul id="user_list">';
		for (var i=0; i<askus.currentRoom.users.length; i++) {
			sHTML += '<li class"listitem" data-id="' + 
				askus.currentRoom.users[i].ID + '"><strong>' + askus.currentRoom.users[i].getName() + ' (' + askus.currentRoom.users[i].ID + ')</strong></li>';
		}
		sHTML += '</ul>';
		d.all["askus_userlist"].innerHTML = sHTML;
	},
	drawmoderatorlist: function () {
		var sHTML = '<TABLE CELLPADDING="0" CELLSPACING="0">';
		for (var i=0; i<askus.currentRoom.moderators.length; i++) {
			sHTML += '<TR><TD CLASS="listitem"><strong>' + askus.currentRoom.moderators[i].getName() + '</strong></TD></TR>';
		}
		sHTML += '</TABLE>';
		d.all["askus_moderators"].innerHTML = sHTML;
	},
	message: function (iRoomID, iModeratorID, iUserID, sMessage, iMessageID, sMessageDate) {
		if (askus.currentRoom != null &&
			askus.currentRoom.ID == 0) {
			askus.currentRoom.ID = iRoomID;
			var oRoom =  askus.currentRoom;
 		} else if (askus.currentRoom != null &&
		 iRoomID == askus.currentRoom.ID) {
			var oRoom =  askus.currentRoom;
			askus.currentRoom.lastMessageID = iMessageID;
		} else {
			var oRoom =  askus.rooms[askus.roomindex(iRoomID)];
		}
		oRoom.lastMessageID = iMessageID;
		var oUser = oRoom.getUser(iUserID);
		var oModerator = null;
		if (oUser == null) oModerator = oRoom.getModerator(iModeratorID);
		if (sMessage && sMessage.length) {
			if (sMessage.indexOf("/") == 0) {
				var oCommand = command(sMessage, oUser, oRoom, sMessageDate);
				sMessage = "";
				switch (oCommand.action) {
				case "nick" :
					if (iUserID == askus.self.ID) {
						this.changeName = false;
					} else {
						sMessage = "<div class='au-action'><strong>" + 
							oUser.getName() + " (" + iUserID + ") changed name to " + oCommand.args[1] + ".</strong>" + 
							this.markup.actionSep +
							"</div><br/>";
					}
					oUser.name = oCommand.args[1];
					askus.drawuserlist();
					break;
				case "endchat" :
					w.onbeforeunload = null;
					w.onunload = null;
					d.location.href = "contribuhelpend.php";
					break;
				case "join" :
					if (iUserID == askus.self.ID) {
 						d.all["askus_room_title"].innerHTML = "<strong>" + oRoom.name + "</strong>";
						//window.document.title = "Discussion Room: " + oRoom.name + " - AskUs";
					} else { //"<strong>" + oCommand.args[1] + " (" + iUserID + ") entered.</strong>" + this.markup.actionSep;
						askus.drawuserlist();
					}
					if (oUser == null) {
						oCommand.user = new user(
								iUserID, 
								oCommand.args[1]
							);
						askus.currentRoom.users[askus.currentRoom.users.length] = oCommand.user;
						askus.drawuserlist();
					}
					break;
  			default: 
						sMessage = "";
						break;
				}
				var msgRet = this.command(oCommand);
				if (msgRet) sMessage = msgRet;
		} else {
				if (iUserID > 0) {
					sMessage = 
						"<span class='askus-message-container'>" + 
						"<span class='askus-messagedate tzw-translate' " +
						"data-tzwdate='" + sMessageDate + "' " +
						"data-tzwformat='h:mma'>" +
						 "</span>" +
											"<span class='messagename'>" + 
						oUser.getName() + 
						" (" + oUser.ID + ")</span>" + 
						"<span class='messagetext'>" + 
						sMessage + "</span>" + 
						 "</span><br/>";

				} else if (oModerator != null) sMessage = "<span='messagename'>" + oModerator.getName() + " (moderator)</span><span class='messagetext'>" + sMessage + "</span><br/>";
				else sMessage = "<span class='messagetext'>" + sMessage + "</span><hr/>";
			}
			if (sMessage.length > 0) {
				d.all["askus_messages"].innerHTML += sMessage;
				oRoom.addMessage(sMessage);
			}
		}
	//	f.elements["askus_message"].focus();
	},
  query: function () {
  	console.log("QUERY: " + askus.sendMessage);
		w.clearTimeout(askus.timeout);
		askus.com.reset();
		askus.com.setVariable("action", (askus.sendMessage.length) ? "2" : "3");
		askus.com.setVariable("userid", askus.self.ID);
		askus.com.setVariable("roomid", ((askus.currentRoom != null) ? askus.currentRoom.ID : ""));
		askus.com.setVariable("messageid", ((askus.currentRoom != null) ? askus.currentRoom.lastMessageID : ""));
		askus.com.setVariable("type", "3");
		askus.com.setVariable("name", escape(f.elements["askus_name"].value));
		askus.com.setVariable("changename", ((askus.changeName) ? 1 : 0));
		askus.com.setVariable("message", escape(askus.sendMessage));
		askus.sendMessage = "";
		askus.changeName = false;
		askus.com.send();
	},
  close: function () {
	},
  endchat: function () {
		this.com.reset();
		this.com.setVariable("action", "6");
		this.com.setVariable("userid", f.elements["askus_userid"].value);
		this.com.send();
	}, 
	sendmessage: function () { 
		askus.debug("send" + askus.currentRoom + askus.ready + f.elements["askus_sendtext"].value);
		if (!askus.ready || 
			!f.elements["askus_sendtext"].value.length || 
			askus.currentRoom == null) return;
		askus.sendMessage += f.elements["askus_sendtext"].value + " ";
		var sMessage = 
						"<span class='askus-messagedate tzw-translate' " +
						"data-tzwdate='' " +
						"data-tzwformat='h:mma'>" +
						 "</span>" +
			"<span class='messagenameself'>" + 
			f.elements["askus_name"].value + 
			"</span>" + 
			"<span class='messagetextself'>" + f.elements["askus_sendtext"].value + "</span><br/>";
		//d.all["askus_messages"].innerHTML += sMessage;
		//askus.currentRoom.addMessage(sMessage);
		f.elements["askus_sendtext"].value = "";
	},
	send: function (s) {
		askus.com.reset();
		askus.com.setVariable("action", "2");
		askus.com.setVariable("userid", askus.self.ID);
		askus.com.setVariable("roomid", askus.currentRoom.ID);
		askus.com.setVariable("messageid", askus.currentRoom.lastMessageID);
		askus.com.setVariable("changename", 0);
		askus.com.setVariable("message", escape(s));
		askus.com.send();
	},
	roomindex: function (iRoomID) {
		for (var i=0; i<this.rooms.length; i++) if (iRoomID == askus.rooms[i].ID) return i;
		return 0;
	},

	markup: {
		actionSep: "<hr color='#003366'/>",
		timeStamp: function (date) {
			return "<span class='askus-messagedate tzw-translate' " +
						"data-tzwdate='" + date + "' " +
						"data-tzwformat='h:mma'>" +
						 "</span>";
		}
	},

  debug: function (s) {
		//document.all["debug"].value += "\r\n'" + s + "'";
	}


};
askuschat = askus;

function debug(s) {
	//document.all["debug"].value += "\r\n'" + s + "'";
}
function AskUsCommunicatorDataReceived(data) {
	var multidata = data.split(/\r\n\r\n\r\n\r\n/);
	if (multidata.length > 1) {
			for (var i=0; i<multidata.length; i++) {
				AskUsCommunicatorDataReceived(multidata[i]);
			}
			return;
	}
	if (askus.timeout) w.clearTimeout(askus.timeout);
	askus.com.load(data); 
	switch (askus.com.data.Get("action")) {
	case "init" :
//		console.log("REQUEST URL:::" + askus.com.data.Get("request_url"));
		var sid = f.elements['askus_sid'].value;
		askus.com.setRequestPage(askus.com.data.Get("request_url"));
		askus.com.setVariable("action", "1");
		askus.com.setVariable("type", "5");
		askus.com.setVariable("sid", sid);
		askus.com.setVariable("name", f.elements["askus_name"].value);
		askus.com.send();
		break;
	case "started" :
		askus.ready = true;
		f.elements["askus_userid"].value = askus.com.data.Get("userid");
		console.log("SET USER ID:" + 		f.elements["askus_userid"].value);
		askus.self = new user(askus.com.data.Get("userid") * 1, f.elements["askus_name"].value);
		if (askus.currentRoomName.length == 0) {
			askus.currentRoomName = f.elements["askus_roomname"].value;
		}
		if ((askus.currentRoomID.length > 0 &&
			parseInt(askus.currentRoomID) != 0) || 
			askus.currentRoomName.length > 0) {
			askus.addroom(
				parseInt(askus.currentRoomID),
				askus.currentRoomName
			);
			askus.currentRoom = askus.rooms[0];
		}
		askus.readyCallback();
		break;

	case "addroom" :
		askus.currentRoomID = askus.com.data.Get("roomid") * 1;
		askus.currentRoomName = askus.com.data.Get("roomname");
		askus.addroom(
			parseInt(askus.currentRoomID),
			askus.currentRoomName
		);
		askus.currentRoom = askus.rooms[0];
		break;
	case "message" :
		askus.message(
			askus.com.data.Get("roomid") * 1,
			askus.com.data.Get("moderatorid") * 1,
			askus.com.data.Get("userid") * 1, 
			askus.com.data.Get("message"), 
			askus.com.data.Get("messageid") * 1,
			askus.com.data.Get("date")
			);
		break;
	case "adduser" :
		askus.currentRoom.users[askus.currentRoom.users.length] = new user(
					askus.com.data.Get("userid"), 
					askus.com.data.Get("name")
				);
		askus.drawuserlist();
		break;
	case "addmoderator" :
		askus.currentRoom.moderators[askus.currentRoom.moderators.length] = new moderator(
					askus.com.data.Get("staffid"), 
					askus.com.data.Get("name"), 
					askus.com.data.Get("photofileurl")
				);
		askus.drawmoderatorlist();
		break;
	}
	askus.timeout = w.setTimeout(function () {
		askus.query(); 
	}, 5000);
}
var room = function (ID, sName) {
	return {
		ID: ID, 
		name: sName, 
		lastMessageID: 0,
		messages: [], 
		moderators: [], 
		users: [], 
		getUser: function (iUserID) {
			for (var i=0; i<this.users.length; i++) if (iUserID == this.users[i].ID) return this.users[i];
			return null;
		},
		getModerator: function (iModeratorID) {
			for (var i=0; i<this.moderators.length; i++) if (iModeratorID == this.moderators[i].ID) return this.moderators[i];
			return null;
		},
		addMessage: function (sMessage) {
			this.messages[this.messages.length] = sMessage;
			askus.change();
		},
		user: function (ID, sName) {
			return {
				ID: ID,
				name: sName
			};
		},
		moderator: function (ID, sName, sPhotoURL) {
			return {
				ID: ID,
				name: sName,
				photoURL: sPhotoURL
			};
		}
	};
};
var command = function(message, user, room, date, writeBack) {
	var parts = message.split(/ /);
	return {
		action: parts[0].split("/")[1],
		args: parts,
		user: user,
		room: room, 
		date: date,
		writeBack: function (s) {
			console.log("room.addMessage: " + s);
			d.all["askus_messages"].innerHTML += s;
			room.addMessage(s);
		}
	}
};
var user = function (ID, sName) {
	return {
		ID: ID,
		name: sName,
		getName: function () {
			return ((sName.length > 0) ? 
				sName : 
				askus.DEFAULT_NAME
				);
		}
	};
};

var moderator = function (ID, sName, sPhotoURL) {
	return {
		ID: ID,
		name: sName,
		photo: sPhotoURL,
		getName: function () {
			return ((sName.length > 0) ? 
				sName : 
				askus.DEFAULT_NAME
				);
		}
	};
};

function AskUsCommunicator() {

	var AskUsCommunicatorDOM_onload = function () {
//		console.log("DATA" + this.responseText);
		if (!askus.com.hasLoad) {
			AskUsCommunicatorDataReceived(this.responseText);	
		} else if (!askus.com.domObject.dom.documentElement && 
			askus.com.domObject.dom.documentElement.childNodes &&
			askus.com.domObject.dom.documentElement.childNodes.item(0).nodeValue) {
			AskUsCommunicatorDataReceived(askus.com.domObject.dom.documentElement.childNodes.item(0).nodeValue.replace(/\n/gi, "\r\n"));
			while (this.hasChildNodes())
	            this.removeChild(this.lastChild);
		} else {
			AskUsCommunicatorDataReceived("")
		}
	};

	var AskUsCommunicatorDOM = function () {
		this.dom = null;
		this.hasLoad = false;
		if (XMLHttpRequest) {
			this.dom = new XMLHttpRequest();
			this.dom.addEventListener("load", AskUsCommunicatorDOM_onload, false);

		  if ("withCredentials" in this.dom) {
		    // XHR for Chrome/Firefox/Opera/Safari.
		    
		  }
		} else if (document.implementation && 
			   document.implementation.createDocument) {
			console.log("setting legacy dom");
			this.dom = document.implementation.createDocument("","DATA", null);
			this.dom.async = true;
			this.dom.addEventListener("load", AskUsCommunicatorDOM_onload, false);
			this.hasLoad = true;
		} else {
			for (var i=0, aDom = ["MSXML4.DOMDocument", 
	                   "MSXMAskUs.DOMDocument",
	                   "MSXML2.DOMDocument", 
	                   "MSXML.DOMDocument",
	                   "Microsoft.XmlDom", 0]; aDom[i]; i++) {
				try {
					this.dom = new ActiveXObject(aDom[i]);
					this.dom.async = false;
					this.dom.validateOnParse = false;
				} catch (e) {
					this.dom = null;
				}
				if (this.dom != null) break;
			}
			this.hasLoad = true;
		}
		this.load = function (sURL, sData) {
			if (this.hasLoad) this.dom.load(sURL + "?d=" + escape(sData));
			else {
				this.dom.open("GET", sURL + "?d=" + escape(sData));
				this.dom.send();
			}
			if (!this.dom.async) {
				if (this.hasLoad) {
					console.log("!!!");
					//AskUsCommunicatorDataReceived(this.dom.documentElement.childNodes.item(0).text.replace(/\n/gi, "\r\n"));
				} else if (this.dom.documentElement && this.dom.documentElement.childNodes) {
					AskUsCommunicatorDataReceived(this.dom.documentElement.childNodes.item(0).text.replace(/\n/gi, "\r\n"));
				} else {
					AskUsCommunicatorDataReceived("")
				}
			}
		}

	};
	return {
		domObject: new AskUsCommunicatorDOM(),
		reset: function () {
			this.domObject = new AskUsCommunicatorDOM();
			this.data = new NameValue(null, "\r\n\r\n", "\r\n");
		},
		setRequestPage: function (sPage) {
			this.requestPage = sPage;
			this.reset();
		},
		setVariable: function (sName, sValue) {
			this.data.Set(sName, sValue);
		},
		send: function () {
			this.domObject.load(this.requestPage, this.data.Join());
			this.data = new NameValue(null, "\r\n\r\n", "\r\n");
		},
		load: function (sData) {
			this.data = new NameValue(sData, "\r\n\r\n", "\r\n");
		},
		data: new NameValue(null, "\r\n\r\n", "\r\n")
  }
}


function NameValue(strNameValue,r,c) {
	if (strNameValue) {
		var arrNameValue = strNameValue.split(r);
		if (arrNameValue[0]) for (var i=0; i<arrNameValue.length; i++) {
			arrNameValue[i] = arrNameValue[i].split(c);
			if (arrNameValue[i].length < 2) arrNameValue[i][1] = "";
		}
	} else arrNameValue = new Array();

	return {
		NameValue: arrNameValue,
    r: r,
    c: c,
    Get: function (Name) {
			var sreturn = ""
			for (var i=0; i<this.NameValue.length; i++) {
				if (this.NameValue[i][0]==Name) {
					sreturn = this.NameValue[i][1];
					break;
				}
			}
			
			return sreturn;
		},
    Set: function (Name,Value) {
			for (var i=0; i<this.NameValue.length; i++) if (this.NameValue[i][0]==Name) {
				this.NameValue[i][1] = Value;
				return;
			}
			if (this.NameValue[0]) this.NameValue[this.NameValue.length] = new Array(Name,Value + "");
			else this.NameValue[0] = new Array(Name,Value + "")
		},
    Join: function (arrNameValue) {
			var arrOutNameValue = new Array();
			if (this.NameValue[0]) {
				for (i=0; i<this.NameValue.length; i++) {
					arrOutNameValue[i] = ((this.NameValue[i][1].length) ? 
						this.NameValue[i].join(this.c) : this.NameValue[i][0]);
				}
			}
			var strNameValue = arrOutNameValue.join(this.r);
			return strNameValue;
		}
	}
}
	
})(window, document);