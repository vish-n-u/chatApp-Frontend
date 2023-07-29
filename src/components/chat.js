import React, { useState, useEffect, useContext } from "react";
import { Flex, Box, Tooltip, HStack, Input, Button } from "@chakra-ui/react";
import ChatHeader from "./chatHeader";
import ChatUser from "./chatUsers";
import ChatBody from "./chatBody";
import userContext from "../context";
import { getChatsurl } from "../urls";
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState({});
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [chats, setChats] = useState([-1]);
  const [removedUser, setremovedUser] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [updatedContextVal, setUpdatedContextVal] = useState({});
  const ourUser = useContext(userContext);
  // console.log(selectedChat, "Chats", ourUser._id);
  useEffect(() => {
    getUserChats();
  }, [selectedChat]);
  useEffect(() => {
    if (fetchAgain) {
      getUserChats();
      setFetchAgain(false);
    }
  }, [fetchAgain]);
  useEffect(() => {
    async function update() {
      let response = await JSON.parse(localStorage.getItem("user"));
      setUpdatedContextVal(response);
    }
    update();
  }, []);
  async function getUserChats() {
    const response = await fetch(getChatsurl, {
      headers: {
        "content-type": "application/json",
        authorization: localStorage.token,
      },
    });
    const responseJson = await response.json();

    // console.log("====responseJson", responseJson);
    setChats(responseJson.pathSpecified);
    setremovedUser(false);
    setFetchAgain(false);
  }
  console.log(
    "selection of chat",
    chats,
    chats[0] !== -1,
    ourUser,
    Object.keys(updatedContextVal).length
  );
  return (
    chats[0] !== -1 &&
    Object.keys(updatedContextVal).length > 0 && (
      <Box bg={"blue.100"}>
        <userContext.Provider value={updatedContextVal}>
          <ChatHeader
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            chats={chats}
            setChats={setChats}
            setIsChatSelected={setIsChatSelected}
            notifications={notifications}
            setNotifications={setNotifications}
          />
          <Flex height={"90vh"} w={"full"}>
            <ChatUser
              isChatSelected={isChatSelected}
              setIsChatSelected={setIsChatSelected}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
              setChats={setChats}
              removedUser={removedUser}
              setremovedUser={setremovedUser}
            />
            <ChatBody
              isChatSelected={isChatSelected}
              setIsChatSelected={setIsChatSelected}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
              removedUser={removedUser}
              setremovedUser={setremovedUser}
              notifications={notifications}
              setNotifications={setNotifications}
              setFetchAgain={setFetchAgain}
            />
          </Flex>
        </userContext.Provider>
      </Box>
    )
  );
};

export default Chat;
