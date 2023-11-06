import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Socket } from "../../utils/socket";
import profile from "./profile.png";

const Avatar = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin: 20px 30px;
  border: 1px solid #ccc;
  background-image: url(${profile});
  background-position: center center;
`;
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  height: 60vh;
  margin: 10vh auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  justify-content: center;
`;

const Message = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin: 10px 0px;
  background-color: #313538;
  color: #fff;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    right: -1;
    top: 50%;
    width: 0;
    height: 0;
    border: 15px solid transparent;
    border-left-color: #313538;
    border-right: 0;
    border-top: 0;
    margin-top: -10px;
    margin-right: -20px;
  }
`;

const MessageContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 20px;
`;

const ChatMessages = styled.div`
  flex-grow: 1;
  padding: 10px;
  overflow-y: auto;
`;

const ChatInput = styled.input`
  width: 60%;
  padding: 8px;
  height: 50px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #ccc;
  &:placeholder {
    color: #fff;
  }
`;

const SendButton = styled.button`
  width: 10%;
  background-color: #313538;
  color: #fff;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 10px;
`;

const SendArea = styled.form`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  justify-content: center;
`;

const hostName = "https://deercodeweb.com/";
const socket = new Socket(hostName);

function ChatAdmin() {
  const listRef = useRef([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.connect();
    socket.receive(setMessages);
  }, []);

  useEffect(() => {
    listRef.current[listRef.current.length - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }, [newMessage]);

  const handleSendMessage = (event) => {
    event.preventDefault();

    if (newMessage.trim() === "") return;

    socket.send(newMessage);
    setMessages([...messages, { text: newMessage, user: "user" }]);
    setNewMessage("");
  };

  return (
    <ChatContainer>
      <ChatMessages>
        {messages.map((message, index) => (
          <div
            key={index}
            ref={(element) => (listRef.current[index] = element)}>
            <MessageContainer>
              <Message>{message.text}</Message>
              <Avatar src={message.avatarUrl} />
            </MessageContainer>
          </div>
        ))}
      </ChatMessages>
      <SendArea>
        <ChatInput
          type="text"
          placeholder="請輸入訊息"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <SendButton onClick={handleSendMessage}>送出</SendButton>
      </SendArea>
    </ChatContainer>
  );
}

export default ChatAdmin;
