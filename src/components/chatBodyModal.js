import React, { useContext, useEffect, useState } from "react";
import { Box } from "@chakra-ui/layout";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  Image,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { ViewIcon, SmallCloseIcon } from "@chakra-ui/icons";
import updateGroupName from "./helperFunctions.js/updateGroupnameChatBody";
import updateGroupMembers from "./helperFunctions.js/removeUsersChatBody";
import { searchUserurl } from "../urls";
function ChatDataModal({
  selectedChat,
  setSelectedChat,
  ourUser,
  Toast,
  setIsChatSelected,
  setremovedUser,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  // const [usersSelectedToBePartOfGrpChat, setUsersSelectedToBePartOfGrpChat] =
  // useState([]);
  useEffect(() => {
    console.log("useEffect called");
    async function getSearchedUsers() {
      try {
        setIsLoading(true);
        const response = await fetch(`${searchUserurl}${searchUser}`, {
          headers: {
            "content-type": "application/json",
            authorization: localStorage.token,
          },
        });
        const responseJson = await response.json();
        // console.log("before filter", responseJson);
        let newArrData = [];
        responseJson.map((val) => {
          if (val._id !== ourUser._id) newArrData.push(val);
        });
        // console.log(responseJson, newArrData);
        // setIsChatSelected(true);
        setSearchUserResults(newArrData);
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
    getSearchedUsers();
  }, [searchUser]);
  // console.log(selectedChat, "SetSelectedChat - chatBody", isLoading);

  if (Object.keys(selectedChat).length === 0) return;
  const ifChatIsSingleUser = selectedChat.isGroupChat
    ? ""
    : ourUser._id === selectedChat.users[0]._id
    ? selectedChat.users[1]
    : selectedChat.users[0];

  return (
    <>
      <Button mr="5" onClick={onOpen}>
        <ViewIcon />
      </Button>
      <Modal
        blockScrollOnMount={true}
        isCentered={true}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          {!selectedChat.isGroupChat ? (
            <Box /* one-one chat-box*/
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              justifyItems={"center"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <ModalHeader>{ifChatIsSingleUser.username}</ModalHeader>
              <Avatar
                w="20"
                my="2"
                h="20"
                name={ifChatIsSingleUser.username}
                rounded={"full"}
                src={ifChatIsSingleUser.pic}
                alt="user.pic"
              />
              <Text
                mt="4"
                fontFamily={"cursive"}
                fontSize={"lg"}
                fontWeight={"semibold"}
              >
                {ifChatIsSingleUser.email}
              </Text>
              <ModalCloseButton />
              <ModalBody></ModalBody>
              <ModalFooter w="full" display={"flex"} justifyItems={"flex-end"}>
                <Button
                  colorScheme="blue"
                  justifySelf={"flex-end"}
                  onClick={() => onClose()}
                >
                  Close
                </Button>
              </ModalFooter>
            </Box>
          ) : (
            <Box /*Group chat box */
              display={"flex"}
              flexDirection={"column"}
              justifyContent={"center"}
              justifyItems={"center"}
              alignContent={"center"}
              alignItems={"center"}
            >
              <ModalHeader>{selectedChat.name}</ModalHeader>
              <Box display={"flex"}>
                <Input
                  w="50%"
                  mx="2"
                  alignSelf={"self-start"}
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder={selectedChat.name}
                />
                <Button /*Updates Group name */
                  isLoading={isLoading}
                  onClick={() => {
                    if (newGroupName === "") {
                      Toast({
                        status: "error",
                        duration: 3000,
                        title: "Error",
                        description: "Group name cant be empty",
                      });
                      return;
                    }
                    updateGroupName(
                      newGroupName,
                      setNewGroupName,
                      selectedChat,
                      setSelectedChat,
                      Toast,
                      setIsLoading
                    );
                  }}
                >
                  update
                </Button>
                <Text
                  mt="4"
                  fontFamily={"cursive"}
                  fontSize={"lg"}
                  fontWeight={"semibold"}
                >
                  {ifChatIsSingleUser.email}
                </Text>
              </Box>
              {selectedChat.admin === ourUser._id && (
                <>
                  <Box /*Box of red buttons to remove users of grp chat */
                    my="3"
                    display={"flex"}
                    flexWrap={"wrap"}
                    p="3"
                    borderColor={"gray.200"}
                  >
                    {selectedChat.users.map((user) => {
                      if (user._id === ourUser._id) return;

                      return (
                        <Button
                          rightIcon={
                            <SmallCloseIcon
                              position={"absolute"}
                              top="1"
                              h="3"
                              w="3"
                            />
                          }
                          isDisabled={selectedChat.admin !== ourUser._id}
                          h="6"
                          py="2"
                          bgColor={"red.500"}
                          _hover={{ bgColor: "red.600" }}
                          textColor={"white"}
                          m="2"
                          mx="1"
                          key={user._id}
                          onClick={() => {
                            if (selectedChat.users.length - 1 < 3) {
                              Toast({
                                status: "warning",
                                tile: "Err",
                                duration: 3000,
                                description:
                                  "group chat needs atleast 3 members",
                              });
                              return;
                            }

                            updateGroupMembers(
                              ourUser,
                              user._id,
                              selectedChat,
                              setSelectedChat,
                              Toast,
                              setIsLoading,
                              setIsChatSelected,
                              "remove"
                            );
                          }}
                        >
                          {user.username}
                        </Button>
                      );
                    })}
                    <Input //add users input feild
                      placeholder="addUsers"
                      value={searchUser}
                      onChange={(e) => {
                        setSearchUser(e.target.value);
                      }}
                    />
                  </Box>
                  {searchUser !== "" && (
                    <Box
                      // backgroundColor={"black"}
                      w={"70%"}
                      display={"flex"}
                      flexDirection={"column"}
                      alignItems={"center"}
                      overflowY={"auto"}
                      height={"200px"}
                      border={"1px solid "}
                      borderColor={"gray.200"}
                      borderRadius={"lg"}
                      ml="2"
                    >
                      {searchUserResults.length > 0 ? (
                        searchUserResults.map((user) => (
                          <Button
                            onClick={() => {
                              setSelectedUser(user);

                              updateGroupMembers(
                                ourUser,
                                user._id,
                                selectedChat,
                                setSelectedChat,
                                Toast,
                                setIsLoading,
                                setIsChatSelected,

                                "add"
                              );
                            }}
                            minH={"10"}
                            my={"2"}
                            isDisabled={isUserAlreadySelected(
                              user,
                              selectedChat
                            )}
                            leftIcon={<Avatar src={user.pic} w="6" h="6" />}
                            backgroundColor={
                              selectedUser._id == user._id ? "teal.400" : ""
                            }
                            textColor={
                              selectedUser._id == user._id ? "white" : ""
                            }
                            _hover={{ bgColor: "teal.500", textColor: "white" }}
                          >
                            {user.username}
                          </Button>
                        ))
                      ) : (
                        <Text>No user found</Text>
                      )}
                    </Box>
                  )}
                </>
              )}
              <ModalCloseButton />
              <ModalBody></ModalBody>
              <ModalFooter alignSelf={"end"}>
                {ourUser._id !== selectedChat.admin && (
                  <Button
                    mx="2"
                    colorScheme="red"
                    onClick={() => {
                      if (ourUser._id !== selectedChat.admin) {
                        updateGroupMembers(
                          ourUser,
                          ourUser._id,
                          selectedChat,
                          setSelectedChat,
                          Toast,
                          setIsLoading,
                          setIsChatSelected,
                          "remove"
                        );
                        onClose();
                      }
                    }}
                  >
                    Leave Group
                  </Button>
                )}
                <Button colorScheme="blue" onClick={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </Box>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
function isUserAlreadySelected(user, selectedChat) {
  for (let x = 0; x < selectedChat.users.length; x++) {
    if (user._id === selectedChat.users[x]._id) return true;
  }
  return false;
}

export default ChatDataModal;
