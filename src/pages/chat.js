import React, { useState, useEffect, useContext } from "react";
import { Flex, Box } from "@chakra-ui/react";
import ChatHeader from "../components/chatHeader";
import ChatUser from "../components/chatUsers";
import ChatBody from "../components/chatBody";
import userContext from "../context";
import { getChatsurl } from "../urls";
import "../App.css";
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState({});
  const [isChatSelected, setIsChatSelected] = useState(false);
  const [chats, setChats] = useState([-1]); // its -1 cause chats might be empty even after fetching
  const [notifications, setNotifications] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false); // allows us to fetch chatData on command
  const [updatedContextVal, setUpdatedContextVal] = useState({});
  const ourUser = useContext(userContext);

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
      // updates the userContext with parsed JSON Object
      let response = await JSON.parse(localStorage.getItem("user"));
      setUpdatedContextVal(response);
    }
    update();
  }, []);
  async function getUserChats() {
    /* get ourusers (logged in user) all chatData if successful 
     @returns {Object} - the return object has e2 keys pathSpecified and userChat
     pathSpecified is populated data which is set in chats
    * */
    const response = await fetch(getChatsurl, {
      headers: {
        "content-type": "application/json",
        authorization: localStorage.token,
      },
    });
    const responseJson = await response.json();

    setChats(responseJson.pathSpecified);

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
    // ensures that chat is fetched and updatedContextVal and only then the components are loaded
    chats[0] !== -1 &&
    Object.keys(updatedContextVal).length > 0 && (
      <Box className="App">
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
            />
            <ChatBody
              isChatSelected={isChatSelected}
              setIsChatSelected={setIsChatSelected}
              selectedChat={selectedChat}
              setSelectedChat={setSelectedChat}
              chats={chats}
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
