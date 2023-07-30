import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Tooltip,
  HStack,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerHeader,
  IconButton,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useToast,
  color,
  Badge,
} from "@chakra-ui/react";
import { Avatar, StatDownArrow } from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import {
  handleClickFunction,
  getSearchedUsers,
} from "./helperFunctions.js/chatHeaderFunctions";
import { getUsersChatsurl } from "../urls";
import UserProfile from "./userProfile";
import userContext from "../context";

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
  const [clickedUser, setClickedUser] = useState({}); // stores the value of the user selected in search results
  const Navigate = useNavigate();
  const Toast = useToast();
  let ourUser = useContext(userContext);
  // ourUser = ourUser.user;
  console.log("selected chat", searchResultUsers, chats, selectedChat, ourUser);
  useEffect(() => {
    async function getUsers() {
      if (!isSearchIconClicked || !searchUsers) return;
      const response = await fetch(getUsersChatsurl, {
        headers: {
          "content-type": "application/json",
          authorization: localStorage.token,
        },
      });
      const responseJson = await response.json();
      setsearchResultUsers(responseJson);
    }

    getUsers();
  }, [isSearchIconClicked]);
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
        <div>
          <Tooltip label="Search for users">
            <Button onClick={() => setIsSearchIconClicked(true)}>
              <SearchIcon mr={"2"} /> Search
            </Button>
          </Tooltip>
        </div>
        <span style={{ textAlign: "center", fontSize: "20px" }}>MeChat!</span>
        <Box display={"flex"} flexDirection={{ md: "row", base: "column" }}>
          <Menu>
            <MenuButton marginX={"3"}>
              <BellIcon w={"7"} h={"10"} color={"gray.800"} />
              <Badge
                px="6px"
                py="4px"
                bgColor={"red.400"}
                rounded={"full"}
                position={"relative"}
                top={"-3"}
                right="3.5"
                paddingX={"7px"}
                paddingY="2px"
              >
                {notifications?.length}
              </Badge>
            </MenuButton>
            <MenuList px="2">
              {notifications.map((notification) => {
                return (
                  <MenuItem
                    _hover={{ bgColor: "teal.400", color: "white" }}
                    display={"flex"}
                    px="2"
                    flexDirection={"column"}
                    onClick={() => {
                      console.log(
                        "notifications----",
                        selectedChat,
                        notification.ChatId
                      );
                      setIsChatSelected(true);
                      setSelectedChat(notification.chatId);
                    }}
                  >
                    <Text fontSize={"lg"} fontWeight={"semibold"}>
                      Message from{" "}
                      {notification.chatId.isGroupChat
                        ? notification.chatId.name
                        : notification.sender.username}
                    </Text>
                    {/* <Text alignSelf={"self-start"}>{notification.content}</Text> */}
                  </MenuItem>
                );
              })}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              marginX={"1"}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar w="7" h="7" name={ourUser?.username} src={ourUser?.pic} />
            </MenuButton>

            <MenuList>
              <UserProfile user={ourUser}>
                <MenuItem>My Profile</MenuItem>
              </UserProfile>

              <MenuDivider />
              <MenuItem
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  Navigate("/login");
                }}
              >
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Box>
      {searchResultUsers && (
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
                    if (searchUsers == "") {
                      Toast({
                        status: "warning",
                        duration: 3000,
                        title: "warning",
                        isClosable: true,
                        description: "Search can't be empty!",
                        position: "top-left",
                      });
                      return;
                    }
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
                  m={"2"}
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
                    setClickedUser(val);
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
                    <Box
                      w="70%"
                      ml="2"
                      display={"flex"}
                      flexDirection={"column"}
                    >
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
      )}
    </>
  );
};

export default ChatHeader;
