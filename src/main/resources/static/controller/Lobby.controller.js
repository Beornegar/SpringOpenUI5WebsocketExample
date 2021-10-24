sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/demo/basicTemplate/model/formatter"
], function(Controller, formatter) {
	"use strict";

	return Controller.extend("sap.ui.demo.basicTemplate.controller.Lobby", {

		formatter: formatter,

	
		
		onAfterRendering: function() {
			const model = this.getView().getModel();
			model.setProperty("/name", "");
			model.setProperty("/nextMessage", "");
			model.setProperty("/groupId", "1");
			model.setProperty("/connected", false);
			model.setProperty("/messages", []);
		},
		
		onLoginButtonPress: function() {
			const model = this.getView().getModel();
			const router = this.getOwnerComponent().getRouter();
			router.navTo("chat", {
				groupId: window.encodeURIComponent(model.getProperty("/groupId"))
			});
		}
	});
});