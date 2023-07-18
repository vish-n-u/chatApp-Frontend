import React from "react";
import { Box } from "@chakra-ui/layout";

const ChatBody = ({
  isChatSelected,
  setIsChatSelected,
  selectedUser,
  setSelectedUser,
}) => {
  console.log("----", selectedUser);
  return (
    <Box
      display={{ base: isChatSelected ? "flex" : "none", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      backgroundColor="white"
      borderRadius={"md"}
      m={"5"}
      height="80% "
      w={{ base: "95%", md: "65%" }}
    >
      Chats
    </Box>
  );
};

export default ChatBody;
