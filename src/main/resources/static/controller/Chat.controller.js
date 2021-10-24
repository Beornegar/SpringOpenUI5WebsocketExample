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
		_systemMessageTopic: '/topic/messages',
		_groupMessageTopic: '/topic/messages/group',
		_timeTopic: "/topic/time/group/",

		formatter: formatter,

		_initWebsocket: function() {
			const oModel = this.getView().getModel();
			Websocket.init(oModel);
		},

		_connectWebsocket: function(groupId) {
			
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
				Websocket.subscribe(this._systemMessageTopic, _onReceiveMessageFromServer);
				Websocket.subscribe(this._groupMessageTopic + groupId, _onReceiveMessageFromServer);
				Websocket.subscribe(this._timeTopic + groupId, _onReceiveMessageFromServer);
				this._oModel.setProperty("/connected", true);
			});
		},

		onInit: function () {
			const oRouter = this.getOwnerComponent().getRouter();
			oRouter.getRoute("chat").attachPatternMatched(this._onNavigateToChat, this);
		},
		
		_onNavigateToChat: function(oEvent) {
			const groupId = oEvent.getParameter("arguments").groupId;		
			this._connectWebsocket(groupId);
		},

		onAfterRendering: function() {
			this._oModel = this.getView().getModel();

			this._initWebsocket();
		},

		onGetTimeButtonClick: async function() {
			const oModel = this._oModel;
			const groupId = oModel.getProperty("/groupId");

			await fetch("/message/sendTime?groupId=" + groupId);
		},
		
		onSendMessageButtonClick: async function() {
			
			const groupId = this._oModel.getProperty("/groupId");
			const name = this._oModel.getProperty("/name");
			const message = this._oModel.getProperty("/nextMessage");
			
			if(message.trim().length == 0) {
				return;
			}

			await fetch("/message/?groupId=" + groupId + "&name=" + name + "&message=" + message);
			oModel.setProperty("/nextMessage", "");
		},

		onSendSystemMessageButtonClick: function() {
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