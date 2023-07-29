import { groupChatsUrl } from "../../urls";
export default async function handleSave(
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
) {
  setIsLoading(true);
  // console.log(
  //   "-----",
  //   usersSelectedToBePartOfGrpChat,
  //   usersSelectedToBePartOfGrpChat.length
  // );
  try {
    const arr = [];
    arr.push(ourUser._id);
    usersSelectedToBePartOfGrpChat.map((user) => {
      arr.push(user._id);
    });
    if (groupName === "") {
      return Toast({
        status: "error",
        duration: 3000,
        title: "Error",
        isClosable: true,
        description: "Please enter group name",
        position: "bottom-left",
      });
    }
    if (usersSelectedToBePartOfGrpChat.length < 2) {
      return Toast({
        status: "error",
        duration: 3000,
        title: "Error",
        isClosable: true,
        description: "Please select atleast 2 users",
        position: "bottom-left",
      });
    }
    const newGrpChat = await fetch(groupChatsUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        name: groupName,
        users: arr,
      }),
    });
    const newGrpChatJson = await newGrpChat.json();
    console.log("newGrpChatJson===", newGrpChatJson);
    setIsLoading(false);
    setSearchUser("");
    setGroupName("");
    setSearchUserResults([]);
    setUsersSelectedToBePartOfGrpChat([]);
    setIsChatSelected(true);
    onClose();
    if (newGrpChat.status === 201) {
      Toast({
        status: "success",
        duration: 3000,
        title: "Success",
        isClosable: true,
        description: "Groupchat created successfully",
        position: "bottom-left",
      });
      setSelectedChat(newGrpChatJson.returnData);

      return;
    }
    if (newGrpChat.status === 500) {
      Toast({
        status: "error",
        duration: 3000,
        title: "Error",
        isClosable: true,
        description: "Failed to create groupchat",
        position: "bottom-left",
      });
      return;
    }
  } catch (err) {
    console.log(err);
    Toast({
      status: "error",
      duration: 3000,
      title: "Error",
      isClosable: true,
      description: "Failed to create groupchat",
    });
  }
}
