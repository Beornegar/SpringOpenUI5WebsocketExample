package com.dkraus.websocket.message;

class ChatMessageRequest {

	private String name;
	private String message;

	public ChatMessageRequest() {
	}

	public ChatMessageRequest(String name) {
		this.name = name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
