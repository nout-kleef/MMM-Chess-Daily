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
		if (notification === "MMM-Chess-Daily-NOTIFICATION_TEST") {
			console.log("Working notification system. Notification:", notification, "payload: ", payload);
			// Send notification
			this.sendNotificationTest(this.anotherFunction()); //Is possible send objects :)
		} else if (notification === "MMM-Chess-Daily-GET-DATA") {
			console.log("received 2!", payload);
			this.getChessData(payload);
		}
	},

	getChessData: function (username) {
		chessAPI.getPlayer(username)
			.then(function (response) {
				console.log("Player profile", response.body);
				this.sendSocketNotification("MMM-Chess-Daily-UPDATE", response);
			}.bind(this), function (err) {
				console.log(err);
			});
	},

	// Example function send notification test
	sendNotificationTest: function (payload) {
		this.sendSocketNotification("MMM-Chess-Daily-NOTIFICATION_TEST", payload);
	},

	// this you can create extra routes for your module
	extraRoutes: function () {
		var self = this;
		this.expressApp.get("/MMM-Chess-Daily/extra_route", function (req, res) {
			// call another function
			values = self.anotherFunction();
			res.send(values);
		});
	},

	// Test another function
	anotherFunction: function () {
		return { date: new Date() };
	}
});
