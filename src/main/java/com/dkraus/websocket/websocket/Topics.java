package com.dkraus.websocket.websocket;

public enum Topics {
	MESSAGE("/topic/messages"),
	SYSTEM_TIME("/topic/time/group/");

	private final String value;

	private Topics(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
}
