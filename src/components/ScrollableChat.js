import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Image,
  Input,
  Spinner,
  Text,
  Tooltip,
  useTimeout,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useRef } from "react";
import { useState, useEffect } from "react";
import userContext from "../context";
import ScrollableFeed from "react-scrollable-feed";
import { postMessagesUrl } from "../urls";
import * as aesJS from "aes-js";

function encryptContent(content) {
  let key = process.env.REACT_APP_encryptionKey || [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];
  const contentBytes = aesJS.utils.utf8.toBytes(content);
  const aesCtr = new aesJS.ModeOfOperation.ctr(key, new aesJS.Counter(5));
  const encryptedBytes = aesCtr.encrypt(contentBytes);

  const encryptedHex = aesJS.utils.hex.fromBytes(encryptedBytes);
  return encryptedHex;
}

function decryptedContent(content) {
  let key = process.env.REACT_APP_encryptionKey || [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
  ];

  const encryptedBytes = aesJS.utils.hex.toBytes(content);
  const aesCtr = new aesJS.ModeOfOperation.ctr(key, new aesJS.Counter(5));
  const decryptedBytes = aesCtr.decrypt(encryptedBytes);

  // Convert our bytes back into text
  const decryptedText = aesJS.utils.utf8.fromBytes(decryptedBytes);
  return decryptedText;
}
const ScrollableChat = ({
  isChatSelected,
  setIsChatSelected,
  selectedChat,
  setSelectedChat,
  messages,
  setMessages,
  areMessagesloading,
  setAreMessagesLoading,
  newMessage,
  setNewMessage,
  socket,
  isOtherUserTyping,
  setIsOtherUserTyping,
}) => {
  const [newMessageString, setNewMessageString] = useState("");
  const Toast = useToast();
  const ourUser = useContext(userContext);
  const [currTimeRef, setCurrTimeRef] = useState({});

  console.log(
    "messages:---",
    isOtherUserTyping,
    messages,
    messages.length,
    areMessagesloading
    // View
  );
  useEffect(() => {
    socket.on("typing", (id) => {
      console.log("typing", id);
      if (!isOtherUserTyping && id == selectedChat._id) {
        setIsOtherUserTyping(true);
      }
    });
    socket.on("stop typing", (id) => {
      setTimeout(() => {
        if (isOtherUserTyping && id == selectedChat._id) {
          console.log("is other user typing", isOtherUserTyping);
          setIsOtherUserTyping(false);
        }
      }, 1000);
    });
  });

  console.log("isOtherUserTyping====", isOtherUserTyping);
  return (
    <Box //messages inside chat box and input bar
      mt="3"
      h="90%"
      w="95%"
      display={"flex"}
      flexDirection={"column"}
      // alignContent={"end"}
    >
      <ScrollableFeed>
        <Box w="full" display={"flex"} justifyContent={"center"}>
          <Text
            p="2"
            bgColor={"gray.400"}
            color={"white"}
            position={"relative"}
            rounded={"lg"}
            top="12"
          >
            Messages are end-to-end encrypted
          </Text>
        </Box>
        <Box
          w="100%"
          //   m="3"
          h="fit-content"
          minH={"100%"}
          display={"flex"}
          flexWrap={"wrap"}
          flexDirection={"column"}
          justifyContent={"end"}
          justifyItems={"center"}
          backgroundColor={"gray.200"}
        >
          {!areMessagesloading
            ? messages.map((message, index) => {
                return (
                  <Box // texts are styled here
                    w="100%"
                    // my="2"
                    px="4"
                    p="2"
                    key={message._id}
                    display={"flex"}
                    flexDirection={
                      message.sender._id === ourUser._id ? "row-reverse" : "row"
                    }
                  >
                    {(message.sender._id !==
                      messages?.[index + 1]?.sender._id ||
                      index === messages.length - 1) &&
                    message.sender._id !== ourUser._id ? (
                      <Tooltip label={message.sender.username}>
                        <Avatar
                          w="7"
                          h="7"
                          mr="2"
                          rounded={"full"}
                          src={message.sender.pic}
                          name={message.sender.username}
                          alt="nope.jpeg"
                        />
                      </Tooltip>
                    ) : null}
                    <Text
                      w="fit-content"
                      maxW={"50%"}
                      p="1"
                      px="5"
                      color="white"
                      bgColor={
                        message.sender._id === ourUser._id
                          ? "blue.500"
                          : "green.500"
                      }
                      rounded={"lg"}
                    >
                      {decryptedContent(message.content)}
                    </Text>
                  </Box>
                );
              })
            : isChatSelected && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  alignSelf={"center"}
                  justifySelf={"center"}
                ></Spinner>
              )}

          {isOtherUserTyping && (
            <Box display={"flex"} bgColor={"gray.200"}>
              <iframe
                src="https://giphy.com/embed/X9jcycOeoT14CIKUuC"
                width="80"
                height="80"
                frameBorder="0"
                class="giphy-embed"
                allowFullScreen
              ></iframe>
              <p style={{ width: "20px", height: "20px" }}>
                <a
                  style={{ backgroundColor: "blue" }}
                  href="https://giphy.com/stickers/savage-typing-text-bubble-X9jcycOeoT14CIKUuC"
                ></a>
              </p>
            </Box>
          )}
        </Box>
      </ScrollableFeed>

      <Box display={"flex"} justifyContent={"center"} my="4" alignItems={"end"}>
        <Input // input to add messages
          mb="3"
          placeholder="write message here..."
          border={"1px"}
          borderRightRadius={"full"}
          borderLeftRadius={"full"}
          type="text"
          value={newMessageString}
          onChange={(e) => {
            setNewMessageString(e.target.value);
            // if (!isTyping) setIsTyping(true);
            socket.emit("typing", selectedChat._id);

            const currTime = new Date().getTime();
            currTimeRef.current = currTime;

            setTimeout(() => {
              let newtime = new Date().getTime();
              console.log(
                "currTimeRef",
                newtime - currTimeRef.current,
                newtime - currTimeRef.current > 3000
              );

              if (newtime - currTimeRef.current >= 3000) {
                // /if (isTyping) setIsTyping(false);
                console.log("reached stop typing");
                socket.emit("stop typing", selectedChat._id);
              }
              return;
            }, 3000);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (newMessageString === "") return;
              setNewMessage(newMessageString);
              if (isOtherUserTyping) setIsOtherUserTyping(false);
              sendMessage(
                newMessageString,
                messages,
                setMessages,
                setNewMessageString,
                setAreMessagesLoading,
                selectedChat,
                Toast,
                socket
              );
            }
          }}
          w="80%"
          overflowX={"scroll"}
          _focus={{ bgColor: "white" }}
        />
        <Button
          mb="3"
          isDisabled={newMessageString === ""}
          onClick={() => {
            setNewMessage(newMessageString);
            // Socket.emit("new message",)
            if (isOtherUserTyping) setIsOtherUserTyping(false);
            sendMessage(
              newMessageString,
              messages,
              setMessages,
              setNewMessageString,
              setAreMessagesLoading,
              selectedChat,
              Toast,
              socket
            );
          }}
        >
          <ArrowForwardIcon />
        </Button>
      </Box>
    </Box>
  );
};
async function sendMessage(
  content,
  messages,
  setMessages,
  setNewMessageString,
  setAreMessagesLoading,
  selectedChat,
  Toast,
  socket
) {
  const encryptedContent = encryptContent(content);
  try {
    // setAreMessagesLoading(true);
    const data = await fetch(postMessagesUrl, {
      method: "POST",
      body: JSON.stringify({
        chatId: selectedChat._id,
        content: encryptedContent,
      }),
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
    });
    const dataJson = await data.json();

    // setAreMessagesLoading(false);
    setNewMessageString("");
    console.log(dataJson, data);
    if (data.status == 200) {
      setMessages([...messages, dataJson.message]);
      socket.emit("new message", dataJson.message);
      return;
    }
    if (data.status !== 500) {
      Toast({
        status: "error",
        title: "error",
        descritption: dataJson.messages,
        duration: 3000,
      });
      return;
    } else {
      Toast({
        status: "error",
        title: "error",
        descritption: "Internal server error",
        duration: 3000,
      });
      return;
    }
  } catch (err) {
    console.log(err);
    Toast({
      status: "error",
      title: "error",
      descritption: "Internal server error",
      duration: 3000,
    });
    return;
  }
}

export default ScrollableChat;
