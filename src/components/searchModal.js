import { CloseIcon, AddIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  Input,
  useToast,
  Box,
  Avatar,
  Toast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import handleSave from "./helperFunctions.js/alertModal";
import { searchUserurl } from "../urls";

function SearchModal({
  ourUser,
  chats,
  setChats,
  setSelectedChat,
  setIsChatSelected,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchUserResults, setSearchUserResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});
  const [usersSelectedToBePartOfGrpChat, setUsersSelectedToBePartOfGrpChat] =
    useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const Toast = useToast();
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
  // console.log(
  //   "usersSelectedToBePartOfGrpChat===",
  //   usersSelectedToBePartOfGrpChat
  // );
  return (
    <>
      <AddIcon mr="2" w={"10%"} onClick={onOpen} /> New Group Chat
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader alignSelf={"center"}>Create groupchat</ModalHeader>
          <Input
            type="text"
            value={groupName}
            w="50%"
            ml={"3"}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="enter group name..."
          />
          <ModalCloseButton />
          <ModalBody>
            <Text>Add users</Text>
            <Input
              type="text"
              placeholder="Add names like john doe,jane smith etc...."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <Box my="3" display={"flex"} flexWrap={"wrap"}>
              {usersSelectedToBePartOfGrpChat.length > 0 &&
                usersSelectedToBePartOfGrpChat.map((user, index) => (
                  <Button
                    m="2"
                    h="8"
                    key={user._id}
                    onClick={() => {
                      let arr = [...usersSelectedToBePartOfGrpChat];
                      arr.splice(index, 1);
                      setUsersSelectedToBePartOfGrpChat(arr);
                    }}
                    rightIcon={
                      <CloseIcon
                        h={"2"}
                        w="2"
                        position={"absolute"}
                        top={"2"}
                      />
                    }
                    backgroundColor={"purple.500"}
                    textColor={"white"}
                    _hover={{ bgColor: "purple.300" }}
                  >
                    <Avatar src={user.pic} w="6" h="6" mr="2" />
                    {user.username}
                  </Button>
                ))}
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
                      isDisabled={isUserAlreadySelected(
                        user,
                        usersSelectedToBePartOfGrpChat
                      )}
                      onClick={() => {
                        setSelectedUser(user);
                        let arr = [...usersSelectedToBePartOfGrpChat];
                        arr.push(user);
                        setUsersSelectedToBePartOfGrpChat(arr);
                      }}
                      minH={"10"}
                      my={"2"}
                      leftIcon={<Avatar src={user.pic} w="6" h="6" />}
                      backgroundColor={
                        selectedUser._id == user._id ? "teal.400" : ""
                      }
                      textColor={selectedUser._id == user._id ? "white" : ""}
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
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                handleSave(
                  groupName,
                  ourUser,
                  usersSelectedToBePartOfGrpChat,
                  Toast,
                  onClose,
                  setIsLoading,
                  setChats,
                  setSelectedChat,
                  setSearchUser,
                  setGroupName,
                  setSearchUserResults,
                  setUsersSelectedToBePartOfGrpChat,
                  setIsChatSelected
                );
              }}
            >
              save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function isUserAlreadySelected(user, usersSelectedToBePartOfGrpChat) {
  for (let x = 0; x < usersSelectedToBePartOfGrpChat.length; x++) {
    if (user._id === usersSelectedToBePartOfGrpChat[x]._id) return true;
  }
  return false;
}

export default SearchModal;
