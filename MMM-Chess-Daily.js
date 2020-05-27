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
		var dataNotification = null;
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
		var lastDot = pgn.lastIndexOf("."); // either "31. a6" or "31... a6"
		var start = pgn.lastIndexOf(" ", lastDot);
		var end = pgn.indexOf(" ", lastDot + 2);
		return pgn.substring(start, end);
	},

	getDeadline: function (game) {
		return game.move_by;
	},

	getDom: function () {
		console.log("building DOM...");
		var self = this;

		// create element wrapper for show into the module
		var wrapper = document.createElement("div");
		// If this.gamesArray is not empty
		// TODO: add opponent avatars
		if (this.gamesArray) {
			var gamesDom = document.createElement("table");
			for (var i = 0; i < this.gamesArray.games.length; i++) {
				var gameDom = document.createElement("tr");
				var deadlineDom = document.createElement("td");
				var opponentDom = document.createElement("td");
				var lastMoveDom = document.createElement("td");

				var game = this.gamesArray.games[i];
				var opponent = this.getUsername(game.white);
				var userTurn = false;

				if (opponent === this.config.username) { // user is white
					opponent = this.getUsername(game.black);
					gameDom.className = "white";
					userTurn = game.turn === "white";
				} else { // user is black
					gameDom.className = "black";
					userTurn = game.turn === "black";
				}
				if (userTurn) {
					gameDom.className += " userTurn";
				}

				deadlineDom.innerHTML = this.getDeadline(game);
				opponentDom.innerHTML = opponent;
				lastMoveDom.innerHTML = this.getLastMove(game.pgn);

				gameDom.appendChild(deadlineDom);
				gameDom.appendChild(opponentDom);
				gameDom.appendChild(lastMoveDom);
				gamesDom.appendChild(gameDom);
			}
			wrapper.appendChild(gamesDom);
			return wrapper;
		}

		// Data from helper
		if (this.dataNotification) {
			var wrapperDataNotification = document.createElement("div");
			// translations  + datanotification
			wrapperDataNotification.innerHTML = this.translate("UPDATE") + ": " + this.dataNotification.date;

			wrapper.appendChild(wrapperDataNotification);
		}
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
		this.gamesArray = data;
		if (this.loaded === false) { self.updateDom(self.config.animationSpeed); }
		this.loaded = true;
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
