/* global Module */

/* Magic Mirror
 * Module: MMM-Chess-Daily
 *
 * By Nout Kleef
 * MIT Licensed.
 */

Module.register("MMM-Chess-Daily", {
	defaults: {
		updateInterval: 60000,
		retryDelay: 5000,
		username: "",
		maxGames: 5,
		displayBoards: true
	},

	requiresVersion: "2.1.0", // Required version of MagicMirror

	start: function () {
		var self = this;
		var gamesArray = null;
		if (this.config.maxGames < 0) {
			this.config.maxGames = Number.MAX_SAFE_INTEGER;
		}

		//Flag for check if module is loaded
		this.loaded = false;

		// Schedule update timer.
		this.getData();
		setInterval(function () {
			self.getData();
		}, this.config.updateInterval);
	},

	/*
	 * getData
	 * function example return data and show it in the module wrapper
	 * get a URL request
	 *
	 */
	getData: function () {
		// this.sendSocketNotification("MMM-Chess-Daily-GET-DATA", this.config.username);
		this.sendSocketNotification("MMM-Chess-Daily-GET-GAMES", this.config.username);
	},


	/* scheduleUpdate()
	 * Schedule next update.
	 *
	 * argument delay number - Milliseconds before next update.
	 *  If empty, this.config.updateInterval is used.
	 */
	scheduleUpdate: function (delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}
		nextLoad = nextLoad;
		var self = this;
		setTimeout(function () {
			self.getData();
		}, nextLoad);
	},

	getUsername: function (url) {
		return url.substr(url.lastIndexOf("/") + 1);
	},

	getLastMove: function (pgn) {
		// TODO: implement edge case where no moves have been made
		var lastDot = pgn.lastIndexOf("."); // either "31. a6" or "31... a6"
		var start = Math.max(pgn.lastIndexOf(" ", lastDot), pgn.lastIndexOf("]", lastDot)) + 1;
		var end = pgn.indexOf(" ", lastDot + 2);
		console.log(1462837, pgn, start, end);
		return end === -1 ? "N/A" : pgn.substring(start, end);
	},

	getDeadline: function (game) {
		return moment(game.move_by * 1000).fromNow();
	},

	isUserTurn: function (game) {
		console.log(game.turn, game.white, game.black);
		return (game.turn === "white" && this.getUsername(game.white) === this.config.username) ||
			(game.turn === "black" && this.getUsername(game.black) === this.config.username);
	},

	createCell: function (className, innerHTML) {
		var cell = document.createElement("td");
		cell.className = "divTableCell " + className;
		cell.innerHTML = innerHTML;
		return cell;
	},

	addTurnIndicator: function (userTurn) {
		var icon = userTurn ? "arrow-circle-right" : "hourglass-half";
		return this.createCell("", "<i class='fa fa-" + icon + "' aria-hidden='true'></i>");
	},

	addOpponentInfo: function (game, opponentIsWhite) {
		var username = this.getUsername(opponentIsWhite ? game.white : game.black);
		return this.createCell("", username);
	},

	addLastMove: function (game) {
		var lastMove = this.getLastMove(game.pgn);
		return this.createCell("", lastMove);
	},

	addDeadline: function (game) {
		return this.createCell("", moment(game.move_by * 1000).fromNow());
	},

	pieces: {
		"p": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/bp.png' />",
		"r": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/br.png' />",
		"n": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/bn.png' />",
		"b": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/bb.png' />",
		"q": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/bq.png' />",
		"k": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/bk.png' />",
		"P": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wp.png' />",
		"R": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wr.png' />",
		"N": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wn.png' />",
		"B": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wb.png' />",
		"Q": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wq.png' />",
		"K": "<img src='http://images.chesscomfiles.com/chess-themes/pieces/light/75/wk.png' />"
	},

	getBoardDom: function (fen, userIsBlack) {
		var board = document.createElement("table");
		var row = 0;
		var col = 0;
		board.className = "chessBoard";
		for (var i = 0; i < 8; i++) {
			var rank = document.createElement("tr");
			for (var j = 0; j < 8; j++) {
				var cell = document.createElement("td");
				rank.appendChild(cell);
			}
			board.appendChild(rank);
		}

		// parse FEN
		var square = 1;
		var i = 0;
		while ((square <= 64) && (i <= fen.length)) {
			var letter = fen[i++];
			var aFile = ((square - 1) % 8);
			var aRank = ((square - 1) >> 3); // integer division by 8
			if (userIsBlack) {
				aFile = 7 - aFile;
				aRank = 7 - aRank;
			}
			// var sq = (ESquare)(((aRank - 1) * 8) + (aFile - 1));
			if (this.pieces[letter] !== undefined) {
				board.rows[aRank].cells[aFile].innerHTML = this.pieces[letter];
			} else {
				switch (letter) {
					case '/': square--; break;
					case '1': break;
					case '2': square++; break;
					case '3': square += 2; break;
					case '4': square += 3; break;
					case '5': square += 4; break;
					case '6': square += 5; break;
					case '7': square += 6; break;
					case '8': square += 7; break;
					default: return -1;
				}
			}
			square++;
		}

		return board;
	},

	getDom: function () {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = "Loading...";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		console.log("building DOM...");
		var divTable = document.createElement("div");
		divTable.className = "divTable normal small light";
		var divBody = document.createElement("table");
		divBody.className = "divTableBody";

		if (!this.gamesArray) {
			return wrapper;
		}

		// TODO: add opponent avatars
		this.gamesArray.forEach(game => {
			var opponent = this.getUsername(game.white);
			var userTurn = this.isUserTurn(game);
			var divRow = document.createElement("tr");
			var boardRow = document.createElement("tr");
			var opponentIsWhite = true;
			divRow.className = "divTableRow";
			boardRow.className = "divTableRow";

			if (opponent === this.config.username) {
				opponent = this.getUsername(game.black);
				opponentIsWhite = false;
				divRow.className += " white";
			} else {
				divRow.className += " black";
			}
			if (userTurn) {
				divRow.className += " userTurn bright";
			}

			divRow.appendChild(this.addTurnIndicator(userTurn));
			divRow.appendChild(this.addOpponentInfo(game, opponentIsWhite));
			divRow.appendChild(this.addLastMove(game));
			divRow.appendChild(this.addDeadline(game));

			if (this.config.displayBoards) {
				var wrapperCell = this.createCell("", "");
				wrapperCell.colSpan = 4;
				wrapperCell.appendChild(this.getBoardDom(game.fen, opponentIsWhite));
				boardRow.appendChild(wrapperCell);
			}

			divBody.appendChild(divRow);
			divBody.appendChild(boardRow);
		});

		divTable.appendChild(divBody);
		wrapper.appendChild(divTable);
		return wrapper;
	},

	getScripts: function () {
		return [];
	},

	getStyles: function () {
		return [
			"MMM-Chess-Daily.css", "font-awesome.css"
		];
	},

	// Load translations files
	getTranslations: function () {
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	processData: function (data) {
		var self = this;
		// sort by userTurn, deadline
		data.games.sort(function (a, b) {
			const aTurn = this.isUserTurn(a);
			if (aTurn === this.isUserTurn(b)) {
				return a.deadline - b.deadline;
			} else {
				return aTurn ? -1 : 1;
			}
		}.bind(this));
		// respect maximum entries
		this.gamesArray = data.games.slice(0, this.config.maxGames);
		this.loaded = true;
		self.updateDom(self.config.animationSpeed);
	},

	// socketNotificationReceived from helper
	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-Chess-Daily-GAMES-RECEIVED") {
			console.log("games received - processing " + payload.body.games.length +
				" games in total");
			this.processData(payload.body);
		}
	},
});
