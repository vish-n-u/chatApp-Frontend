import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Flex,
  Box,
  Tooltip,
  HStack,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerFooter,
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
  VStack,
  color,
} from "@chakra-ui/react";
import { Avatar, StatDownArrow } from "@chakra-ui/react";
import { ChevronDownIcon, BellIcon, SearchIcon } from "@chakra-ui/icons";
import UserProfile from "./userProfile";
import userContext from "../../context";

const ChatHeader = ({ setSelectedUser }) => {
  const [isSearchIconClicked, setIsSearchIconClicked] = useState(false);
  const [otherUsers, setOtherUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [clickedUser, setClickedUser] = useState({}); // selected user
  const Navigate = useNavigate();
  const Toast = useToast();
  const ourUser = useContext(userContext).user;
  console.log(ourUser);

  useEffect(() => {
    async function getUsers() {
      if (!isSearchIconClicked) return;
      const response = await fetch(
        "http://localhost:5000/chatApp/api/v1/users",
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
      setOtherUsers(responseJson);
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
        <div>
          <Menu>
            <MenuButton>
              <BellIcon w={"7"} h={"10"} color={"gray.800"} />
            </MenuButton>
          </Menu>
          <Menu>
            <MenuButton as={Button} mx={"3"} rightIcon={<ChevronDownIcon />}>
              <Avatar w="7" h="7" name={ourUser.username} src={ourUser.pic} />
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
        </div>
      </Box>
      {otherUsers && (
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
                    console.log("searcgUser", searchUsers);
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
                      setOtherUsers,
                      setIsLoading,
                      Toast
                    );
                  }}
                  icon={<SearchIcon />}
                />
              </HStack>
              {otherUsers.map((val) => (
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
                    setSelectedUser(val);
                    setClickedUser(val);
                    handleClickFunction(val, Toast, setIsLoading);
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
              {otherUsers.length == 0 && <Text>No user found.</Text>}
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

async function handleClickFunction(val, Toast, setIsLoading) {
  setIsLoading(true);
  try {
    const createNewChat = await fetch(
      "http://localhost:5000/chatApp/api/v1/chats",
      {
        method: "POST",
        body: JSON.stringify({
          userId: val._id,
        }),
        headers: {
          "content-type": "application/json",
          authorization: localStorage.getItem("token"),
        },
      }
    );
    const createNewChatJson = await createNewChat.json();
    console.log("createNewChatJson====", createNewChatJson);
    setIsLoading(false);
    if (createNewChat.status == 500) {
      Toast({
        status: "error",
        duration: 3000,
        title: "error",
        isClosable: true,
        description: "Internal server error",
        position: "bottom",
      });
    }
  } catch (err) {
    console.log(err);
    Toast({
      status: "error",
      duration: 3000,
      title: "error",
      isClosable: true,
      description: "Internal server error",
      position: "bottom",
    });
  }
}
async function getSearchedUsers(
  searchUsers,
  setOtherUsers,
  setIsLoading,
  Toast
) {
  try {
    const ourUser = JSON.parse(localStorage.getItem("user"));
    setIsLoading(true);
    const response = await fetch(
      `http://localhost:5000/chatApp/api/v1/users?search=${searchUsers}`,
      {
        headers: {
          "content-type": "application/json",
          authorization: localStorage.token,
        },
      }
    );
    const responseJson = await response.json();
    console.log("before filter", responseJson);
    let newArrData = [];
    responseJson.map((val) => {
      if (val._id !== ourUser._id) newArrData.push(val);
    });
    console.log(responseJson, newArrData);

    setOtherUsers(responseJson);
    setIsLoading(false);
  } catch (err) {
    console.log(err);
    setIsLoading(false);
    Toast({
      status: "error",
      duration: 3000,
      title: "Error",
      isClosable: true,
      description: "Failed to load search results",
      position: "bottom-left",
    });
    return;
  }
}

export default ChatHeader;
