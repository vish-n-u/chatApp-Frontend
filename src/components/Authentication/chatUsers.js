import React, { useEffect, useState, useContext } from "react";
import { Box, Flex, Stack, Text } from "@chakra-ui/layout";
import { Button, Hide } from "@chakra-ui/react";
import { AddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import userContext from "../../context";
import BasicUsage from "./alertModal";

const ChatUser = ({
  isChatSelected,
  setIsChatSelected,
  selectedUser,
  setSelectedUser,
}) => {
  const [otherUsers, setOtherUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const ourUser = useContext(userContext).user;
  useEffect(() => {
    async function getUsers() {
      const response = await fetch(
        "http://localhost:5000/chatApp/api/v1/chats",
        {
          headers: {
            "content-type": "application/json",
            authorization: localStorage.token,
          },
        }
      );
      const responseJson = await response.json();
      // console.log("before filter", responseJson);
      // let newArrData = [];
      // responseJson.userChat.map((obj) => {
      //   obj.users.map((user) => {
      //     if (user._id !== ourUser._id) newArrData.push(user);
      //   });
      // });
      // console.log("response", response, responseJson, newArrData, ourUser._id);
      console.log("====responseJson", responseJson);
      setChats(responseJson.pathSpecified);
    }
    getUsers();
  }, [selectedUser]);

  return (
    <Box
      display={"base" && isChatSelected ? "none" : "flex"}
      flexDirection={"column"}
      backgroundColor="white"
      m={"5"}
      p={"5"}
      borderRadius={"md"}
      height="80% "
      w={{ base: "100%", md: "30%" }}
    >
      <Flex w="full" justify={"space-between"}>
        <Text fontSize={"2xl"}>MyChat</Text>
        <Button display={"flex"}>
          <BasicUsage ourUser={ourUser} /> 
        </Button>
      </Flex>
      <Stack
        mt={10}
        direction="column"
        alignItems="center"
        overflowY="auto"
        height="900px" // Adjust the height as needed
      >
        {chats.length > 0 &&
          chats.map((chatData) => {
            return chatData.users.map((user) => {
              if (ourUser._id === user._id) return;
              return (
                // <Box key={chatData._id}>
                <Button
                  backgroundColor={
                    selectedUser._id == user._id ? "teal.400" : ""
                  }
                  textColor={selectedUser._id == user._id ? "white" : ""}
                  _hover={{ bgColor: "teal.500", textColor: "white" }}
                  key={chatData._id}
                  w="80%"
                  onClick={() => {
                    setIsChatSelected(true);
                    setSelectedUser(chatData);
                  }}
                >
                  {chatData.isGroup ? chatData.groupName : user.username}
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
