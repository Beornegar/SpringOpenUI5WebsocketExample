sap.ui.define(["../lib/SockJS", "../lib/StompJS"], function(SockJSLibrary, StompJSLibrary) {
	"use strict";

	let stompClient = null;
	let oModel = null;
	let connectedTopics = [];

	function init(model) {
		oModel = model;
	}

	function connect() {
		const headers = {};
		const socket = new SockJS('/gs-guide-websocket');
		stompClient = Stomp.over(socket);

		return new Promise(function(resolve, reject) {
			stompClient.connect(headers, function() {
				resolve();
			}, function() {
				reject();
			});
		});
	}

	function subscribe(sTopic, fCallBack) {
		const subscribedTopic = stompClient.subscribe(sTopic, fCallBack);
		connectedTopics.push(subscribedTopic);
		return subscribedTopic;
	}

	function unsubscribe(sTopic) {
		stompClient.unsubscribe(sTopic);
	}

	function disconnect() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		oModel.setProperty("/connected", false);
	}

	function sendMessage(sName, sMessage) {
		stompClient.send("/app/message", {}, JSON.stringify({ name: sName, message: sMessage }));
	}


	return {
		init: init,
		sendMessage: sendMessage,
		connect: connect,
		disconnect: disconnect,
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
});