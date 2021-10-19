sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter",
	"../websocket/Websocket",
	"sap/m/MessageToast",
	"sap/ui/Device",
	"sap/m/MessageBox"
], function(Controller, formatter, Websocket, MessageToast, Device, MessageBox) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Home", {

		_messageTopic: '/topic/greetings',

		formatter: formatter,

		_onReceiveGreetingFromTopic: function(oReceivedMessage) {
			console.log(oReceivedMessage);

			if (!oReceivedMessage && !oReceivedMessage.body) {
				console.error("Body not existing");
			}

			const message = JSON.parse(oReceivedMessage.body);

			if (message && message.content) {
				MessageToast.show(message.content);
			} else {
				console.error("Message Content not send");
			}
		},

		_initWebsocket: function() {
			const oModel = this.getView().getModel();
			Websocket.init(oModel);
		},

		_connectWebsocket: function() {
			Websocket.connect(this._messageTopic, this._onReceiveGreetingFromTopic);
		},

		onInit: function() {
			if (!Device.support.websocket) {
				MessageBox.show("Your SAPUI5 Version does not support WebSockets", {
					icon: MessageBox.Icon.INFORMATION,
					title: "WebSockets not supported",
					actions: MessageBox.Action.OK
				});
				return;
			}
		},

		onAfterRendering: function() {
			this.getView().getModel().setProperty("/name", "Test");
			this.getView().getModel().setProperty("/connected", "false");

			this._initWebsocket();
			this._connectWebsocket();
		},

		onSendMessageButtonClick: function() {
			const name = this.getView().getModel().getProperty("/name");
			Websocket.sendName(name);
		},

		onPressConnectWebsocketButton: function() {
			this._connectWebsocket();
		},

		onPressDisconnectWebsocketButton: function() {
			Websocket.disconnect();

		}

	});
});