/* Magic Mirror
 * Node Helper: MMM-Chess-Daily
 *
 * By Nout Kleef
 * MIT Licensed.
 */

var NodeHelper = require("node_helper");
var ChessWebAPI = require("chess-web-api");
var chessAPI = new ChessWebAPI();

module.exports = NodeHelper.create({

	// Override socketNotificationReceived method.

	/* socketNotificationReceived(notification, payload)
	 * This method is called when a socket notification arrives.
	 *
	 * argument notification string - The identifier of the noitication.
	 * argument payload mixed - The payload of the notification.
	 */
	socketNotificationReceived: function (notification, payload) {
		if (notification === "MMM-Chess-Daily-GET-GAMES") {
			this.fetchGames(payload);
		}
	},

	fetchGames: function (username) {
		console.info("fetching games for user " + username + "...");
		chessAPI.getPlayerCurrentDailyChess(username)
			.then(function (response) {
				this.sendSocketNotification("MMM-Chess-Daily-GAMES-RECEIVED", response);
			}.bind(this), function (err) {
				// TODO: show useful error message in dom
				console.log(err);
			});
	},

	// this you can create extra routes for your module
	extraRoutes: function () {
		var self = this;
		this.expressApp.get("/MMM-Chess-Daily/extra_route", function (req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	}
});
