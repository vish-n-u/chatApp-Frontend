import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  getSearchedUsers,
  handleClickFunction,
} from "./helperFunctions.js/chatHeaderFunctions";
import { SearchIcon } from "@chakra-ui/icons";

const SearchDrawer = ({
  isSearchIconClicked,
  setIsSearchIconClicked,
  setSearchUsers,
  searchUsers,
  chats,
  setChats,
  searchResultUsers,
  setsearchResultUsers,
  isLoading,
  setIsLoading,
  Toast,
  setIsChatSelected,
  setSelectedChat,
}) => {
  useEffect(() => {
    getSearchedUsers(searchUsers, setsearchResultUsers, setIsLoading, Toast);
  }, []);
  return (
    <Drawer
      isOpen={isSearchIconClicked}
      onClose={() => {
        setIsSearchIconClicked(false);
        setSearchUsers("");
      }}
      placement="left"
    >
      {" "}
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Search Users</DrawerHeader>

        <DrawerBody>
          <HStack mb="8">
            <Input
              onChange={(e) => setSearchUsers(e.target.value)}
              value={searchUsers}
              placeholder="Type here..."
            />
            <IconButton
              aria-label="Search database"
              isLoading={isLoading}
              onClick={() => {
                // console.log("searcgUser", searchUsers);

                getSearchedUsers(
                  searchUsers,
                  setsearchResultUsers,
                  setIsLoading,
                  Toast
                );
              }}
              icon={<SearchIcon />}
            />
          </HStack>
          {searchResultUsers.map((val) => (
            <Button
              key={val._id}
              display={"flex"}
              w={"full"}
              // m={"2"}
              my={"4"}
              py={"2"}
              h={"16"}
              backgroundColor={"gray.100"}
              _hover={{ color: "white", backgroundColor: "teal" }}
              variant={"ghost"}
              textAlign={"left"}
              borderRadius={"lg"}
              justifyContent={"flex-start"}
              onClick={() => {
                setIsSearchIconClicked(false);
                setSearchUsers("");

                handleClickFunction(
                  val,
                  Toast,
                  setIsLoading,
                  setSelectedChat,
                  setIsChatSelected,
                  chats,
                  setsearchResultUsers,
                  setChats
                );
              }}
            >
              <Box w="full" display={"flex"}>
                <Avatar src={val.pic} w="7" h="7" alt="userImg.jpg" />
                <Box w="70%" ml="2" display={"flex"} flexDirection={"column"}>
                  <Text w="full" textAlign={"left"} alignItems={"start"}>
                    {val.isGroup ? val.groupName : val.username}
                  </Text>

                  <span style={{ width: "110%", overflow: "clip" }}>
                    {val.email}
                  </span>
                </Box>
              </Box>
            </Button>
          ))}
          {searchResultUsers.length == 0 && <Text>No user found.</Text>}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default SearchDrawer;
