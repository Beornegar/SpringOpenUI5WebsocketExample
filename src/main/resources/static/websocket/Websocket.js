sap.ui.define(["../lib/SockJS", "../lib/StompJS", "sap/ui/Device",
	"sap/m/MessageBox"], function(SockJSLibrary, StompJSLibrary, Device, MessageBox) {
		"use strict";

		let stompClient = null;
		let oModel = null;
		let connectedTopics = [];
		const headers = {};

		function init(model) {
			oModel = model;
			return checkForWebsocketSupport();
		}

		function connect() {
			if (!oModel) {
				MessageBox.show("Please initialize the Websocket first with the \'.init\'-Method", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSocket not initialized",
					actions: MessageBox.Action.OK
				});
				return Promise.reject();
			}

			if (stompClient && stompClient.connected) {
				return Promise.resolve();
			}

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
			if (stompClient === null || stompClient === undefined || !stompClient.connected) {
				MessageBox.show("Can't subscribe to topic as long as websocket is not connected!", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSocket not connected",
					actions: MessageBox.Action.OK
				});
				return;
			}

			const subscribedTopic = stompClient.subscribe(sTopic, fCallBack);
			connectedTopics.push(subscribedTopic);
			return subscribedTopic;
		}

		function unsubscribe(sTopic) {
			if (stompClient === null || stompClient === undefined || !stompClient.connected) {
				MessageBox.show("Can't unsubscribe from topic as long as websocket is not connected!", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSocket not connected",
					actions: MessageBox.Action.OK
				});
				return;
			}

			stompClient.unsubscribe(sTopic);
		}

		function disconnect() {
			if (stompClient !== null && stompClient !== undefined) {
				stompClient.disconnect();
			}
			oModel.setProperty("/connected", false);
		}

		function sendSystemMessage(sName, sMessage) {
			if (stompClient === null || stompClient === undefined || !stompClient.connected) {
				MessageBox.show("Can't send message over websocket since websocket is not connected!", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSocket not connected",
					actions: MessageBox.Action.OK
				});
				return;
			}

			stompClient.send("/app/message/serverMessage", {}, JSON.stringify({ name: "System", message: sMessage }));
		}

		function checkForWebsocketSupport() {
			if (!Device.support.websocket) {
				MessageBox.show("Your SAPUI5 Version does not support WebSockets", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSockets not supported",
					actions: MessageBox.Action.OK
				});
				return false;
			}
			return true;
		}


		return {
			init: init,
			sendMessage: sendSystemMessage,
			connect: connect,
			disconnect: disconnect,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		};
	});