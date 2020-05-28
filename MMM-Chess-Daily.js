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
		maxGames: 5
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
			self.updateDom();
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
		var cell = document.createElement("div");
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
		var divBody = document.createElement("div");
		divBody.className = "divTableBody";

		if (!this.gamesArray) {
			return wrapper;
		}

		// TODO: add opponent avatars
		this.gamesArray.forEach(game => {
			var opponent = this.getUsername(game.white);
			var userTurn = this.isUserTurn(game);
			var divRow = document.createElement("div");
			var opponentIsWhite = true;
			divRow.className = "divTableRow";

			if (opponent === this.config.username) {
				opponent = this.getUsername(game.black);
				opponentIsWhite = false;
				divRow.className += " white";
			} else {
				divRow.className += " black";
			}
			if (userTurn) {
				divRow.className += " userTurn";
			}

			divRow.appendChild(this.addTurnIndicator(userTurn));
			// if (this.config.showAvatars) {
			// 	divRow.appendChild(this.addOpponentAvatar(game));
			// }
			divRow.appendChild(this.addOpponentInfo(game, opponentIsWhite));
			divRow.appendChild(this.addLastMove(game));
			divRow.appendChild(this.addDeadline(game));

			divBody.appendChild(divRow);
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
			"MMM-Chess-Daily.css",
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
