import React, { useState, useEffect, useContext } from "react";
import { Flex, Box } from "@chakra-ui/react";
import ChatHeader from "../components/chatHeader";
import ChatUser from "../components/chatUsers";
import ChatBody from "../components/chatBody";
import userContext from "../context";
import { getChatsurl } from "../urls";
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState({}); // keeps track of current selected chat
  const [isChatSelected, setIsChatSelected] = useState(false); // to check whether a chat is selected
  const [chats, setChats] = useState([-1]); // stores the chats of the selected chat
  const [removedUser, setremovedUser] = useState(false);
  const [notifications, setNotifications] = useState([]); // stores the notifications
  const [fetchAgain, setFetchAgain] = useState(false); // to make a fetch request of chats
  const [updatedContextVal, setUpdatedContextVal] = useState({}); // to update the context value
  const ourUser = useContext(userContext);

  // to fetch the chats again when a different chat is selected
  useEffect(() => {
    getUserChats();
  }, [selectedChat]);
  // to fetch the chats again when needed (mostly when a new notification is recieved)
  useEffect(() => {
    if (fetchAgain) {
      getUserChats();
      setFetchAgain(false);
    }
  }, [fetchAgain]);

  useEffect(() => {
    // asynchronous way of parsing the json stored in localstorage to get current user Info (ourUser)
    async function update() {
      let response = await JSON.parse(localStorage.getItem("user"));
      setUpdatedContextVal(response);
    }
    update();
  }, []);

  // gets ourUsers chat data
  async function getUserChats() {
    const response = await fetch(getChatsurl, {
      headers: {
        "content-type": "application/json",
        authorization: localStorage.token,
      },
    });
    const responseJson = await response.json();

    setChats(responseJson.pathSpecified);
    setremovedUser(false);
    setFetchAgain(false);
  }

  return (
    // makes sure that the other components are rendered only after the chats and ourUSer has been updated
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
