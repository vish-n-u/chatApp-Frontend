import React, { useContext } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";

import userContext from "../context";
import SearchModal from "./searchModal";

const ChatUser = ({
  isChatSelected,
  setIsChatSelected,
  selectedChat,
  setSelectedChat,
  chats,
  setChats,
}) => {
  const ourUser = useContext(userContext);

  console.log(selectedChat, "SetSelectedChat - chatUsers", chats, ourUser);
  return (
    <Box
      hideBelow={isChatSelected && "md"}
      display={"flex"}
      flexDirection={"column"}
      backgroundColor="white"
      m={"5"}
      p={"5"}
      borderRadius={"md"}
      height="90% "
      w={{ base: "100%", md: "30%" }}
    >
      <Flex w="full" justify={"space-between"}>
        <Text fontSize={"2xl"}>MyChat</Text>
        <Button display={"flex"}>
          <SearchModal
            ourUser={ourUser}
            setChats={setChats}
            setSelectedChat={setSelectedChat}
            setIsChatSelected={setIsChatSelected}
          />
        </Button>
      </Flex>
      <Stack
        mt={10}
        direction="column"
        alignItems="center"
        overflowY="auto"
        height="900px"
        // Adjust the height as needed
      >
        {chats.length > 0 &&
          chats.map((chatData) => {
            return chatData.users.map((user, index) => {
              if (chatData.isGroupChat && index > 0) return;

              if (!chatData.isGroupChat && ourUser._id === user._id) return;

              return (
                // <Box key={chatData._id}>
                <Button
                  backgroundColor={
                    selectedChat._id == chatData._id ? "teal.400" : ""
                  }
                  textColor={selectedChat._id == chatData._id ? "white" : ""}
                  _hover={{ bgColor: "teal.500", textColor: "white" }}
                  key={chatData._id}
                  w="80%"
                  minH="10"
                  onClick={() => {
                    setIsChatSelected(true);
                    setSelectedChat(chatData);
                  }}
                >
                  {chatData.isGroupChat ? chatData.name : user.username}
                </Button>
                // </Box>
              );
            });
          })}
      </Stack>
    </Box>
  );
};

export default ChatUser;
