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
		_oModel: null,
		_messageTopic: '/topic/messages',
		_timeTopic: "/topic/time/group/",

		formatter: formatter,

		_initWebsocket: function() {
			const oModel = this.getView().getModel();
			Websocket.init(oModel);
		},

		_connectWebsocket: function() {
			const groupId = this._oModel.getProperty("/groupId") ?? "1";
			
			const _onReceiveMessageFromServer = (oReceivedMessage) => {
				if (!oReceivedMessage && !oReceivedMessage.body) {
					console.error("Body not existing");
				}
				const messages = this._oModel.getProperty("/messages");
				const message = JSON.parse(oReceivedMessage.body);

				if (message && message.content) {
					MessageToast.show("New message received!");
					messages.push({ message: message.content });
					this._oModel.setProperty("/messages", messages);
				} else {
					console.error("Message Content not send");
				}
			};
			
			Websocket.connect().then(() => {
				Websocket.subscribe(this._messageTopic, _onReceiveMessageFromServer);
				Websocket.subscribe(this._timeTopic + groupId, _onReceiveMessageFromServer);
				this._oModel.setProperty("/connected", true);
			});
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
			const model = this.getView().getModel();
			model.setProperty("/name", "");
			model.setProperty("/nextMessage", "");
			model.setProperty("/groupId", "1");
			model.setProperty("/connected", false);
			model.setProperty("/messages", []);

			this._oModel = model;

			this._initWebsocket();
			this._connectWebsocket();
		},

		onGetTimeButtonClick: async function() {
			const oModel = this._oModel;
			const groupId = oModel.getProperty("/groupId");


			await fetch("/message/sendTime?groupId=" + groupId);
		},

		onSendMessageButtonClick: function() {
			const name = this.getView().getModel().getProperty("/name");
			const message = this.getView().getModel().getProperty("/nextMessage");
			Websocket.sendMessage(name, message);
		},

		onPressConnectWebsocketButton: function() {
			this._connectWebsocket();
		},

		onPressDisconnectWebsocketButton: function() {
			Websocket.disconnect();
		}

	});
});