sap.ui.define(["../lib/SockJS", "../lib/StompJS"], function(SockJSLibrary, StompJSLibrary) {
	"use strict";

	let stompClient = null;
	let oModel = null;

	function init(model) {
		oModel = model;
	}

	function connect(sTopic, fCallBack) {
		const socket = new SockJS('/gs-guide-websocket');
		stompClient = Stomp.over(socket);
		stompClient.connect({}, function() {
			stompClient.subscribe(sTopic, fCallBack); //Topic: '/topic/greetings'
			oModel.setProperty("/connected", true);
		});
	}

	function disconnect() {
		if (stompClient !== null) {
			stompClient.disconnect();
		}
		oModel.setProperty("/connected", false);
	}

	function sendName(sName) {
		stompClient.send("/app/hello", {}, JSON.stringify({ 'name': sName }));
	}


	return {
		init: init,
		sendName: sendName,
		connect: connect,
		disconnect: disconnect
	};
});