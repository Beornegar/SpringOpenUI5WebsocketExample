sap.ui.define([], function () {
	"use strict";
	return {
		
		isLoginButtonEnabled: function(sName, sGroupId) {
			if(!sName || !sGroupId) {
				return false;
			}
			
			return sName.trim().length > 0 && sGroupId.trim().length > 0;
		}
		
	};
});