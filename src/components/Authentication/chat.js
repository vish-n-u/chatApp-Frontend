import React, { useState } from "react";
import { Flex, Box, Tooltip, HStack, Input, Button } from "@chakra-ui/react";
import ChatHeader from "./chatHeader";
import ChatUser from "./chatUsers";
import ChatBody from "./chatBody";

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState({});
  const [isChatSelected, setIsChatSelected] = useState(false);
  console.log(selectedUser);
  return (
    <Box bg={"blue.100"}>
      <ChatHeader setSelectedUser={setSelectedUser} />
      <Flex height={"90vh"}>
        <ChatUser
          isChatSelected={isChatSelected}
          setIsChatSelected={setIsChatSelected}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <ChatBody
          isChatSelected={isChatSelected}
          setIsChatSelected={setIsChatSelected}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
      </Flex>
    </Box>
  );
};

export default Chat;
