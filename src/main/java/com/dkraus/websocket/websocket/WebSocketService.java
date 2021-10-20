package com.dkraus.websocket.websocket;


import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class WebSocketService {

	private final SimpMessagingTemplate simpMessagingTemplate;

	WebSocketService(SimpMessagingTemplate simpMessagingTemplate) {
		this.simpMessagingTemplate = simpMessagingTemplate;
	}

	public void send(String topic, String messageContent) {
		
		Message message = new Message(messageContent);
		
		simpMessagingTemplate.convertAndSend(topic, message);
	}

	public void send(Topics topic, String message) {
		send(topic.getValue(), message);
	}

}
