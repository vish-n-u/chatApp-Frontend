import { BellIcon, ChevronDownIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
import UserProfile from "./userProfile";

const Header = ({
  notifications,
  setIsChatSelected,
  setSelectedChat,
  setIsSearchIconClicked,
  ourUser,
}) => {
  const Navigate = useNavigate();
  return (
    <>
      <div>
        <Tooltip label="Search for users">
          <Button
            /*opens the drawer*/
            onClick={() => setIsSearchIconClicked(true)}
          >
            {" "}
            <SearchIcon mr={"2"} /> Search
          </Button>
        </Tooltip>
      </div>
      <span style={{ textAlign: "center", fontSize: "20px" }}>MeChat!</span>
      <Box display={"flex"} flexDirection={{ md: "row", base: "column" }}>
        <Menu>
          {/* bell icon and the notification badge*/}
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
              // list of notification
              return (
                <MenuItem
                  _hover={{ bgColor: "teal.400", color: "white" }}
                  display={"flex"}
                  px="2"
                  flexDirection={"column"}
                  onClick={() => {
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
          {/** Shows the user profile and a logout option */}
          <MenuButton as={Button} marginX={"1"} rightIcon={<ChevronDownIcon />}>
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
                Navigate("/");
              }}
            >
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Box>
    </>
  );
};

export default Header;
