package com.dkraus.websocket.websocket;

public enum Topics {
	SYSTEM_WIDE_MESSAGE("/topic/messages"),
	SYSTEM_TIME("/topic/time/group/"),
	GROUP_MESSAGE("/topic/messages/group");

	private final String value;

	private Topics(String value) {
		this.value = value;
	}

	public String getValue() {
		return value;
	}
}
