import React, { useState, useContext } from "react";
import { Box, useToast } from "@chakra-ui/react";

import userContext from "../context";
import SearchDrawer from "./searchDrawer";
import Header from "./header";
// The parent component which consists of the Header and Drawer components
const ChatHeader = ({
  selectedChat,
  setSelectedChat,
  setIsChatSelected,
  chats,
  setChats,
  notifications,
}) => {
  const [isSearchIconClicked, setIsSearchIconClicked] = useState(false); // opens the drawer for searching user
  const [searchResultUsers, setsearchResultUsers] = useState([]); // stores the response of searched user
  const [searchUsers, setSearchUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const Toast = useToast();
  let ourUser = useContext(userContext);

  return (
    <>
      <Box
        backgroundColor={"white"}
        borderRadius={"md"}
        padding={"4"}
        display={"flex"}
        alignItems={"center"}
        mt={"2"}
        pt={"2"}
        justifyContent={"space-between"}
      >
        <Header
          notifications={notifications}
          setIsChatSelected={setIsChatSelected}
          setSelectedChat={setSelectedChat}
          setIsSearchIconClicked={setIsSearchIconClicked}
          ourUser={ourUser}
        />
      </Box>
      {searchResultUsers && (
        <SearchDrawer
          isSearchIconClicked={isSearchIconClicked}
          setIsSearchIconClicked={setIsSearchIconClicked}
          setSearchUsers={setSearchUsers}
          searchUsers={searchUsers}
          chats={chats}
          setChats={setChats}
          searchResultUsers={searchResultUsers}
          setsearchResultUsers={setsearchResultUsers}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          Toast={Toast}
          setSelectedChat={setSelectedChat}
          setIsChatSelected={setIsChatSelected}
        />
      )}
    </>
  );
};

export default ChatHeader;
