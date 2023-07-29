import {
  Button,
  Modal,
  ModalBody,
  ModalOverlay,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalCloseButton,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import React from "react";

const UserProfile = ({ user }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  console.log("user", user);
  return (
    <>
      <Button
        w="full"
        variant={"ghost"}
        justifyContent={"flex-start"}
        onClick={onOpen}
      >
        Profile
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} justifyContent={"center"}>
            <Avatar
              h="20"
              w="20"
              rounded={"full"}
              src={user.pic}
              name={user.username}
              alt="pic.jpg"
              alignItems={"center"}
            />
          </ModalBody>
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            fontWeight={"semibold"}
            fontSize={"xl"}
          >
            {user.username}
          </ModalBody>
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            fontSize={"large"}
          >
            {user.email}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserProfile;
