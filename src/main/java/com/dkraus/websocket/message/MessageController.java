package com.dkraus.websocket.message;

import java.time.LocalDateTime;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.HtmlUtils;

import com.dkraus.websocket.websocket.Message;
import com.dkraus.websocket.websocket.Topics;
import com.dkraus.websocket.websocket.WebSocketService;

@Controller
public class MessageController {

	private final WebSocketService webSocketService;

	public MessageController(WebSocketService webSocketService) {
		this.webSocketService = webSocketService;
	}

	/**
	 * See also WebsocketConfig for additional MessageMapping-Prefix '/app' and
	 * topic definition
	 * 
	 * @param message
	 * @return
	 * @throws Exception
	 */
	@MessageMapping("/message")
	@SendTo("/topic/messages")
	public Message greeting(ChatMessageRequest message) throws Exception {
		Thread.sleep(1000); // simulated delay
		return new Message(HtmlUtils.htmlEscape(HtmlUtils.htmlEscape(message.getName())) + ": "
				+ HtmlUtils.htmlEscape(message.getMessage()));
	}

	@GetMapping("/message/sendTime")
	public void sendTime(@RequestParam("groupId") Long groupId) {
		webSocketService.send(Topics.SYSTEM_TIME.getValue() + groupId, LocalDateTime.now().toString());
	}

}