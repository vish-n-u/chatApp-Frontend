import React, { useContext, useEffect, useState, useRef } from "react";
import { Box } from "@chakra-ui/layout";
import { Button, Text, useToast } from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import userContext from "../context";
import io from "socket.io-client";

import ChatDataModal from "./chatBodyModal";
import ScrollableChat from "./ScrollableChat";
import { endpoint, fetchChatMessages } from "../urls";
var socket, selectedChatCompare;

const ChatBody = ({
  isChatSelected,
  setIsChatSelected,
  selectedChat,
  setSelectedChat,
  notifications,
  setNotifications,
  setFetchAgain,
}) => {
  const [messages, setMessages] = useState([]);
  const [areMessagesloading, setAreMessagesLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [isOtherUserTyping, setIsOtherUserTyping] = useState(false);

  const Toast = useToast();
  const ourUser = useContext(userContext);

  console.log("notifications length", notifications, notifications.length);

  async function fetchMessages() {
    // console.log("Fetching messages...", fetchAgain, isChatSelected);
    // if (!fetchAgain && !isChatSelected) return;
    if (!isChatSelected) return;
    try {
      setAreMessagesLoading(true);
      console.log("selectedChat", selectedChat);
      const data = await fetch(`${fetchChatMessages}${selectedChat._id}`, {
        headers: { authorization: localStorage.getItem("token") },
      });
      const dataJson = await data.json();

      setAreMessagesLoading(false);
      if (data.status == 200) {
        // dataJson.messages.reverse();
        setMessages(dataJson.messages);
        let arr = [...notifications];
        arr.map((notification, index) => {
          if (notification.chatId._id == selectedChat._id) {
            arr.splice(index, 1);
          }
        });
        setNotifications(arr);
        socket.emit("join chat", selectedChat._id);
      } else if (data.status !== 500) {
        Toast({
          status: "error",
          title: "error",
          description: dataJson.messages,
          duration: 3000,
        });
        return;
      } else {
        Toast({
          status: "error",
          title: "error",
          description: "Internal server error",
          duration: 3000,
        });
        return;
      }
    } catch (err) {
      console.log("err====", err);
      Toast({
        status: "error",
        title: "error",
        description: "Internal server error",
        duration: 3000,
      });
      return;
    }
  }
  useEffect(() => {
    socket = io(endpoint);
    socket.emit("setup", ourUser);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
    socket.emit("join chat", selectedChatCompare._id);
    return () => {
      socket.emit("disjoin chat", selectedChatCompare._id);
      setIsOtherUserTyping(false);
    };
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chatId._id
      ) {
        if (!notifications.includes(newMessageRecieved)) {
          let arr = [...notifications];
          arr.map((notification, index) => {
            if (notification.chatId._id === newMessageRecieved.chatId._id) {
              arr.splice(index, 1);
            }
          });
          arr.push(newMessageRecieved);
          setNotifications(arr);
          setFetchAgain(true);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
        setIsOtherUserTyping(false);
      }
    });
  });

  return (
    <Box
      hideBelow={!isChatSelected && "md"}
      display={"flex"}
      flexDir={"column"}
      alignItems={"center"}
      backgroundColor="white"
      borderRadius={"md"}
      m={"5"}
      height="90% "
      w={{ base: "95%", md: "65%" }}
    >
      {isChatSelected && (
        <>
          <Box //header of chatbox
            w="full"
            display={"flex"}
            justifyContent={"space-between"}
            mt="4"
            mx="2"
          >
            <Button
              ml="3"
              onClick={() => {
                setSelectedChat({});
                setIsChatSelected(false);
              }}
              hideFrom={"md"}
            >
              <ArrowBackIcon />
            </Button>
            <Text
              ml="3"
              fontSize={"xl"}
              fontWeight={"semibold"}
              fontFamily={"cursive"}
            >
              {selectedChat.isGroupChat
                ? selectedChat.name
                : selectedChat.users[0]._id == ourUser._id
                ? selectedChat.users[1].username
                : selectedChat.users[0].username}
            </Text>

            <ChatDataModal
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              ourUser={ourUser}
              Toast={Toast}
              setIsChatSelected={setIsChatSelected}
            />
          </Box>
          <ScrollableChat
            isChatSelected={isChatSelected}
            setIsChatSelected={setIsChatSelected}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            messages={messages}
            setMessages={setMessages}
            areMessagesloading={areMessagesloading}
            setAreMessagesLoading={setAreMessagesLoading}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            socket={socket}
            isOtherUserTyping={isOtherUserTyping}
            setIsOtherUserTyping={setIsOtherUserTyping}
          />
        </>
      )}
    </Box>
  );
};

export default ChatBody;
